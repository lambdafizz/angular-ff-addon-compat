module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            source: {
                files: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
                tasks: ['jshint:all', 'karma:unit:run', 'build', 'dist']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js']
        },
        docco: {
            docs: {
                src: ['src/**/*.js'],
                options: {
                    output: 'docs/'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true
            }
        },
        copy: {
            dist: {
                files: [
                    // copy the distribution into 'dist' diractory
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/'},
                ]
            },
            example: {
                files: [
                    // stash the dist into 'example-plugin/data/.components'
                    // so it can be accessed from contentscript
                    {expand: true,
                     cwd: 'dist/',
                     src: ['**'],
                     dest: 'example-plugin/data/.components/angular-ff-addon-compat/'},
                    // as well as angular and angular-route
                    {expand: true,
                     cwd: 'bower_components/',
                     src: ['angular/**'],
                     dest: 'example-plugin/data/.components/'},
                    {expand: true,
                     cwd: 'bower_components/',
                     src: ['angular-route/**'],
                     dest: 'example-plugin/data/.components/'}
                ]
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/ff-addon-compat.min.js': ['src/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['docco:docs']);

    grunt.registerTask('dist', ['copy:dist', 'uglify', 'copy:example']);

    grunt.registerTask('default', ['karma:unit:start',
                                   'watch:source']);
};