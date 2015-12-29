require.config({
  shim: {
    'jquery': {
      deps: [
        'xhr-adaptor-js'
      ]
    },
    'jquery-colorbox': {
      deps: [
        'jquery'
      ]
    }
  },
  paths: {
    jquery: '../../bower_components/jquery/dist/jquery',
    requirejs: '../../bower_components/requirejs/require',
    'jquery-colorbox': '../../bower_components/jquery-colorbox/jquery.colorbox',
    "xhr-adaptor-js": "../../bower_components/xhr-adaptor-js/dist/xhr-adaptor-js",
    "xhr-blocking-queue-js": "../../bower_components/xhr-blocking-queue-js/dist/xhr-blocking-queue-js",
    "saml-ecp-client-js": "../../bower_components/saml-ecp-client-js/dist/saml-ecp-client-js",
    "xhr-saml-ecp-js": "../../dist/xhr-saml-ecp-js",
    underscore: '../../bower_components/underscore/underscore'
  },
  packages: [

  ]
});
