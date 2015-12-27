var express = require('express');
var app = express();

var data = require('../data/SamlTestData');
var isAuthenticated = false;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9876");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, PAOS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

app.get(data.SAML.SP_RESOURCE_URL_SUFFIX, function (req, res) {
    if(!isAuthenticated) {
        res.header("SOAPAction", data.SAML.PAOS_SOAP_ACTION);
        res.header("Content-Type", data.SAML.PAOS_UTF8_CONTENT_TYPE);
        res.status(200).send(data.SAML.createPAOSRequest());
        console.log("Sent SP PAOS data...");
        return;
    }

    res.status(200).send("Hello World!");
    console.log("Sent SP resource...");
});

app.post(data.SAML.SP_SSO_URL_SUFFIX, function (req, res) {
    isAuthenticated = true;
    console.log("SP Got SSO payload...");
    res.status(200).send("OK");
});

var server = app.listen(data.SAML.SP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});