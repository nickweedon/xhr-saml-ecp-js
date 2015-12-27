var uscore = require("underscore");
var SamlTestData = SamlTestData || {};

module.exports = {
    SAML : SamlTestData
};

SamlTestData.IDP_PORT = 3000;
SamlTestData.IDP_BASE_URL = "http://localhost:" + SamlTestData.IDP_PORT;
SamlTestData.IDP_ENDPOINT_URL_SUFFIX = "/idp/profile/SAML2/SOAP/ECP";
SamlTestData.IDP_ENDPOINT_URL = SamlTestData.IDP_BASE_URL + SamlTestData.IDP_ENDPOINT_URL_SUFFIX;

SamlTestData.SP_PORT = "3100";
SamlTestData.SP_BASE_URL = "http://localhost:" + SamlTestData.SP_PORT;
SamlTestData.SP_RESOURCE_URL_SUFFIX = "/private";
SamlTestData.SP_RESOURCE_URL = SamlTestData.SP_BASE_URL + SamlTestData.SP_RESOURCE_URL_SUFFIX;
SamlTestData.SP_SSO_URL_SUFFIX = "/saml/SSO";
SamlTestData.SP_SSO_URL = SamlTestData.SP_BASE_URL + SamlTestData.SP_SSO_URL_SUFFIX;
SamlTestData.SP_NAME = "localhost";

SamlTestData.USERNAME = "bob";
SamlTestData.PASSWORD = "mysecret";
SamlTestData.BASIC_AUTH_STRING = "Basic Ym9iOm15c2VjcmV0";

SamlTestData.ECP_ERROR = {
    IDP_RESPONSE_ERROR : -1,
    CONSUMER_URL_MISMATCH : -2,
    CLIENT_CONFIG_ERROR : -3
};

SamlTestData.PAOS_SOAP_ACTION = "http://www.oasis-open.org/committees/security";

SamlTestData.PAOS_ATTRIBUTE = 'ver="urn:liberty:paos:2003-08";"urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"';
SamlTestData.TEXT_PAOS_ACCEPT_ATTRIBUTE = 'text/html; application/vnd.paos+xml';
SamlTestData.PAOS_UTF8_CONTENT_TYPE = 'application/vnd.paos+xml;charset=utf-8';
SamlTestData.TEXT_HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';
SamlTestData.PAOS_HTTP_HEADER = {
    PAOS: SamlTestData.PAOS_ATTRIBUTE,
    Accept: SamlTestData.TEXT_PAOS_ACCEPT_ATTRIBUTE
};

SamlTestData.PAOS_REQUEST_WITHOUT_HEADER =
    '<?xml version="1.0" encoding="UTF-8"?><soap11:Envelope xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/">                        <soap11:Body>            <saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" AssertionConsumerServiceURL="' + SamlTestData.SP_SSO_URL + '" ForceAuthn="false" ID="a24dd26eh9h6fj944a10b9616cfh8d7" IsPassive="false" IssueInstant="2015-11-14T00:50:17.744Z" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:PAOS" Version="2.0">            <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">' + SamlTestData.SP_RESOURCE_URL + '</saml2:Issuer>            <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">            <ds:SignedInfo>            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>            <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>            <ds:Reference URI="#a24dd26eh9h6fj944a10b9616cfh8d7">            <ds:Transforms>            <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>            <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>            </ds:Transforms>            <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>            <ds:DigestValue>3KbzG3e/Z1BhWmy8ik7swefH9jE=</ds:DigestValue>            </ds:Reference>            </ds:SignedInfo>            <ds:SignatureValue>            Y00XC4VlpaGDMx2b3bCtIFGep21ZYONxW2RuDZ0eMBhm+7rVL6eeSKt1NbM09e1HS+ZGNVF+lgR3SEpxij1LQ4nmCzgbWQ8DdOH2+pZmDil8oCaHS7P1Z5wgjZXZzKTBB1/DzZ/kd9eLYE/orJCP3zA12FiExJDsnQCWLQrVl2nhrR20dZRX0FptwwDf3QGYKUB7mSuDN6jtbh0XNwTDFERXNc5CMJerTjFmdAfeLzg+2TjN+RuCqSpRbNZCIYDFao13WeLGoCjB4ifXSvq0e9XFVL0NUDFztjmsQorJDKOn1tYQ5To7w+pwEnBGTq0WDqNCvfOzgVLGR6hlAw61wg==            </ds:SignatureValue>            <ds:KeyInfo>            <ds:X509Data>            <ds:X509Certificate>MIIDUjCCAjqgAwIBAgIEUOLIQTANBgkqhkiG9w0BAQUFADBrMQswCQYDVQQGEwJGSTEQMA4GA1UE            CBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kxGDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEM            MAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8wHhcNMTMwMTAxMTEyODAxWhcNMjIxMjMwMTEy            ODAxWjBrMQswCQYDVQQGEwJGSTEQMA4GA1UECBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kx            GDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEMMAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8w            ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCXqP0wqL2Ai1haeTj0alwsLafhrDtUt00E            5xc7kdD7PISRA270ZmpYMB4W24Uk2QkuwaBp6dI/yRdUvPfOT45YZrqIxMe2451PAQWtEKWF5Z13            F0J4/lB71TtrzyH94RnqSHXFfvRN8EY/rzuEzrpZrHdtNs9LRyLqcRTXMMO4z7QghBuxh3K5gu7K            qxpHx6No83WNZj4B3gvWLRWv05nbXh/F9YMeQClTX1iBNAhLQxWhwXMKB4u1iPQ/KSaal3R26pON            UUmu1qVtU1quQozSTPD8HvsDqGG19v2+/N3uf5dRYtvEPfwXN3wIY+/R93vBA6lnl5nTctZIRsyg            0Gv5AgMBAAEwDQYJKoZIhvcNAQEFBQADggEBAFQwAAYUjso1VwjDc2kypK/RRcB8bMAUUIG0hLGL            82IvnKouGixGqAcULwQKIvTs6uGmlgbSG6Gn5ROb2mlBztXqQ49zRvi5qWNRttir6eyqwRFGOM6A            8rxj3Jhxi2Vb/MJn7XzeVHHLzA1sV5hwl/2PLnaL2h9WyG9QwBbwtmkMEqUt/dgixKb1Rvby/tBu            RogWgPONNSACiW+Z5o8UdAOqNMZQozD/i1gOjBXoF0F5OksjQN7xoQZLj9xXefxCFQ69FPcFDeEW            bHwSoBy5hLPNALaEUoa5zPDwlixwRjFQTc5XXaRpgIjy/2gsL8+Y5QRhyXnLqgO67BlLYW/GuHE=            </ds:X509Certificate>            </ds:X509Data>            </ds:KeyInfo>            </ds:Signature>            </saml2p:AuthnRequest>            </soap11:Body>            </soap11:Envelope>';

SamlTestData.createPAOSRequest = function (fieldValues) {

    var fields = uscore.defaults(fieldValues || {}, {
        responseConsumerURL : SamlTestData.SP_BASE_URL + '/saml/SSO',
        assertionConsumerServiceURL : SamlTestData.SP_BASE_URL + '/saml/SSO',
        ecpRequestIssuer : SamlTestData.SP_RESOURCE_URL,
        authRequestIssuer : SamlTestData.SP_RESOURCE_URL
    });

    return '<?xml version="1.0" encoding="UTF-8"?>\
    <soap11:Envelope xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap11:Header>\
    <paos:Request xmlns:paos="urn:liberty:paos:2003-08" responseConsumerURL="' + fields.responseConsumerURL + '"\
    service="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"\
    soap11:actor="http://schemas.xmlsoap.org/soap/actor/next" soap11:mustUnderstand="1"/>\
    <ecp:Request xmlns:ecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp" IsPassive="false"\
    soap11:actor="http://schemas.xmlsoap.org/soap/actor/next" soap11:mustUnderstand="1">\
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">' + fields.ecpRequestIssuer + '</saml2:Issuer>\
    </ecp:Request>\
    </soap11:Header>\
    <soap11:Body>\
    <saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"\
    AssertionConsumerServiceURL="' + fields.assertionConsumerServiceURL + '" ForceAuthn="false"\
    ID="a24dd26eh9h6fj944a10b9616cfh8d7" IsPassive="false"\
    IssueInstant="2015-11-14T00:50:17.744Z"\
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:PAOS" Version="2.0">\
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">' + fields.authRequestIssuer + '</saml2:Issuer>\
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">\
    <ds:SignedInfo>\
    <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
    <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>\
    <ds:Reference URI="#a24dd26eh9h6fj944a10b9616cfh8d7">\
    <ds:Transforms>\
    <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\
    <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
    </ds:Transforms>\
    <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>\
    <ds:DigestValue>3KbzG3e/Z1BhWmy8ik7swefH9jE=</ds:DigestValue>\
    </ds:Reference>\
    </ds:SignedInfo>\
    <ds:SignatureValue>\
    Y00XC4VlpaGDMx2b3bCtIFGep21ZYONxW2RuDZ0eMBhm+7rVL6eeSKt1NbM09e1HS+ZGNVF+lgR3SEpxij1LQ4nmCzgbWQ8DdOH2+pZmDil8oCaHS7P1Z5wgjZXZzKTBB1/DzZ/kd9eLYE/orJCP3zA12FiExJDsnQCWLQrVl2nhrR20dZRX0FptwwDf3QGYKUB7mSuDN6jtbh0XNwTDFERXNc5CMJerTjFmdAfeLzg+2TjN+RuCqSpRbNZCIYDFao13WeLGoCjB4ifXSvq0e9XFVL0NUDFztjmsQorJDKOn1tYQ5To7w+pwEnBGTq0WDqNCvfOzgVLGR6hlAw61wg==\
    </ds:SignatureValue>\
    <ds:KeyInfo>\
    <ds:X509Data>\
    <ds:X509Certificate>MIIDUjCCAjqgAwIBAgIEUOLIQTANBgkqhkiG9w0BAQUFADBrMQswCQYDVQQGEwJGSTEQMA4GA1UE\
    CBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kxGDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEM\
    MAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8wHhcNMTMwMTAxMTEyODAxWhcNMjIxMjMwMTEy\
    ODAxWjBrMQswCQYDVQQGEwJGSTEQMA4GA1UECBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kx\
    GDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEMMAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8w\
    ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCXqP0wqL2Ai1haeTj0alwsLafhrDtUt00E\
    5xc7kdD7PISRA270ZmpYMB4W24Uk2QkuwaBp6dI/yRdUvPfOT45YZrqIxMe2451PAQWtEKWF5Z13\
    F0J4/lB71TtrzyH94RnqSHXFfvRN8EY/rzuEzrpZrHdtNs9LRyLqcRTXMMO4z7QghBuxh3K5gu7K\
    qxpHx6No83WNZj4B3gvWLRWv05nbXh/F9YMeQClTX1iBNAhLQxWhwXMKB4u1iPQ/KSaal3R26pON\
    UUmu1qVtU1quQozSTPD8HvsDqGG19v2+/N3uf5dRYtvEPfwXN3wIY+/R93vBA6lnl5nTctZIRsyg\
    0Gv5AgMBAAEwDQYJKoZIhvcNAQEFBQADggEBAFQwAAYUjso1VwjDc2kypK/RRcB8bMAUUIG0hLGL\
    82IvnKouGixGqAcULwQKIvTs6uGmlgbSG6Gn5ROb2mlBztXqQ49zRvi5qWNRttir6eyqwRFGOM6A\
    8rxj3Jhxi2Vb/MJn7XzeVHHLzA1sV5hwl/2PLnaL2h9WyG9QwBbwtmkMEqUt/dgixKb1Rvby/tBu\
    RogWgPONNSACiW+Z5o8UdAOqNMZQozD/i1gOjBXoF0F5OksjQN7xoQZLj9xXefxCFQ69FPcFDeEW\
    bHwSoBy5hLPNALaEUoa5zPDwlixwRjFQTc5XXaRpgIjy/2gsL8+Y5QRhyXnLqgO67BlLYW/GuHE=\
    </ds:X509Certificate>\
    </ds:X509Data>\
    </ds:KeyInfo>\
    </ds:Signature>\
    </saml2p:AuthnRequest>\
    </soap11:Body>\
    </soap11:Envelope>';
};

SamlTestData.createPAOSAuthSuccess = function (fieldValues) {

    var fields = uscore.defaults(fieldValues || {}, {
        assertionConsumerServiceURL: SamlTestData.SP_BASE_URL + '/saml/SSO',
        responseDestination: SamlTestData.SP_BASE_URL + '/saml/SSO',
        recipient: SamlTestData.SP_NAME
    });

    return '<?xml version="1.0" encoding="UTF-8"?>\
        <soap11:Envelope xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/">\
        <soap11:Header>\
        <ecp:Response AssertionConsumerServiceURL="' + fields.assertionConsumerServiceURL + '"\
        soap11:actor="http://schemas.xmlsoap.org/soap/actor/next" soap11:mustUnderstand="1"\
        xmlns:ecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"/>\
        <ecp:RequestAuthenticated soap11:actor="http://schemas.xmlsoap.org/soap/actor/next"\
        xmlns:ecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"/>\
        <samlec:GeneratedKey soap11:actor="http://schemas.xmlsoap.org/soap/actor/next"\
        xmlns:samlec="urn:ietf:params:xml:ns:samlec">SpE2uXsyCrgsInt7p96ntoK/jak5xAnWP0r4DtjQE9g=\
        </samlec:GeneratedKey>\
        </soap11:Header>\
        <soap11:Body>\
        <saml2p:Response Destination="' + fields.responseDestination + '" ID="_52d4f3bc2fd1e236c40829ede867395c"\
        InResponseTo="a528gh18d6aj4961416d4g7c9843g7g" IssueInstant="2015-11-14T00:50:27.520Z"\
        Version="2.0" xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol">\
        <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">\
        http://wyvern.weedon.int:8030/idp/shibboleth\
        </saml2:Issuer>\
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">\
        <ds:SignedInfo>\
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
        <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\
        <ds:Reference URI="#_52d4f3bc2fd1e236c40829ede867395c">\
        <ds:Transforms>\
        <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\
        <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
        </ds:Transforms>\
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\
        <ds:DigestValue>0h0sQJF1I+KefVSWCwY7aRARrp31E/JRfmb8yb3V46s=</ds:DigestValue>\
        </ds:Reference>\
        </ds:SignedInfo>\
        <ds:SignatureValue>\
        PsL4NofxG0/uqJnGwQ125fX2uUjqXul/Vg5KlapI9tGumgDZ+LutwlB0kGsoA2ufpO3SAiKZyb/N\
        C5RGLwiW1b58akYXZDvxbpqePrfcmXPtfYmcy2uF4cNOBqtFvLde0PeEC96cCP18nmNenzY3UAEL\
        uj2nb9nC0NSKa1gLsDby3SPMb3Wn88ATUm7dAPB4jdf+5TeY35gXWil4GSFg72ejIz24c+SQi0lk\
        VS5jvKKEGBcwOYG9V5gECCnCEvaSmnFWYACITEtFTW7VVmXp3ID+FbrhymFe2TmSffC5MSWs8dFp\
        ktdFk0SZMxZvtat6rftmMpagVCjYlyn6a7EP6Q==\
        </ds:SignatureValue>\
        <ds:KeyInfo>\
        <ds:X509Data>\
        <ds:X509Certificate>MIIDMDCCAhigAwIBAgIVAPbeQ95vidwo4TR7udF04FS4ZJ+/MA0GCSqGSIb3DQEBCwUAMBwxGjAY&#xd;\
        BgNVBAMMEXd5dmVybi53ZWVkb24uaW50MB4XDTE1MDIwODA1NTgyMVoXDTM1MDIwODA1NTgyMVow&#xd;\
        HDEaMBgGA1UEAwwRd3l2ZXJuLndlZWRvbi5pbnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK&#xd;\
        AoIBAQCIXjBqL5kabYqOXFmo+00GLpV3E2QPTTOLKBqk4lZvIbBaokBf/fNiu5+DvS4afDYtzsOV&#xd;\
        OAbV8EK8mDMct+NpRLpB3+kpWB+YE6M1iJ90u3gpnVjye27hZyuT80qfZN3QGAxGP68MM6vlXFbo&#xd;\
        ibq2QHgEhzbwC4jzOvMqiHUPYlSHLZa5VfC999EpUZrJRonyxxGk6x9lHlvgjupZtNlW0VQ9DJAf&#xd;\
        40pwNEaRPToWdAi+ktrdMbRn5B6r3+vUzirJ993PvJeGP3AKMJdeBW/EK8Ga+/hZbx019xXf/EG8&#xd;\
        hHoXF5tUjksncH+IaVqvJG9M2ci7OYq3U23hL+H3ow6DAgMBAAGjaTBnMB0GA1UdDgQWBBRAz4yW&#xd;\
        tHdi246vdlHeVNSmElkpdjBGBgNVHREEPzA9ghF3eXZlcm4ud2VlZG9uLmludIYoaHR0cHM6Ly93&#xd;\
        eXZlcm4ud2VlZG9uLmludC9pZHAvc2hpYmJvbGV0aDANBgkqhkiG9w0BAQsFAAOCAQEAJUYauklQ&#xd;\
        v0T79oNrXsytcQDPLCYCZcpjAgIjHFl8fetGqdWe67lZaRPKbm0NS69ILGFXVldHSHs6/WjbJmHd&#xd;\
        y9BuiM2tDosxCnS1IcACG2kInLOlqzeoG8SU3zzVBAQDADUDvxhefzlJ6yFvz4eYqhf+ErMG1/uK&#xd;\
        ZzwuQGh9wVNXGATPGRyrdKh3Q4mmsyTClQRdakX0rV3GvLwa8z8wEQeZXR+c7cOgfmOaHqyTPkWQ&#xd;\
        z5CFl2X21E1YlK9P43F3yG0R7pGcC0S8tBgaZbg8eODqhRFvfyg+Rnp/swq49J12ru1gV6Rfnl0Y&#xd;\
        lzuqvmsrsiyr4lqQTPxkzDXo1l6KEQ==\
        </ds:X509Certificate>\
        </ds:X509Data>\
        </ds:KeyInfo>\
        </ds:Signature>\
        <saml2p:Status>\
        <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>\
        </saml2p:Status>\
        <saml2:EncryptedAssertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">\
        <xenc:EncryptedData Id="_622b46fa6a8ea0d4c9b1a465e9c07bc6"\
        Type="http://www.w3.org/2001/04/xmlenc#Element"\
        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">\
        <xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"\
        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#"/>\
        <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">\
        <xenc:EncryptedKey Id="_7f6f3bf81734e016450eaae072c4ffc8" Recipient="' + fields.recipient + '"\
        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">\
        <xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"\
        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">\
        <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"\
        xmlns:ds="http://www.w3.org/2000/09/xmldsig#"/>\
        </xenc:EncryptionMethod>\
        <ds:KeyInfo>\
        <ds:X509Data>\
        <ds:X509Certificate>\
        MIIDUjCCAjqgAwIBAgIEUOLIQTANBgkqhkiG9w0BAQUFADBrMQswCQYDVQQGEwJGSTEQMA4GA1UE&#xd;\
        CBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kxGDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEM&#xd;\
        MAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8wHhcNMTMwMTAxMTEyODAxWhcNMjIxMjMwMTEy&#xd;\
        ODAxWjBrMQswCQYDVQQGEwJGSTEQMA4GA1UECBMHVXVzaW1hYTERMA8GA1UEBxMISGVsc2lua2kx&#xd;\
        GDAWBgNVBAoTD1JNNSBTb2Z0d2FyZSBPeTEMMAoGA1UECwwDUiZEMQ8wDQYDVQQDEwZhcG9sbG8w&#xd;\
        ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCXqP0wqL2Ai1haeTj0alwsLafhrDtUt00E&#xd;\
        5xc7kdD7PISRA270ZmpYMB4W24Uk2QkuwaBp6dI/yRdUvPfOT45YZrqIxMe2451PAQWtEKWF5Z13&#xd;\
        F0J4/lB71TtrzyH94RnqSHXFfvRN8EY/rzuEzrpZrHdtNs9LRyLqcRTXMMO4z7QghBuxh3K5gu7K&#xd;\
        qxpHx6No83WNZj4B3gvWLRWv05nbXh/F9YMeQClTX1iBNAhLQxWhwXMKB4u1iPQ/KSaal3R26pON&#xd;\
        UUmu1qVtU1quQozSTPD8HvsDqGG19v2+/N3uf5dRYtvEPfwXN3wIY+/R93vBA6lnl5nTctZIRsyg&#xd;\
        0Gv5AgMBAAEwDQYJKoZIhvcNAQEFBQADggEBAFQwAAYUjso1VwjDc2kypK/RRcB8bMAUUIG0hLGL&#xd;\
        82IvnKouGixGqAcULwQKIvTs6uGmlgbSG6Gn5ROb2mlBztXqQ49zRvi5qWNRttir6eyqwRFGOM6A&#xd;\
        8rxj3Jhxi2Vb/MJn7XzeVHHLzA1sV5hwl/2PLnaL2h9WyG9QwBbwtmkMEqUt/dgixKb1Rvby/tBu&#xd;\
        RogWgPONNSACiW+Z5o8UdAOqNMZQozD/i1gOjBXoF0F5OksjQN7xoQZLj9xXefxCFQ69FPcFDeEW&#xd;\
        bHwSoBy5hLPNALaEUoa5zPDwlixwRjFQTc5XXaRpgIjy/2gsL8+Y5QRhyXnLqgO67BlLYW/GuHE=\
        </ds:X509Certificate>\
        </ds:X509Data>\
        </ds:KeyInfo>\
        <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">\
        <xenc:CipherValue>\
        PL8DO0L1pxvaSiAEc3YjUtWJ3uK36LWrCMRySzUhZKbUPFFykgsd2NDhG/OF+jJo10nryPjrFnbY\
        aXsz80upGPwrAma2b2Vrl1khrt8qUfqzBgdEBzgwdm9Gqs/nv4JhpF3NipFGOz0XMWYxyL4K5MES\
        pMJ2M3KT3X4pUPA/o8+oromYBNMhkQwd0QRLVRTnzdrytLBDdTMWfLbSq022i3yDUYnQDSuDOTUw\
        kajLQnU/bQbVnSXCjS7/yQd0ykm55/xv3C3pnmTwdUWvcPy63cd8MFuwSXy42nR70GYZ6pvR8+X/\
        ZEbCFazB/Z24VaiTyPQErQ1NFQokEYzWHHHvOg==\
        </xenc:CipherValue>\
        </xenc:CipherData>\
        </xenc:EncryptedKey>\
        </ds:KeyInfo>\
        <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">\
        <xenc:CipherValue>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\
        GCUqoo7N7L5aSuM4bJ1eDjfydqhPAi2OQnGv\
        </xenc:CipherValue>\
        </xenc:CipherData>\
        </xenc:EncryptedData>\
        </saml2:EncryptedAssertion>\
        </saml2p:Response>\
        </soap11:Body>\
        </soap11:Envelope>';
};

SamlTestData.createPAOSAuthFailed = function (fieldValues) {

    var fields = uscore.defaults(fieldValues || {}, {
        assertionConsumerServiceURL: SamlTestData.SP_BASE_URL + '/saml/SSO',
        responseDestination: SamlTestData.SP_BASE_URL + '/saml/SSO'
    });

    return '<?xml version="1.0" encoding="UTF-8"?>\
        <soap11:Envelope xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/">\
        <soap11:Header>\
        <ecp:Response AssertionConsumerServiceURL="' + fields.assertionConsumerServiceURL + '"\
        soap11:actor="http://schemas.xmlsoap.org/soap/actor/next" soap11:mustUnderstand="1"\
        xmlns:ecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"/>\
        <ecp:RequestAuthenticated soap11:actor="http://schemas.xmlsoap.org/soap/actor/next"\
        xmlns:ecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"/>\
        <samlec:GeneratedKey soap11:actor="http://schemas.xmlsoap.org/soap/actor/next"\
        xmlns:samlec="urn:ietf:params:xml:ns:samlec">8wxZrUDdwNwuBInvypxUNfAdFxecnR4oS6I4HObGwyA=\
        </samlec:GeneratedKey>\
        </soap11:Header>\
        <soap11:Body>\
        <saml2p:Response Destination="' + fields.responseDestination + '" ID="_9202d16e15ace69d36df861cf37787c6"\
        InResponseTo="a24dd26eh9h6fj944a10b9616cfh8d7" IssueInstant="2015-11-14T00:50:17.838Z"\
        Version="2.0" xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol">\
        <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">\
        http://wyvern.weedon.int:8030/idp/shibboleth\
        </saml2:Issuer>\
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">\
        <ds:SignedInfo>\
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
        <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>\
        <ds:Reference URI="#_9202d16e15ace69d36df861cf37787c6">\
        <ds:Transforms>\
        <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>\
        <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>\
        </ds:Transforms>\
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>\
        <ds:DigestValue>KFvMfsfHgOk2Hr1jQKwSsHjS/3LpW4y5IHS978fmR14=</ds:DigestValue>\
        </ds:Reference>\
        </ds:SignedInfo>\
        <ds:SignatureValue>\
        Rc8gLqLkbSKcPueQt0NTokBsGkiyvKP558DNhKgt5iyDl68N62iOVcU0yu3TlSg7Ugkz7wHe621X\
        IeMhM6TOC1Gg1N33zrtBYTRgwFrjWbMw8g5rahL4jJEgkBYpr++0AuDMqoyU3zOOKPOrC+jsWw7f\
        k8J2mC0NJKMN8nF7E1ovXnw7k8KATAPYDKyuiSNEcFaOl6oMNMAW3SRxlsYNevGStLa01XWTNryu\
        6uYqG7Zp6cbuGEfMcfa/oQYlNlpFmdZbspP7uYZ0tkU9DBVuWoCFvUy3qdpmFpLk9ghZTZRVnrE9\
        FvOHjgG9mkUouzL9LJzrf/Org9R46H53yUt/bw==\
        </ds:SignatureValue>\
        <ds:KeyInfo>\
        <ds:X509Data>\
        <ds:X509Certificate>MIIDMDCCAhigAwIBAgIVAPbeQ95vidwo4TR7udF04FS4ZJ+/MA0GCSqGSIb3DQEBCwUAMBwxGjAY&#xd;\
        BgNVBAMMEXd5dmVybi53ZWVkb24uaW50MB4XDTE1MDIwODA1NTgyMVoXDTM1MDIwODA1NTgyMVow&#xd;\
        HDEaMBgGA1UEAwwRd3l2ZXJuLndlZWRvbi5pbnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK&#xd;\
        AoIBAQCIXjBqL5kabYqOXFmo+00GLpV3E2QPTTOLKBqk4lZvIbBaokBf/fNiu5+DvS4afDYtzsOV&#xd;\
        OAbV8EK8mDMct+NpRLpB3+kpWB+YE6M1iJ90u3gpnVjye27hZyuT80qfZN3QGAxGP68MM6vlXFbo&#xd;\
        ibq2QHgEhzbwC4jzOvMqiHUPYlSHLZa5VfC999EpUZrJRonyxxGk6x9lHlvgjupZtNlW0VQ9DJAf&#xd;\
        40pwNEaRPToWdAi+ktrdMbRn5B6r3+vUzirJ993PvJeGP3AKMJdeBW/EK8Ga+/hZbx019xXf/EG8&#xd;\
        hHoXF5tUjksncH+IaVqvJG9M2ci7OYq3U23hL+H3ow6DAgMBAAGjaTBnMB0GA1UdDgQWBBRAz4yW&#xd;\
        tHdi246vdlHeVNSmElkpdjBGBgNVHREEPzA9ghF3eXZlcm4ud2VlZG9uLmludIYoaHR0cHM6Ly93&#xd;\
        eXZlcm4ud2VlZG9uLmludC9pZHAvc2hpYmJvbGV0aDANBgkqhkiG9w0BAQsFAAOCAQEAJUYauklQ&#xd;\
        v0T79oNrXsytcQDPLCYCZcpjAgIjHFl8fetGqdWe67lZaRPKbm0NS69ILGFXVldHSHs6/WjbJmHd&#xd;\
        y9BuiM2tDosxCnS1IcACG2kInLOlqzeoG8SU3zzVBAQDADUDvxhefzlJ6yFvz4eYqhf+ErMG1/uK&#xd;\
        ZzwuQGh9wVNXGATPGRyrdKh3Q4mmsyTClQRdakX0rV3GvLwa8z8wEQeZXR+c7cOgfmOaHqyTPkWQ&#xd;\
        z5CFl2X21E1YlK9P43F3yG0R7pGcC0S8tBgaZbg8eODqhRFvfyg+Rnp/swq49J12ru1gV6Rfnl0Y&#xd;\
        lzuqvmsrsiyr4lqQTPxkzDXo1l6KEQ==\
        </ds:X509Certificate>\
        </ds:X509Data>\
        </ds:KeyInfo>\
        </ds:Signature>\
        <saml2p:Status>\
        <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Requester">\
        <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/>\
        </saml2p:StatusCode>\
        <saml2p:StatusMessage>An error occurred.</saml2p:StatusMessage>\
        </saml2p:Status>\
        </saml2p:Response>\
        </soap11:Body>\
        </soap11:Envelope>';
};

SamlTestData.SP_RESOURCE =
    '<HTML>\
    <HEAD>\
        <TITLE>A Page</TITLE>\
    </HEAD>\
    <BODY>\
        blah\
    </BODY>\
    </HTML>';

