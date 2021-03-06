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

	if(!isAuthRequest) {
		doContinue(true);
		return;
	}

	var mandatoryClientOptions = {
		xhrFactory : function() {
			var samlXhr = new XMLHttpRequest();
			samlXhr.bypassFilter = true;

			return samlXhr;
		},
		retrieveResource : false
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
		// Resend the original request and unblock the queue
		xhr.bypassFilter = true;
		xhr.resend();
		xhr.bypassFilter = false;
		doContinue(false);
	};
	samlConfig.onEcpError = function() {
		if(acl.options !== undefined && acl.options.onEcpError !== undefined) {
			acl.options.onEcpError.apply(this, arguments);
		}
		// Avoid deadlock and ensure that the request is unblocked
		doContinue(false);
	};
	samlConfig.onError = function() {
		if(acl.options !== undefined && acl.options.onError !== undefined) {
			acl.options.onError.apply(this, arguments);
		}
		// Avoid deadlock and ensure that the request is unblocked
		doContinue(false);
	};
	samlConfig.onSamlTimeout = function() {
		if(acl.options !== undefined && acl.options.onSamlTimeout !== undefined) {
			acl.options.onSamlTimeout.apply(this, arguments);
		}
		// Avoid deadlock and ensure that the request is unblocked
		doContinue(false);
	};
	samlConfig.onResourceTimeout = function() {
		if(acl.options !== undefined && acl.options.onResourceTimeout !== undefined) {
			acl.options.onResourceTimeout.apply(this, arguments);
		}
		// Avoid deadlock and ensure that the request is unblocked
		doContinue(false);
	};

	samlClient.auth(xhr.openArgs[0], xhr.responseText, xhr.openArgs[1], xhr.sendArgs[0],
		samlConfig, xhr.getAllRequestHeaders());
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

// Add the PAOS header if this request matches an ACL and the header has not already been added
xhrSamlEcpJs.SamlEcpClientXHR.prototype.send = function() {

	var acl = getAclForURL(this.openArgs[1]);

	if(acl !== null) {
		if(!this.isRequestHeaderSet('PAOS')) {
			this.setRequestHeader('PAOS', 'ver="urn:liberty:paos:2003-08";"urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"');
		}

		// If accept has not already been set then set it to */* so that we don't accidentally constrain
		// the request to ONLY accepting PAOS
		if(!this.isRequestHeaderSet('ACCEPT')) {
			this.setRequestHeader('Accept', '*/*');
		}

		// Don't add the PAOS header twice
		if(!this.requestHeaderContains("ACCEPT", 'text/html; application/vnd.paos+xml')) {
			this.setRequestHeader('Accept', 'text/html; application/vnd.paos+xml');
		}
	}

	xhrBQJs.BlockingRequestQueueXHR.prototype.send.apply(this, arguments);
};
