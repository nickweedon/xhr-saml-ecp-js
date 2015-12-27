var express = require('express');
var app = express();

var data = require('../data/SamlTestData');
var isAuthenticated = false;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9876");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, PAOS, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

app.post("/reset", function (req, res) {
    isAuthenticated = false;
    res.status(200).send("OK");
});

app.post(data.SAML.IDP_ENDPOINT_URL_SUFFIX, function (req, res) {
    res.header("SOAPAction", data.SAML.PAOS_SOAP_ACTION);

    var authString = req.headers['authorization'];

    console.log("Request headers = '" + JSON.stringify(req.headers) + "'");

    if(authString === undefined) {
        console.log("Attempting to authenticate with IDp using pre-existing session (no authorization string)");
    } else {
        console.log("Attempting to authenticate with IDp using authorization string '" + authString + "'.");
    }

    if(isAuthenticated || authString == data.SAML.BASIC_AUTH_STRING) {
        isAuthenticated = true;
        res.send(data.SAML.createPAOSAuthSuccess());
        console.log("IDP sent PAOS auth success");
        return;
    }

    console.log("IDP sent PAOS auth failed");
    res.send(data.SAML.createPAOSAuthFailed());
});

var server = app.listen(data.SAML.IDP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});