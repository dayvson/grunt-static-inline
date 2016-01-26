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

  var resolveFilePath = function(templatePath, src, basepath) {
    var srcPath;
    if (!grunt.file.isPathAbsolute(src) && basepath) {
      srcPath = path.resolve(basepath + src);
    } else if (!grunt.file.isPathAbsolute(src)) {
      srcPath = path.resolve(path.dirname(templatePath), src);
    } else if (grunt.file.isPathAbsolute(src) && basepath) {
      srcPath = path.resolve(basepath + src);
    }
    return srcPath;
  };

  var readFile = function(templatePath, src, basepath, addCDATA) {
    var result = '';
    var srcPath = resolveFilePath(templatePath, src, basepath);
    if (srcPath) {
      result = grunt.file.read(srcPath).trim();
    }
    if (addCDATA) {
      result = '/*<![CDATA[*/' + result + '/*]]>*/';
    }
    return result;
  };

  var findReplaceScript = function(templatePath, content, basepath, addCDATA) {
    return content.replace(/<script[^<]*src=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*(\/>|><\/script>)/g, function(match, src) {

      // Remove attributes and closing `</script>`
      match = match.replace(/\s+src=['"]([^'"]+)['"]/, '')
                .replace(/\s+inline=['"]true['"]/, '')
                .replace(/\s*\/>/, '>').replace(/<\/script>/, '');

      return match + readFile(templatePath, src, basepath, addCDATA) + '</script>';
    });
  };

  var findReplaceLink = function(templatePath, content, basepath, addCDATA) {
    return content.replace(/<link[^<]*href=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*\/?>/g, function(match, src) {

      // Remove attributes
      match = match.replace(/<link/, '<style').replace(/\s*\/>/, '>')
                .replace(/\s+href=['"]([^'"]+)['"]/, '')
                .replace(/\s+rel=['"]stylesheet['"]/, '')
                .replace(/\s+inline=['"]true['"]/, '');

      return match + readFile(templatePath, src, basepath, addCDATA) + '</style>';
    });
  };

  var findReplaceImg = function(templatePath, content, basepath) {
    return content.replace(/<img[^<]*src=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*\/?>/g, function(match, src) {
      var srcPath = resolveFilePath(templatePath, src, basepath);
      if (srcPath) {
        return match.replace(/\s+inline=['"]true['"]/g, '').replace(src, datauri(srcPath));
      }
      return '';
    });
  };

  var findReplaceVariables = function(options, content) {
    Object.keys(options.vars).forEach(function(key) {
      var re = new RegExp(options.prefix + key + options.suffix, 'g');
      content = content.replace(re, options.vars[key]);
    });
    return content;
  };

  var findAndReplace = function(options, templatePath, content, addCDATA) {
    var result = findReplaceLink(templatePath, content, options.basepath, addCDATA);
    result = findReplaceScript(templatePath, result, options.basepath, addCDATA);
    result = findReplaceImg(templatePath, result, options.basepath);
    return findReplaceVariables(options, result);
  };

  var staticInlineTask = function() {
    var options = this.options({
      prefix: '@{',
      suffix: '}@',
      vars: {}
    });

    this.files.forEach(function(f) {
      var srcFile = f.src;
      var destFile = f.dest;
      var content = grunt.file.read(srcFile);
      
      // add CDATA section for XML and XHTML files
      var addCDATA = options.cdata || !!srcFile[0].match(/\.(xml|xhtml|xsd)$/i) || !!content.match(/(^<\?xml|<!DOCTYPE\s+html\s+PUBLIC\s+\"-\/\/W3C\/\/DTD\s+XHTML)/i);
      
      content = findAndReplace(options, srcFile, content, addCDATA);
      grunt.file.write(destFile, content);
    });
  };

  grunt.registerMultiTask('staticinline', 'A grunt plugin to replace url from static files such as images, CSS, JS, and put inline in a template', staticInlineTask);

};
