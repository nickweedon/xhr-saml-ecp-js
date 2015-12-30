var xhrSamlEcpJs = xhrSamlEcpJs || {};

/**
 * @summary The SamlEcpClientXHR allows a response to be intercepted and processed while queuing all other requests until processing is complete
 *
 * This class is allows special processing to occur in certain situations, based on an ajax response, while queuing background requests.
 * A callback is provided to allow the queued requests to be processed meaning that the 'special processing' can occur asynchronously.
 * An example use case for the SamlEcpClientXHR is where it can be used to pop open an authentication dialog and wait for a user to authenticate,
 * meanwhile all requests are queued while the system waits for the user's input. This prevents the scenario of having multiple ajax calls being denied since
 * once the user is authenticated, the queued requests can then continue through to the server where they can be processed normally, in an authenticated context.
 *
 * @class
 * @memberOf xhrSamlEcpJs
 * @augments xhrAdaptorJs.XHRWrapper
 * @tutorial BlockingRequestQueue
 *
 * @param {XMLHttpRequest} impl The implementation object that this SamlEcpClientXHR object is to wrap.
 *
 */
xhrSamlEcpJs.SamlEcpClientXHR = function(impl) {
	xhrBQJs.BlockingRequestQueueXHR.prototype.constructor.call(this, impl);
};

xhrSamlEcpJs.SamlEcpClientXHR.prototype = Object.create(xhrBQJs.BlockingRequestQueueXHR.prototype);
xhrSamlEcpJs.SamlEcpClientXHR.constructor = xhrSamlEcpJs.SamlEcpClientXHR;

function applyConfig(target, source) {
	for(var key in source) {
		if(source.hasOwnProperty(key))
			target[key] = source[key];
	}
}

xhrSamlEcpJs.SamlEcpClientXHR.responseHandler = function(doContinue, xhr) {

	var acl = getAclForURL(xhr.openArgs[1]);

	if(acl === null) {
		doContinue(true);
		return;
	}

	var parsedHeaderObj = samlEcpClientJs.Client.parseResponseHeadersString(xhr.getAllResponseHeaders());
	var isAuthRequest = samlEcpClientJs.Client.isResponseAnAuthRequest(parsedHeaderObj, xhr.responseText);

	// TODO: Need to also consider/test POST, DELETE etc
	/*
	 // For now, if this is not a GET request then just ignore it
	if(this.openArgs[0].toUpperCase() !== "GET") {
		doContinue(true);
		return;
	}
	*/

	if(!isAuthRequest) {
		doContinue(true);
		return;
	}

	var mandatoryClientOptions = {
		xhrFactory : function() {
			var samlXhr = new XMLHttpRequest();
			samlXhr.bypassFilter = true;

			return samlXhr;
		}
	};

	var effectiveOptions = {};
	applyConfig(effectiveOptions, xhrSamlEcpJs.SamlEcpClientXHR.configObj.options);
	applyConfig(effectiveOptions, mandatoryClientOptions);

	var samlClient = new samlEcpClientJs.Client(effectiveOptions);

	var samlConfig = {};

	applyConfig(samlConfig, acl.options);
	samlConfig.onSuccess = function() {
		if(acl.options !== undefined && acl.options.onSuccess !== undefined) {
			acl.options.onSuccess.apply(this, arguments);
		}
		// Unblock the queue and resend the original request
		doContinue(false);
		xhr.open.apply(xhr, xhr.openArgs);
		xhr.send();
	};

	samlClient.auth(xhr.responseText, xhr.openArgs[1], samlConfig);

};

function getAclForURL(url) {

	for(var acl in xhrSamlEcpJs.SamlEcpClientXHR.configObj.aclList) {

		if(!xhrSamlEcpJs.SamlEcpClientXHR.configObj.aclList.hasOwnProperty(acl)) {
			continue;
		}

		var aclConfig = xhrSamlEcpJs.SamlEcpClientXHR.configObj.aclList[acl];

		if(new RegExp(aclConfig.urlPattern, "g").test(url)) {
			return aclConfig;
		}
	}

	return null;
}

/**
 *
 * {
 * 	 options: {
 *		idpEndpointUrl: "http://myfallbackidp.com:3000/idp/profile/SAML2/SOAP/ECP"
 * 	 },
 *   aclList: [{
 *   	urlPattern : "/^http://blah.com/"
 *      options : {
 *			idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP"
 *      },
 *   	match : "/^http://otherblah.com/"
 *      options : {
 *			idpEndpointUrl: "http://www.sillyidp.com/idp/profile/SAML2/SOAP/ECP"
 *      }
 * }
 *
 * @param configObj
 */
xhrSamlEcpJs.SamlEcpClientXHR.config = function(configObj) {
	xhrSamlEcpJs.SamlEcpClientXHR.configObj = configObj;

	// Register the blocking response handler for each of the acls
	for(var acl in configObj.aclList) {

		if(!configObj.aclList.hasOwnProperty(acl)) {
			continue;
		}
		var aclConfig = configObj.aclList[acl];

		xhrBQJs.BlockingRequestQueueXHR.registerResponseHandler(aclConfig.urlPattern, this.responseHandler);
	}
};

// Open resets the request headers
xhrSamlEcpJs.SamlEcpClientXHR.prototype.open = function() {

	this.requestHeaders = {};

	xhrBQJs.BlockingRequestQueueXHR.prototype.open.apply(this, arguments);
};

// Need to know if the PAOS header has been set (cannot read request headers normally)
// Setting the PAOS header twice will result in a rubbish string as its value will be repeated
// (W3 org section 4.6.2 - http://www.w3.org/TR/XMLHttpRequest/)
xhrSamlEcpJs.SamlEcpClientXHR.prototype.setRequestHeader = function(headerKey, headerValue) {

	var lcHeaderKey = headerKey.toLowerCase();

	if(lcHeaderKey in this.requestHeaders) {
		var headerValueArray = this.requestHeaders[lcHeaderKey];

		// Don't add the same 'accept' header/value pair twice
		// This is a bit of a hack but the 'accept' list should be a unique set anyhow
		if(lcHeaderKey == "accept" && headerValueArray.indexOf(headerValue) !== -1) {
			return;
		}
		headerValueArray.push(headerValue);
	} else {
		this.requestHeaders[lcHeaderKey] = [headerValue];
	}

	xhrBQJs.BlockingRequestQueueXHR.prototype.setRequestHeader.apply(this, arguments);
};

// Add the PAOS header if this request matches an ACL and the header has not already been added
xhrSamlEcpJs.SamlEcpClientXHR.prototype.send = function() {

	if(!this.isPAOSHeaderSet) {
		var acl = getAclForURL(this.openArgs[1]);

		if(acl !== null) {
			if(!this.requestHeaders.hasOwnProperty('paos')) {
				this.setRequestHeader('PAOS', 'ver="urn:liberty:paos:2003-08";"urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"');
			}
			// If accept has not already been set then set it to */* so that we don't accidentally constrain
			// the request to ONLY accepting PAOS
			if(!this.requestHeaders.hasOwnProperty('accept')) {
				this.setRequestHeader('Accept', '*/*');
			}
			this.setRequestHeader('Accept', 'text/html; application/vnd.paos+xml');
		}
	}

	xhrBQJs.BlockingRequestQueueXHR.prototype.send.apply(this, arguments);
};
