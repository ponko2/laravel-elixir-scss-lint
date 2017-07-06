'use strict';

var gulp            = require('gulp');
var Elixir          = require('laravel-elixir');
var Task            = Elixir.Task;
var config          = Elixir.config;
var scssLint        = require('gulp-scss-lint');
var gutil           = require('gulp-util');
var objectAssign    = require('object-assign');
var stylishReporter = require('./reporters/stylish');
var failReporter    = require('./reporters/fail');

Elixir.extend('scssLint', function (src, options) {
  var notify = new Elixir.Notification();

  var paths = new Elixir.GulpPaths()
    .src(src || [config.get('assets.css.sass.folder') + '/**/*.scss']);

  var onError = function (err) {
    notify.error(err, 'SCSS-Lint Failed');
    this.emit('end');
  };

  new Task('scss-lint', function () {
    this.log(paths.src);

    return gulp.src(paths.src.path)
      .pipe(scssLint(objectAssign({
        customReport: function () {
          // do nothing.
        }
      }, options)))
      .pipe(gutil.buffer())
      .pipe(stylishReporter())
      .pipe(failReporter())
      .on('error', onError);
  })
    .watch(paths.src.path);
});
