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

    /*
    it("Can talk to dummy server", function (done) {

        var onEcpErrorCallback = sinon.spy();
        var onErrorCallback = sinon.spy();
        var onSamlTimeoutCallback = sinon.spy();
        var onResourceTimeoutCallback = sinon.spy();

        //var xhr = new xhrSamlEcpJs.SamlEcpClientXHR(xhrTestUtils.createNativeXhr());
        xhrSamlEcpJs.SamlEcpClientXHR.config({
            options: {
                idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP",
                username : 'bob',
                onEcpAuth : function(authCtx) {
                    authCtx.setPassword('bob');
                    authCtx.retryAuth();
                }
            },
            aclList: [{
                    urlPattern : "^http://localhost:3100/private",
                    options : {
                        samlTimeout : 0,
                        resourceTimeout : 0,
                        onEcpError : onEcpErrorCallback,
                        onError : onErrorCallback,
                        onSamlTimeout : onSamlTimeoutCallback,
                        onResourceTimeout : onResourceTimeoutCallback
                    }
                }
            ]
        });

        xhrAdaptorJs.manager.injectWrapper(xhrSamlEcpJs.SamlEcpClientXHR);

        var xhr = new XMLHttpRequest();

        xhr.open("get", "http://localhost:3100/private");
        xhr.onreadystatechange = function() {
          if(this.readyState == 4) {
              assert.equal(this.responseText, "Hello World!");
              done();
          }
        };
        xhr.send();
    });
    */
});