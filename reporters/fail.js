'use strict';

var gutil       = require('gulp-util');
var map         = require('map-stream');
var events      = require('events');
var emitter     = new events.EventEmitter();
var PluginError = gutil.PluginError;

module.exports = function () {
  return map(function (files, cb) {
    var fails, message;
    var errors = files.filter(function (file) {
      return !file.scsslint.success;
    });

    if (errors.length > 0) {
      fails = errors.map(function (file) {
        return file.path;
      });

      message = fails.join(', ');

      emitter.emit('error', new PluginError('scss-lint', message));
    }

    cb(null, files);
  });
};
