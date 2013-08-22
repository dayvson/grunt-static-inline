/*
 * grunt-static-inline
 * https://github.com/dayvson/grunt-static-inline
 *
 * Copyright (c) 2013 Maxwell Da Silva
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var datauri = require('datauri');
  var path = require('path');
  var description = 'A grunt plugin to replace url from static files such as img,js,css an put inline in a template';  
  var resolveFilePath = function(templatePath, src){
    var srcPath;
    if(!grunt.file.isPathAbsolute(src)){
      srcPath = path.resolve(path.dirname(templatePath), src);
      if(grunt.file.exists(srcPath)){
        return srcPath;
      }
    }
    return srcPath;
  };

  var baseReplace = function(templatePath, tag, src){
    var result = '';
    var srcPath = resolveFilePath(templatePath, src);
    if(srcPath){
      result = '<%%TAG%%>\n%%CONTENT%%\n</%%TAG%%>'
                 .replace(/%%CONTENT%%/g, grunt.file.read(srcPath))
                 .replace(/%%TAG%%/g, tag);
    }
    return result;
  };

  var findReplaceScript = function(templatePath, content){
    return content.replace(/<script.*src=['"]([^'"]+)['"].*inline=['"]true['"].*><\/script>/g, function(match, src){
      return baseReplace(templatePath, "script", src);
    });
  };

  var findAndReplace = function(templatePath, content){
    return findReplaceScript(templatePath, content);
  };

  var staticInlineTask = function(){
    this.files.forEach(function(f){
      var srcFile = f.orig.src[0];
      var destFile = f.dest;
      var content = grunt.file.read(srcFile);
      content = findAndReplace(srcFile, content);
      
      grunt.file.write(destFile, content);
    });
  };
  grunt.registerMultiTask('staticinline', description, staticInlineTask);

};
