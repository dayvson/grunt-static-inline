/*
 * grunt-static-inline
 * https://github.com/dayvson/grunt-static-inline
 *
 * Copyright (c) 2013 Maxwell Da Silva
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';
  var datauri = require('datauri');
  var path = require('path');
  var description = 'A grunt plugin to replace url from static files such as img,js,css an put inline in a template';  
  var resolveFilePath = function(templatePath, src, basepath){
    var srcPath;
    if(!grunt.file.isPathAbsolute(src)){
      srcPath = path.resolve(path.dirname(templatePath), src);
      if(grunt.file.exists(srcPath)){
        return srcPath;
      }
    }else if(grunt.file.isPathAbsolute(src) && basepath){
      srcPath = path.resolve(basepath + src);
      if(grunt.file.exists(srcPath)){
        return srcPath;
      }
    }
    return srcPath;
  };

  var baseTAGReplace = function(templatePath, tag, src, basepath){
    var result = '';
    var srcPath = resolveFilePath(templatePath, src, basepath);
    if(srcPath){
      result = '<TAG>CONTENT</TAG>'
                 .replace(/CONTENT/g, grunt.file.read(srcPath).trim())
                 .replace(/TAG/g, tag);
    }
    return result;
  };

  var findReplaceScript = function(templatePath, content, basepath){
    return content.replace(/<script[^<]src=['"]([^'"]+)['"][^<]inline=['"]true['"][^<]><\/script>/g, function(match, src){
      return baseTAGReplace(templatePath, "script", src, basepath);
    });
  };

  var findReplaceLink = function(templatePath, content, basepath){
    return content.replace(/<link[^<]*href=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*\/?\s*>/g, function(match, src){
      return baseTAGReplace(templatePath, "style", src, basepath);
    });
  };

  var findReplaceImg = function(templatePath, content, basepath){
    return content.replace(/<img[^<]src=['"]([^'"]+)['"][^<]inline=['"]true['"][^<]\/?\s*>/g, function(match, src){
        var srcPath = resolveFilePath(templatePath, src, basepath);
        if(srcPath){
          return match.replace(/inline=['"]true['"]/g, '').replace(src, datauri(srcPath));
        }
        return '';
    });
  };

  var findReplaceVariables = function(options, content){
    Object.keys(options.vars).forEach(function(key){
      var re = new RegExp(options.prefix + key + options.suffix, "g");
      content = content.replace(re, options.vars[key]);
    });
    return content;
  };

  var findAndReplace = function(options, templatePath, content){
    return findReplaceVariables(options,
           findReplaceImg(templatePath, 
           findReplaceScript(templatePath,  
           findReplaceLink(templatePath, content, options.basepath), options.basepath), options.basepath));
  };

  var staticInlineTask = function(){
    var options = this.options({
        prefix: '@{',
        suffix: '}@',
        vars: {}
      });

    this.files.forEach(function(f){
      var srcFile = f.orig.src[0];
      var destFile = f.dest;
      var content = grunt.file.read(srcFile);
      content = findAndReplace(options, srcFile, content);
      grunt.file.write(destFile, content);
    });
  };
  grunt.registerMultiTask('staticinline', description, staticInlineTask);

};
