/*
 * grunt-static-inline
 * https://github.com/dayvson/grunt-static-inline
 *
 * Copyright (c) 2013 Maxwell Da Silva
 * Licensed under the MIT license.
 */

const path = require('path');
const datauri = require('datauri').sync;

module.exports = function(grunt) {
  const resolveFilePath = (templatePath, src, basepath) => {
    let srcPath;
    if (!grunt.file.isPathAbsolute(src) && basepath) {
      srcPath = path.resolve(basepath + src);
    } else if (!grunt.file.isPathAbsolute(src)) {
      srcPath = path.resolve(path.dirname(templatePath), src);
    } else if (grunt.file.isPathAbsolute(src) && basepath) {
      srcPath = path.resolve(basepath + src);
    }
    return srcPath;
  };

  const readFile = (templatePath, src, basepath, addCDATA) => {
    let result = '';
    const srcPath = resolveFilePath(templatePath, src, basepath);
    if (srcPath) {
      result = grunt.file.read(srcPath).trim();
    }
    if (addCDATA) {
      result = `/*<![CDATA[*/${result}/*]]>*/`;
    }
    return result;
  };

  const findReplaceScript = (templatePath, content, basepath, addCDATA) => {
    return content.replace(/<script[^<]*src=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*(\/>|><\/script>)/g, (match, src) => {

      // Remove attributes and closing `</script>`
      match = match.replace(/\s+src=['"]([^'"]+)['"]/, '')
        .replace(/\s+inline=['"]true['"]/, '')
        .replace(/\s*\/>/, '>')
        .replace(/<\/script>/, '');

      return `${match + readFile(templatePath, src, basepath, addCDATA)}</script>`;
    });
  };

  const findReplaceLink = (templatePath, content, basepath, addCDATA) => {
    return content.replace(/<link[^<]*href=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*\/?>/g, (match, src) => {

      // Remove attributes
      match = match.replace(/<link/, '<style')
        .replace(/\s*\/>/, '>')
        .replace(/\s+href=['"]([^'"]+)['"]/, '')
        .replace(/\s+rel=['"]stylesheet['"]/, '')
        .replace(/\s+inline=['"]true['"]/, '');

      return `${match + readFile(templatePath, src, basepath, addCDATA)}</style>`;
    });
  };

  const findReplaceImg = (templatePath, content, basepath) => {
    return content.replace(/<img[^<]*src=['"]([^'"]+)['"][^<]*inline=['"]true['"][^<]*\/?>/g, (match, src) => {
      const srcPath = resolveFilePath(templatePath, src, basepath);
      if (srcPath) {
        return match.replace(/\s+inline=['"]true['"]/g, '').replace(src, datauri(srcPath));
      }
      return '';
    });
  };

  const findReplaceVariables = (options, content) => {
    Object.keys(options.vars).forEach(key => {
      const re = new RegExp(options.prefix + key + options.suffix, 'g');
      content = content.replace(re, options.vars[key]);
    });
    return content;
  };

  const findAndReplace = (options, templatePath, content, addCDATA) => {
    let result = findReplaceLink(templatePath, content, options.basepath, addCDATA);
    result = findReplaceScript(templatePath, result, options.basepath, addCDATA);
    result = findReplaceImg(templatePath, result, options.basepath);
    return findReplaceVariables(options, result);
  };

  const staticInlineTask = function() {
    const options = this.options({
      prefix: '@{',
      suffix: '}@',
      vars: {}
    });

    this.files.forEach(f => {
      const srcFile = f.src[0];
      const destFile = f.dest;
      let content = grunt.file.read(srcFile);

      // add CDATA section for XML and XHTML files
      const addCDATA = options.cdata || Boolean(srcFile.match(/\.(xml|xhtml|xsd)$/i)) || Boolean(content.match(/(^<\?xml|<!DOCTYPE\s+html\s+PUBLIC\s+"-\/\/W3C\/\/DTD\s+XHTML)/i));

      content = findAndReplace(options, srcFile, content, addCDATA);
      grunt.file.write(destFile, content);
    });
  };

  grunt.registerMultiTask('staticinline', 'A grunt plugin to replace url from static files such as images, CSS, JS, and put inline in a template', staticInlineTask);
};
