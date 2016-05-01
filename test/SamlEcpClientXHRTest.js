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
            setTimeout(function() {
                $.post("http://localhost:3100/reset", function() {
                    $.post("http://localhost:3000/reset", function () {
                        done();
                    });
                });
            }, 100);
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

        it("Will block and resend after authenticate using get", function (done) {

            var onEcpErrorCallback = sinon.spy();
            var onErrorCallback = sinon.spy();
            var onSamlTimeoutCallback = sinon.spy();
            var onResourceTimeoutCallback = sinon.spy();
            var firstRequestCallback = sinon.spy();
            var secondRequestCallback = sinon.spy();

            xhrSamlEcpJs.SamlEcpClientXHR.config({
                options: {
                    idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP",
                    username: 'bob',
                    onEcpAuth: function (authCtx) {
                        setTimeout(function () {
                            authCtx.setPassword('mysecret');
                            authCtx.retryAuth();
                        }, 500);
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
                firstRequestCallback();
                sinon.assert.notCalled(secondRequestCallback);
                done();
            });

            setTimeout(function() {
                $.get("http://localhost:3100/private", function (data) {
                    assert.equal(data, "Hello World!");
                    secondRequestCallback();
                    sinon.assert.calledOnce(firstRequestCallback);
                });
            }, 200);
        });

        it("Will recover and allow sending after error on authenticate using get", function (done) {

            var onEcpErrorCallback = sinon.spy();
            var onErrorCallback = sinon.spy();
            var onSamlTimeoutCallback = sinon.spy();
            var onResourceTimeoutCallback = sinon.spy();
            var firstRequestCallback = sinon.spy();
            var secondRequestCallback = sinon.spy();

            // NB: Sending data to a unopen port can cause a cross-domain error in some
            // browser/phantomJS implementations. The client currently deals with this special case
            // by emitting a console error and letting the deadline timer expire.
            xhrSamlEcpJs.SamlEcpClientXHR.config({
                options: {
                    idpEndpointUrl: "http://localhost:3001/idp/profile/SAML2/SOAP/ECP",
                    username: 'bob',
                    onEcpAuth: function (authCtx) {
                    }
                },
                aclList: [{
                    urlPattern: "^http://localhost:3100/private",
                    options: {
                        samlTimeout: 200,
                        resourceTimeout: 200,
                        onEcpError: onEcpErrorCallback,
                        onError: onErrorCallback,
                        onSamlTimeout: function() {

                            setTimeout(function() {
                                xhrSamlEcpJs.SamlEcpClientXHR.config({
                                    options: {
                                        idpEndpointUrl: "http://localhost:3000/idp/profile/SAML2/SOAP/ECP",
                                        username: 'bob',
                                        onEcpAuth: function (authCtx) {
                                             setTimeout(function () {
                                             authCtx.setPassword('mysecret');
                                             authCtx.retryAuth();
                                             }, 200);
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

                                $.get("http://localhost:3100/private", function (data) {
                                    assert.equal(data, "Hello World!");
                                    secondRequestCallback();
                                    sinon.assert.notCalled(firstRequestCallback);
                                    done();
                                });
                            }, 100);
                        },
                        onResourceTimeout : onResourceTimeoutCallback
                    }
                }]
            });

            xhrAdaptorJs.manager.injectWrapper(xhrSamlEcpJs.SamlEcpClientXHR);

            $.get("http://localhost:3100/private", function (data) {
                assert.equal(data, "Hello World!");
                firstRequestCallback();
                sinon.assert.notCalled(secondRequestCallback);
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

                    $.getJSON("http://localhost:3100/getPostResults", function(data) {
                        for(var i = 0; i < data.length; i++) {
                            assert.equal(data[i], "Hello there!");
                        }
                        // Ensure that we are not performing any uneccessary SP posts
                        assert.equal(data.length, 3);
                        done();
                    });
                }
            );
        });

        it("Will receive correct responses when post multiple times", function (done) {

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
                    stuff : "First data!"
                },
                function (data) {
                    assert.equal(data, "Hello World!");

                    $.getJSON("http://localhost:3100/getPostResults", function(data) {
                        for(var i = 0; i < data.length; i++) {
                            assert.equal(data[i], "First data!");
                        }
                        // Ensure that we are not performing any uneccessary SP posts
                        assert.equal(data.length, 3);

                        $.post("http://localhost:3100/private", {
                                stuff : "Second data!"
                            },
                            function (data) {
                                assert.equal(data, "Hello World!");

                                $.getJSON("http://localhost:3100/getPostResults", function(data) {
                                    assert.equal(data[3], "Second data!");
                                    // Ensure that we are not performing any uneccessary SP posts
                                    assert.equal(data.length, 4);
                                    done();
                                });
                            }
                        );
                    });
                }
            );
        });
    });
});