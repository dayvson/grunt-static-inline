var grunt = require('grunt');

exports.staticinline = {
  setUp: function(done) {
    done();
  },
  test_replace_scripts: function(test) {
    var actual = grunt.file.read('tmp/output-script.html');
    var expected = grunt.file.read('test/expected/output-script.html');
    test.equal(actual, expected, 'should replace only script tags');
    test.done();
  },
  test_replace_css: function(test) {
    var actual = grunt.file.read('tmp/output-css.html');
    var expected = grunt.file.read('test/expected/output-css.html');
    test.equal(actual, expected, 'should replace only css tags');
    test.done();
  },
  test_replace_img: function(test) {
    var actual = grunt.file.read('tmp/output-img.html');
    var expected = grunt.file.read('test/expected/output-img.html');
    test.equal(actual, expected, 'should replace image src');
    test.done();
  },
  test_replace_full: function(test) {
    var actual = grunt.file.read('tmp/output-full.html');
    var expected = grunt.file.read('test/expected/output-full.html');
    test.equal(actual, expected, 'should replace all elements with inline attributes');
    test.done();
  }
};
