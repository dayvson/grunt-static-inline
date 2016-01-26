'use strict';

var grunt = require('grunt');

function readFile(file) {
  var contents = grunt.file.read(file);

  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }

  return contents;
}

exports.staticinline = {

  replaceScripts: function(test) {
    var actual = readFile('tmp/output-script.html');
    var expected = readFile('test/expected/output-script.html');
    test.equal(actual, expected, 'should replace only script tags');
    test.done();
  },

  replaceCss: function(test) {
    var actual = readFile('tmp/output-css.html');
    var expected = readFile('test/expected/output-css.html');
    test.equal(actual, expected, 'should replace only css tags');
    test.done();
  },

  replaceImg: function(test) {
    var actual = readFile('tmp/output-img.html');
    var expected = readFile('test/expected/output-img.html');
    test.equal(actual, expected, 'should replace image src');
    test.done();
  },

  replaceVariables: function(test) {
    var actual = readFile('tmp/output-variables.html');
    var expected = readFile('test/expected/output-variables.html');
    test.equal(actual, expected, 'should all variables described');
    test.done();
  },

  replaceFull: function(test) {
    var actual = readFile('tmp/output-full.html');
    var expected = readFile('test/expected/output-full.html');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceFullXHTML1: function(test) {
    var actual = readFile('tmp/output-full-xhtml.html');
    var expected = readFile('test/expected/output-full.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceFullXHTML2: function(test) {
    var actual = readFile('tmp/output-full-xhtml.xhtml');
    var expected = readFile('test/expected/output-full.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceMinifiedXHTML: function(test) {
    var actual = readFile('tmp/output-minified.xhtml');
    var expected = readFile('test/expected/output-minified.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  }
};
