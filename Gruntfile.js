/*
 * grunt-static-inline
 * https://github.com/dayvson/grunt-static-inline
 *
 * Copyright (c) 2013 Maxwell Da Silva
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    staticinline: {
      main: {
        options: {
          prefix: '@{',
          suffix: '}@',
          vars: {
            'hello': 'Hello World',
            'DOCTYPE': '<!DOCTYPE html>',
            'partial_include': '<%= grunt.file.read("test/fixtures/partial.html") %>'
          },
          basepath: 'test/fixtures/'
        },
        files: {
          'tmp/output-css.html': 'test/fixtures/template-linkcss.html',
          'tmp/output-script.html': 'test/fixtures/template-script.html',
          'tmp/output-img.html': 'test/fixtures/template-img.html',
          'tmp/output-full.html': 'test/fixtures/template-full.html',
          'tmp/output-variables.html': 'test/fixtures/template-variables.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: 'test/*_test.js'
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'staticinline', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', 'test');

};
