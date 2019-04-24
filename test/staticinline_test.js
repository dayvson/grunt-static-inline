'use strict';

const grunt = require('grunt');

function readFile(file) {
  let contents = grunt.file.read(file);

  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }

  return contents;
}

exports.staticinline = {

  replaceScripts(test) {
    const actual = readFile('tmp/output-script.html');
    const expected = readFile('test/expected/output-script.html');
    test.equal(actual, expected, 'should replace only script tags');
    test.done();
  },

  replaceCss(test) {
    const actual = readFile('tmp/output-css.html');
    const expected = readFile('test/expected/output-css.html');
    test.equal(actual, expected, 'should replace only css tags');
    test.done();
  },

  replaceImg(test) {
    const actual = readFile('tmp/output-img.html');
    const expected = readFile('test/expected/output-img.html');
    test.equal(actual, expected, 'should replace image src');
    test.done();
  },

  replaceVariables(test) {
    const actual = readFile('tmp/output-variables.html');
    const expected = readFile('test/expected/output-variables.html');
    test.equal(actual, expected, 'should all variables described');
    test.done();
  },

  replaceFull(test) {
    const actual = readFile('tmp/output-full.html');
    const expected = readFile('test/expected/output-full.html');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceFullXHTML1(test) {
    const actual = readFile('tmp/output-full-xhtml.html');
    const expected = readFile('test/expected/output-full.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceFullXHTML2(test) {
    const actual = readFile('tmp/output-full-xhtml.xhtml');
    const expected = readFile('test/expected/output-full.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  },

  replaceMinifiedXHTML(test) {
    const actual = readFile('tmp/output-minified.xhtml');
    const expected = readFile('test/expected/output-minified.xhtml');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  }
};
