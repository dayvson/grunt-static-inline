# grunt-static-inline [![Linux Build Status](https://img.shields.io/travis/dayvson/grunt-static-inline/master.svg?label=Linux%20build)](https://travis-ci.org/dayvson/grunt-static-inline) [![Windows Build status](https://img.shields.io/appveyor/ci/dayvson/grunt-static-inline/master.svg?label=Windows%20build)](https://ci.appveyor.com/project/dayvson/grunt-static-inline/branch/master)


> Replace URL from static files such as images, CSS, JS and variables and put them inline in a template.


## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-inline --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-inline');
```


## The "staticinline" task
_Run this task with the `grunt staticinline` command._


### Usage

In your project's Gruntfile, add a section named `staticinline` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
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
        'base_output.html': 'base_input.html'
      }
    }
  }
})
```

In your template file you should add `inline="true"` where you want to replace it with inline content; the inline attribute will be removed afterwards.

```html
@{DOCTYPE}@
<html>
  <head>
    <title>static inline</title>
    <link href="css/main.css" rel="stylesheet" inline="true">  <!-- absolute URL will use the `basepath` option -->
    <script src="js/app.js" inline="true"></script>
    <script src="js/common.js" inline="true"></script>
  </head>
  <body>
    <img src="imgs/MIT_Sloan.png" width="38" height="44" title="MIT Sloan" alt="MIT Sloan" inline="true">
    <h1>@{hello}@, Grunt inline static content plugin</h1>
  </body>
</html>
```


## Contributing

* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality.
* Lint and test your code using [Grunt](http://gruntjs.com/).
* Open a pull request :)
