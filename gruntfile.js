module.exports = function(grunt) {
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
            'dist':'./dist/',
            'src':'./src/'
		},
        concat: {
          options: {
            separator: grunt.util.linefeed,
          },
          dist: {
            src: [
                '<%= dirs.src %>breadcrumb.js',
                '<%= dirs.src %>clips.js',
                '<%= dirs.src %>contrast.js',
                '<%= dirs.src %>counter.js',
                '<%= dirs.src %>download.js',
                '<%= dirs.src %>imagepx.js',
                '<%= dirs.src %>imageurl.js',
                '<%= dirs.src %>limiter.js',
                '<%= dirs.src %>noprhan.js',
                '<%= dirs.src %>replacer.js',
                '<%= dirs.src %>speek.js',
                '<%= dirs.src %>syntax.js',
                '<%= dirs.src %>wym.js',
                '<%= dirs.src %>zoom.js'
            ],
            dest: '<%= dirs.dist %>redactor-plugins.all.js',
          },
        },
		uglify: {
			main: {
				options: {
					report: 'min'
				},
				files: {
					'<%= dirs.dist %>redactor-plugins.all.min.js': [
                        '<%= dirs.dist %>redactor-plugins.all.js'
                ]
				}
			}
		},
		watch: { /* trigger tasks on save */
			options: {
				livereload: true
			},
			js: {
				files: ['<%= dirs.src %>*.js'],
				tasks: ['uglify', 'growl:uglify']
			}
		},
		growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
			uglify: {
				title: "grunt",
				message: "JavaScript minified."
			},
			watch: {
				title: "grunt",
				message: "Watching. Grunt has its eye on you."
			}
		},
        bump: {
            pkg: {
                files: [
                    {src:'./package.json',dest:'./package.json'},
                    {src:'./bower.json',dest:'./bower.json'}
                ],
                options: {
                    replacements:[{
						pattern:/"version":\s*"\d.\d.\d"/ig,
						replacement:'"version": "' + (grunt.option('ver') || '<%= pkg.version %>') + '"'
                    },{
						pattern:/"release"\s*:\s*"(.*?)"/ig,
						replacement:'"release": "' + (grunt.option('rel') || '<%= pkg.release %>') + '"'
                    }]
                }
            }
        },
        jsvalidate: {
          options:{
            globals: {},
            esprimaOptions: {},
            verbose: false
          },
          target:{
            files:{
              src:['<%= dirs.src %>*.js']
            }
          }
        }
	};
    
    var plugins = [
        'breadcrumb',
        'clips',
        'contrast',
        'counter',
        'download',
        'imagepx',
        'imageurl',
        'limiter',
        'norphan',
        'replacer',
        'speek',
        'syntax',
        'wym',
        'zoom'
    ];
    
    for(var i = 0; i < plugins.length; i++) {
        initConfig.uglify[plugins[i]] = {
			options: {
				report: 'min'
			},
			files: {
			}
        }
        initConfig.uglify[plugins[i]].files[('<%= dirs.dist %>' + plugins[i] + '.min.js')] = ('<%= dirs.src %>' + plugins[i] + '.js');
    }

	grunt.initConfig(initConfig);

	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-growl');
    grunt.loadNpmTasks('grunt-jsvalidate');
    
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.renameTask('string-replace','bump');

	grunt.registerTask('default',['growl:watch','watch']);
	grunt.registerTask('build',['concat','uglify','jsvalidate','bump']);
    
};
