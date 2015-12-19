module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		includereplace: {
			dist : {
				options: {
					includesDir: "src",
					prefix: "//@@"
				},
				// Files to perform replacements and includes with
				src: 'src/**/*.js',
				// Destination directory to copy files to
				dest: 'obj/'
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true, 
					src: 'obj/src/amd.js', 
				    rename: function(dest, src) {
				    	return "dist/<%= pkg.name %>.js";
				    }
				}]
			}
		},		
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
		    all: ['src/**/*.js']
		},
		"bower-install-simple": {
	        options: {
	            color: true
	        },
	        "prod": {
	            options: {
	                production: true
	            }
	        },
	        "dev": {
	            options: {
	                production: false
	            }
	        }
	    },
	    jsdoc : {
	        dist : {
        		src: ['dist/<%= pkg.name %>.js', 'README.md'],	
        		options: {
                    destination: 'doc_output',
					private: false,
					tutorials: 'doc_resource/tutorials',
					configure : "jsdoc.conf.json"
                }
	        }
	    },	    
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		express: {
			options: {
				// Override defaults here
			},
			idpserver: {
				options: {
					script: 'test/mock_server/MockIdpServer.js'
				}
			},
			spserver: {
				options: {
					script: 'test/mock_server/MockSpServer.js'
				}
			}
		},
		forever: {
			idpserver: {
				options: {
					index : 'test/mock_server/MockIdpServer.js',
					logDir : 'mock_server_log',
					outFile : 'idp_server.log'
				}
			},
			spserver: {
				options: {
					index: 'test/mock_server/MockSpServer.js',
					logDir : 'mock_server_log',
					outFile : 'sp_server.log'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-bower-install-simple");
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-forever');
	
	// Default task(s).
	grunt.registerTask('default', ['jshint', 'includereplace', 'copy', 'jsdoc', 'uglify']);
	grunt.registerTask('dist', ['jshint', 'includereplace', 'copy', 'uglify']);
	grunt.registerTask('compile', ['jshint', 'includereplace', 'copy']);
	grunt.registerTask('bower-install', ['bower-install-simple']);
	grunt.event.once('connect.server.listening', function(host, port) {
		grunt.log.writeln("Unit test pages is available at http://127.0.0.1:" + port +  "/test/unit/");
		grunt.log.writeln("Manual test page is available at http://127.0.0.1:" + port +  "/test/server/");
	});
	grunt.registerTask('test', 'Run the unit test suite', ['bower-install-simple', 'express:idpserver', 'express:spserver', 'karma']);
    grunt.registerTask('startServers', 'Start the mock servers', ['forever:idpserver:restart', 'forever:spserver:restart']);
    grunt.registerTask('stopServers', 'Start the mock servers', ['forever:idpserver:stop', 'forever:spserver:stop']);
	grunt.registerTask('doc', ['compile', 'jsdoc']);
};
