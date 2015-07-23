'use strict';

var grunt = require('grunt');

exports.staticinline = {

  replaceScripts: function(test) {
    var actual = grunt.file.read('tmp/output-script.html');
    var expected = grunt.file.read('test/expected/output-script.html');
    test.equal(actual, expected, 'should replace only script tags');
    test.done();
  },

  replaceCss: function(test) {
    var actual = grunt.file.read('tmp/output-css.html');
    var expected = grunt.file.read('test/expected/output-css.html');
    test.equal(actual, expected, 'should replace only css tags');
    test.done();
  },

  replaceImg: function(test) {
    var actual = grunt.file.read('tmp/output-img.html');
    var expected = grunt.file.read('test/expected/output-img.html');
    test.equal(actual, expected, 'should replace image src');
    test.done();
  },

  replaceVariables: function(test) {
    var actual = grunt.file.read('tmp/output-variables.html');
    var expected = grunt.file.read('test/expected/output-variables.html');
    test.equal(actual, expected, 'should all variables described');
    test.done();
  },

  replaceFull: function(test) {
    var actual = grunt.file.read('tmp/output-full.html');
    var expected = grunt.file.read('test/expected/output-full.html');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  }
};
