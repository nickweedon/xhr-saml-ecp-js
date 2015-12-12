describe('SamlEcpClientXHR Test', function() {

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
        //TODO: Look at a proper method for clearing handlers
        //xhrSamlEcpJs.SamlEcpClientXHR.clearResponseHandlers();
    });

    it("Can instantiate successfully", function () {
        var xhr = new xhrSamlEcpJs.SamlEcpClientXHR(xhrTestUtils.createNativeXhr());
        assert.ok( xhr !== undefined, "Failed to instantiate xhrSamlEcpJs.SamlEcpClientXHR" );
    });

    it("Can talk to dummy server", function (done) {
       var xhr = new XMLHttpRequest();

        xhr.open("get", "http://localhost:3000");
        xhr.onreadystatechange = function() {
          if(this.readyState == 4) {
              assert.equal(this.responseText, "Hello World!");
              done();
          }
        };
        xhr.send();
    });
});