var express = require('express');
var app = express();

var data = require('../data/SamlTestData');
var isAuthenticated = false;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9876");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, PAOS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get(data.SAML.IDP_ENDPOINT_URL_SUFFIX, function (req, res) {
    res.header("SOAPAction", data.SAML.PAOS_SOAP_ACTION);

    var authString = req.headers['Authorization'];

    if(isAuthenticated || authString == data.SAML.BASIC_AUTH_STRING) {
        isAuthenticated = true;
        res.send(TestData.createPAOSAuthSuccess());
        console.log("IDP sent PAOS auth success");
        return;
    }

    console.log("IDP sent PAOS auth failed");
    res.send(TestData.createPAOSAuthFailed());
});

var server = app.listen(data.SAML.IDP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});