// Karma configuration
// Generated on Sat Oct 17 2015 11:50:54 GMT+1000 (E. Australia Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'requirejs', 'mocha', 'chai', 'sinon', 'sinon-expect' ],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'test/test-require-deps.js', included: true},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/*Test.js', included: false},
      {pattern: 'test/data/*.txt', included: false, served: true},
      {pattern: 'dist/xhr-saml-ecp-js.js', included: false},
      {pattern: 'test/util/*.js', included: false},
      {pattern: 'bower_components/**/*.js', included: false},
      {pattern: 'bower_components/**/*.css', included: false}
    ],

    proxies: {
      "/data/": "/base/test/data/"
    },

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit'],

    // the default configuration
    junitReporter: {
      outputDir: 'test_output', // results will be saved as $outputDir/$browserName.xml
      suite: 'xhrSamlEcpJs', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true // add browser name to report and classes names
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    //browserNoActivityTimeout: 500,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    //browsers: ['Firefox'],
    //browsers: ['Chrome'],




    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
};
