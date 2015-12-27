describe('SamlEcpClientXHR Test', function() {

    var xhrSamlEcpJs = null;
    var xhrAdaptorJs = null;
    var xhrTestUtils = null;
    var samlEcpClientJs = null;

    beforeEach(function(done) {
        require(["xhr-saml-ecp-js", "saml-ecp-client-js", "xhr-adaptor-js", "xhrTestUtils"], function(xhrSamlEcpJsNS, samlEcpClientJsNS, xhrAdaptorJsNS, xhrTestUtilsNS) {
            xhrSamlEcpJs = xhrSamlEcpJsNS;
            samlEcpClientJs = samlEcpClientJsNS;
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

    // Check to make sure that the mock servers work correctly with the underlying SAML client
    describe("SAML Client <-> Mock Server Sanity Check", function() {

        it.only("Can authenticate against dummy servers", function (done) {

            var successSpy = sinon.spy();

            var samlClient = new samlEcpClientJs.Client({
                idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP"
            });

            samlClient.get("http://localhost:3100/private", {
                username : 'bob',
                onSuccess : function() {
                    successSpy();
                    done();
                },
                onEcpAuth : function(authCtx) {
                    authCtx.setPassword('mysecret');
                    authCtx.retryAuth();
                },
                onError : function(xhr, msg) {
                    sinon.assert.fail("SAML client error: " + msg);
                }
            });


        });
    });
    /*
    it.only("Can talk to dummy server", function (done) {

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