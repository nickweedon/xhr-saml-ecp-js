define('xhr-saml-ecp-js',
    
	['xhr-adaptor-js', 'xhr-blocking-queue-js', 'saml-ecp-client-js'],
    function (xhrAdaptorJsNS, xhrBQJsNS, samlEcpClientJsNS) {

		/**
		 * For the AMD module version of the library, the xhrSamlEcpJs namespace
		 * does not exist but refers instead to the AMD module itself.
		 *
		 * @summary The xhrAdaptorJs namespace and AMD module
		 * @version 1.0
		 * @exports xhr-saml-ecp-js
		 * @namespace {object} xhrSamlEcpJs
		 */
		var xhrAdaptorJs = xhrAdaptorJsNS;
		var xhrBQJs = xhrBQJsNS;
		var samlEcpClientJs = samlEcpClientJsNS;

		var xhrSamlEcpJs = xhrSamlEcpJs || {};

		//@@include('SamlEcpXhr.js')

		return xhrSamlEcpJs;
	}
);
