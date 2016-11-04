/* eslint-disable class-methods-use-this, global-require */

let gutil, scssLint, stylishReporter, failReporter;

export default class SCSSLintTask extends Elixir.Task {
  /**
   * Create a new SCSSLintTask instance.
   *
   * @param {string}      name    Task name
   * @param {GulpPaths}   paths   Gulp src and output paths
   * @param {object|null} options scss-lint options
   */
  constructor(name, paths, options) {
    super(name, null, paths);

    this.output  = '\u200B';
    this.options = options;
  }

  /**
   * Lazy load the task dependencies.
   *
   * @returns {void}
   */
  loadDependencies() {
    scssLint        = require('gulp-scss-lint');
    gutil           = require('gulp-util');
    stylishReporter = require('../reporters/stylish');
    failReporter    = require('../reporters/fail');
  }

  /**
   * Build up the Gulp task.
   *
   * @returns {void}
   */
  gulpTask() {
    return gulp.src(this.src.path)
      .pipe(this.lint())
      .pipe(gutil.buffer())
      .pipe(stylishReporter())
      .pipe(failReporter())
      .on('error', this.onError());
  }

  /**
   * Register file watchers.
   *
   * @returns {void}
   */
  registerWatchers() {
    this.watch(this.src.path);
  }

  /**
   * Lint task
   *
   * @returns {Stream} Object stream usable in Gulp pipes.
   */
  lint() {
    this.recordStep(`Executing ${this.ucName()}`);

    return scssLint(Object.assign({
      customReport() {
        // do nothing.
      }
    }, this.options));
  }
}
