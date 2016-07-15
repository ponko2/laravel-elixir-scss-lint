const gutil       = require('gulp-util');
const map         = require('map-stream');
const events      = require('events');
const emitter     = new events.EventEmitter();
const PluginError = gutil.PluginError;

module.exports = function () {
  return map((files, cb) => {
    const errors = files.filter(file => !file.scsslint.success);

    if (errors.length > 0) {
      const errorMessage = 'Errors were found while linting code.';
      emitter.emit('error', new PluginError('scss-lint', errorMessage));
    }

    cb(null, files);
  });
};
