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
	// Set by 'open'
	this.openArgs = null;
	this.parent().constructor.call(this, impl);
};

xhrSamlEcpJs.SamlEcpClientXHR.prototype = Object.create(xhrBQJs.BlockingRequestQueueXHR.prototype);
xhrSamlEcpJs.SamlEcpClientXHR.constructor = xhrSamlEcpJs.SamlEcpClientXHR;
