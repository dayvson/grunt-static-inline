var grunt = require('grunt');

exports.staticinline = {
  setUp: function(done) {
    done();
  },
  test_replace_scripts: function(test) {
    var actual = grunt.file.read('tmp/output-onlyscript.html');
    var expected = grunt.file.read('test/expected/output-onlyscript.html');
    test.equal(actual, expected, 'should replace only script tags');
    test.done();
  }
};
