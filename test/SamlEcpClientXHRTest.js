describe('SamlEcpClientXHR Test', function() {

    var xhrSamlEcpJs = null;
    var xhrAdaptorJs = null;
    var xhrTestUtils = null;
    var samlEcpClientJs = null;
    var $ = null;

    beforeEach(function(done) {
        require(["xhr-saml-ecp-js", "saml-ecp-client-js", "xhr-adaptor-js", "xhrTestUtils", "jquery"], function(xhrSamlEcpJsNS, samlEcpClientJsNS, xhrAdaptorJsNS, xhrTestUtilsNS, jqueryNS) {
            xhrSamlEcpJs = xhrSamlEcpJsNS;
            samlEcpClientJs = samlEcpClientJsNS;
            xhrAdaptorJs = xhrAdaptorJsNS;
            xhrTestUtils = xhrTestUtilsNS;
            $ = jqueryNS;
            // Reset the dummy SAML servers
            $.post("http://localhost:3100/reset", function() {
                $.post("http://localhost:3000/reset", function () {
                    done();
                });
            });
        });
    });

    afterEach(function () {
        xhrAdaptorJs.manager.resetXHR();
        //TODO: Look at a proper method for clearing handlers
        //xhrSamlEcpJs.SamlEcpClientXHR.clearResponseHandlers();
    });

    describe("Dummy SAML server sanity checks", function() {

        // Check to make sure that the mock servers work correctly with the underlying SAML client
        // This is just a simple sanity check, mainly to ensure that the mock servers are written correctly and work with the
        // current version of the client.
        it("Can run SAML Client against dummy SAML servers (sanity check)", function (done) {

            var samlClient = new samlEcpClientJs.Client({
                idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP"
            });

            samlClient.get("http://localhost:3100/private", {
                username : 'bob',
                onSuccess : function() {
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

        it("Will reset dummy SAML server auth state", function (done) {

            var onAurhSpy = sinon.spy();

            var samlClient = new samlEcpClientJs.Client({
                idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP"
            });

            samlClient.get("http://localhost:3100/private", {
                username : 'bob',
                onSuccess : function() {
                    sinon.assert.calledOnce(onAurhSpy);
                    done();
                },
                onEcpAuth : function(authCtx) {
                    onAurhSpy(authCtx);
                    authCtx.setPassword('mysecret');
                    authCtx.retryAuth();
                },
                onError : function(xhr, msg) {
                    sinon.assert.fail("SAML client error: " + msg);
                }
            });
        });
    });

    describe("SAML XHR injection tests", function() {

        it("Can instantiate successfully", function () {
            var xhr = new xhrSamlEcpJs.SamlEcpClientXHR(xhrTestUtils.createNativeXhr());
            assert.ok( xhr !== undefined, "Failed to instantiate xhrSamlEcpJs.SamlEcpClientXHR" );
        });

        it("Can authenticate using get", function (done) {

            var onEcpErrorCallback = sinon.spy();
            var onErrorCallback = sinon.spy();
            var onSamlTimeoutCallback = sinon.spy();
            var onResourceTimeoutCallback = sinon.spy();

            xhrSamlEcpJs.SamlEcpClientXHR.config({
                options: {
                    idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP",
                    username: 'bob',
                    onEcpAuth: function (authCtx) {
                        authCtx.setPassword('mysecret');
                        authCtx.retryAuth();
                    }
                },
                aclList: [{
                    urlPattern: "^http://localhost:3100/private",
                    options: {
                        samlTimeout: 0,
                        resourceTimeout: 0,
                        onEcpError: onEcpErrorCallback,
                        onError: onErrorCallback,
                        onSamlTimeout: onSamlTimeoutCallback,
                        onResourceTimeout: onResourceTimeoutCallback
                    }
                }]
            });

            xhrAdaptorJs.manager.injectWrapper(xhrSamlEcpJs.SamlEcpClientXHR);

            $.get("http://localhost:3100/private", function (data) {
                    assert.equal(data, "Hello World!");
                    done();
            });
        });

        it("Can authenticate and post data using post", function (done) {

            var onEcpErrorCallback = sinon.spy();
            var onErrorCallback = sinon.spy();
            var onSamlTimeoutCallback = sinon.spy();
            var onResourceTimeoutCallback = sinon.spy();

            xhrSamlEcpJs.SamlEcpClientXHR.config({
                options: {
                    idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP",
                    username: 'bob',
                    onEcpAuth: function (authCtx) {
                        authCtx.setPassword('mysecret');
                        authCtx.retryAuth();
                    }
                },
                aclList: [{
                    urlPattern: "^http://localhost:3100/private",
                    options: {
                        samlTimeout: 0,
                        resourceTimeout: 0,
                        onEcpError: onEcpErrorCallback,
                        onError: onErrorCallback,
                        onSamlTimeout: onSamlTimeoutCallback,
                        onResourceTimeout: onResourceTimeoutCallback
                    }
                }]
            });

            xhrAdaptorJs.manager.injectWrapper(xhrSamlEcpJs.SamlEcpClientXHR);

            $.post("http://localhost:3100/private", {
                    stuff : "Hello there!"
                },
                function (data) {
                    assert.equal(data, "Hello World!");
                }
            );

            $.getJSON("http://localhost:3100/getPostResults", function(data) {
                for(var i = 0; i < data.length; i++) {
                    assert.equal(data[i], "Hello there!");
                }
                done();
            });
        });

/*
        it.only("Can post stuff", function (done) {
            $.post("http://localhost:3100/private", {
                    stuff : "Hello there!"
                },
                function (data) {
                    done();
                }
            );
        });
*/

    });
});