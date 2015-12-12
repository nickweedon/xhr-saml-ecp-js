describe('BlockingRequestQueueXHR Test', function() {

    var xhrSamlEcpJs = null;
    var xhrAdaptorJs = null;
    var xhrTestUtils = null;

    beforeEach(function(done) {
        require(["xhr-saml-ecp-js", "xhr-adaptor-js", "xhrTestUtils"], function(xhrSamlEcpJsNS, xhrAdaptorJsNS, xhrTestUtilsNS) {
            xhrSamlEcpJs = xhrSamlEcpJsNS;
            xhrAdaptorJs = xhrAdaptorJsNS;
            xhrTestUtils = xhrTestUtilsNS;
            done();
        });
    });

    afterEach(function () {
        xhrAdaptorJs.manager.resetXHR();
        xhrSamlEcpJs.SamlEcpClientXHR.clearResponseHandlers();
    });

    it("Can instantiate successfully", function () {
        var xhr = new xhrSamlEcpJs.SamlEcpClientXHR(xhrTestUtils.createNativeXhr());
        assert.ok( xhr !== undefined, "Failed to instantiate xhrSamlEcpJs.SamlEcpClientXHR" );
    });
});