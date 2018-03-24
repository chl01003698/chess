var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var tsProject = ts.createProject('./tsconfig.json');
var babelify = require('babelify');
var replace = require('gulp-string-replace');

gulp.task('share', function() {
  // Single entry point to browserify
  gulp
    .src('./header.js')
    .pipe(
      browserify({
        insertGlobals: true,
        require: ['./header.js', 'lodash', 'javascript-state-machine', 'eventemitter2', 'faker', 'axios', 'moment', 'bottlejs', 'timeago.js'],
        debug: false,
        transform: [
          babelify.configure({
            presets: ['es2015'],
            sourceMapsAbsolute: false,
            sourceMaps: false
          })
        ]
      })
    )
    // .pipe(derequire([{
    //   from: 'require',
    //   to: 'requir_'
    // }]))
    .pipe(replace('require', 'node_require'))
    .pipe(rename('share.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.watch(
    ['./app/**/*.ts', './app.ts'],
    function(event) {
      gulpSequence('ts', 'share')(function(err) {
        if (err) console.log(err);
      });
    }
  ); // 注意，任务列表是个数组，即使只有一个元素。
});
