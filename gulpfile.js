var gulp  = require('gulp')
  , watch = require('gulp-watch')
  , http = require('http')
  , ecstatic = require('ecstatic')
  , refresh = require('gulp-livereload')
  , lr    = require('tiny-lr')
  , server = lr()
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint')
  , rename = require('gulp-rename');

gulp.task('lr-server', function() {  
  server.listen(35729, function(err) {
      if(err) return console.log(err);
  });
});

gulp.task('http', function() {
  http.createServer(ecstatic({root: __dirname})).listen(8080);
});

gulp.task('compress', function() {
  gulp.src('ImageClipboard.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify({outSourceMaps: false, preserveComments: 'some'}))
    .pipe(rename('ImageClipboard.min.js'))
    .pipe(gulp.dest(''))
});

gulp.task('watch', function () {
  gulp.src(['Clipboard.js'])
    .pipe(watch())
    .pipe(refresh(server));
});

gulp.task('default', ['http', 'lr-server', 'watch']);