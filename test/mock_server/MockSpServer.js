var express = require('express');
var app = express();

var data = require('../data/SamlTestData');
var isAuthenticated = false;
var postDataResults = [];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9876");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, PAOS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

function containsMimeType(acceptString, mimeType) {
    var acceptArray = acceptString.split(", ");

    return acceptArray.indexOf(mimeType) != -1;
}

function processRequest(req, res) {

    if(!isAuthenticated) {
        var paosString = req.headers['paos'];
        var acceptString = req.headers['accept'];

        //var allAndPaos = "*/*, text/html; application/vnd.paos+xml";

        if(paosString != data.SAML.PAOS_ATTRIBUTE || !containsMimeType(acceptString, data.SAML.TEXT_PAOS_ACCEPT_ATTRIBUTE)) {

            // This is not supposed to occur (xhr-saml-ecp-js client should always send the PAOS attribute)
            console.error("SP did not receive a PAOS HTTP header attribute. SAML ECP will not be triggered. " +
                "PAOS header: '" + paosString + "'\n" +
                "Accept header: '" + acceptString + "'");
            res.status(200).send("This would normally be a redirect to perform regular web based SAML SSO.");
            return;
        }
        res.header("SOAPAction", data.SAML.PAOS_SOAP_ACTION);
        res.header("Content-Type", data.SAML.PAOS_UTF8_CONTENT_TYPE);
        res.status(200).send(data.SAML.createPAOSRequest());
        console.log("Sent SP PAOS data...");
        return;
    }

    res.status(200).send("Hello World!");
    console.log("Sent SP resource...");
}


app.get(data.SAML.SP_RESOURCE_URL_SUFFIX, function (req, res) {
    processRequest(req, res);
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post(data.SAML.SP_RESOURCE_URL_SUFFIX, function (req, res) {
    processRequest(req, res);
    console.log("Request body is: " + req.body.stuff);
    postDataResults.push(req.body.stuff);
});


app.post(data.SAML.SP_SSO_URL_SUFFIX, function (req, res) {
    isAuthenticated = true;
    console.log("SP Got SSO payload...");
    res.status(200).send("OK");
});

app.post("/reset", function (req, res) {
    isAuthenticated = false;
    postDataResults = [];
    console.log("Reset state of SP server");
    res.status(200).send("OK");
});

app.get("/getPostResults", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log("Retrieving POST results");
    res.status(200).send(JSON.stringify(postDataResults));
});

var server = app.listen(data.SAML.SP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});