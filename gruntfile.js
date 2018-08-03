
// GRUNT
module.exports = function(grunt) {

	// directories
	var projName = '';
	var proj = {
		root: './public/'
	};
	// development
	var dev	= {
		root: './dev_stack',
		sass: '/SASSy/src/sass',
		css: '/css',
		js: '/js',
		fonts: '/fonts'
	};
	// production
	var dist = {
		root: proj.root+'/assets',
		css: '/css',
		images: '/images',
		js: '/js',
		fonts: '/fonts'
	};

	// initial config
	grunt.initConfig({

		// load package
		pkg: grunt.file.readJSON('package.json'),

		// copy
		copy: {
			info: {
				files: [
					{
						expand: true,
						src: ['_README.md', '_LICENSE.md'],
						dest: proj.root + '/'
					},
				]
			},
			scripts: {
				files: [
					{
						cwd: 'node_modules/html5-boilerplate/dist/js/vendor/',
						expand: true,
						src: 'modernizr-3.6.0.min.js',
						dest: dev.root+dev.js + '/vendors/'
					},
					{
						cwd: 'node_modules/html5-boilerplate/dist/js/vendor/',
						expand: true,
						src: 'jquery-3.3.1.min.js',
						dest: dev.root+dev.js + '/vendors/'
					},
					{
						cwd: 'node_modules/jquery-mousewheel/',
						expand: true,
						src: 'jquery.mousewheel.js',
						dest: dev.root+dev.js + '/vendors/'
					}
				]
			},
			fonts: {
				files: [
					{
						cwd: dev.root+dev.fonts,
						expand: true,
						src: '*', // all fonts in the folder => remove unnecessary font files
						dest: dist.root+dist.fonts
					}
				]
			}
		},

		// GOOGLE FONTS
		// https://google-webfonts-helper.herokuapp.com/fonts
		curl: {
			'google-fonts-source': {
				src: 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCrD4mhSNS7LYjy1dcVq-AL4bBc47akVYM',
				dest: dev.root + dev.fonts + '/google-fonts-source.json'
			}
		},

		// compile, convert & compress sass
		sass: {
			dev: {
				options: {
					sourcemap: false,
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: dev.root+dev.sass,
					src: ['*.scss'],
					dest: dev.root+dev.css,
					ext: '.dev.css'
				}]
			}
		},
		
		// prefix css
		postcss: {
			options: {
				sourcemap: false,
				processors: [
					require('autoprefixer')()
				],
			},
			dist: {
				src: dev.root+dev.css + '/*.dev.css',
				dest: dist.root+dist.css + '/styles.prefixed.css'
			}
		},

		// minify css
		cssnano: {
			options: {
				sourcemap: false
			},
			dist: {
				src: dist.root+dist.css + '/styles.prefixed.css',
				dest: dist.root+dist.css + '/styles.min.css'
			}
		},

		// lint JS for errors
		jshint: {
			files: [
				'gruntfile.js',
				dev.root+dev.js+'/wordpress/*.js',
				dev.root+dev.js+'/src/*.js',
				dev.root+dev.js+'/test/*.js',
			],
			options: {
				esversion: 6,
				globals: {
					jQuery: true
				}
			}
		},

		// concat all js files
		concat: {
			options: {
				sourceMap: false,
				separator: '\n\n\n\n\n/** ================================================== **/\n'
			},
			dev: {
				src: [
					dev.root+dev.js+'/vendors/*.js',
					dev.root+dev.js+'/wordpress/*.js',
					dev.root+dev.js+'/src/*.js',
					dev.root+dev.js+'/test/*.js',
				],
				dest: dev.root+dev.js+'/concatenated/scripts.concat.js'
			},
			dist: {
				src: [
					dev.root+dev.js+'/vendors/*.js',
					dev.root+dev.js+'/wordpress/*.js',
					dev.root+dev.js+'/src/*.js',
					dev.root+dev.js+'/test/*.js',
				],
				dest: dist.root+dist.js+'/scripts.concat.js'
			}
		},

		// convert JS ES6 to ES5 compatible
		babel: {
			options: {
				sourceMap: false,
				presets: ['env']
			},
			dist: {
				files: [{
					expand: true,
					cwd: dev.root+dev.js+'/concatenated',
					src: ['**/*.js'],
					dest: dev.root+dev.js+'/compiled',
					ext: '.compiled.js'
				}]
			}
		},

		// compress JS
		uglify: {
			options: {
				mangle: true
			},
			build : {
				src : [
					dev.root+dev.js+'/compiled/scripts.compiled.js'
				],
				dest: dist.root+dist.js+'/scripts.min.js',
			}
		},

		// watcher
		watch: {
			css: {
				files: [dev.root+dev.sass+'/**/*.scss'],
				tasks: ['sass', 'postcss', 'cssnano']
			},
			js: {
				files: [dev.root+dev.js+'/**/*.js'],
				tasks: ['jshint', 'concat', 'babel', 'uglify']
			}
		}

	});

	// load plugins
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-babel');

	// register tasks
	grunt.registerTask('default', [
		'copy',
		'makepot',
		'curl',
		'sass',
		'postcss',
		'cssnano',
		'jshint',
		'concat',
		'babel',
		'uglify'
	]);

};
