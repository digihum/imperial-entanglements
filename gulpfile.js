'use strict';
 
const gulp = require('gulp');
const sass = require('gulp-sass');
const nightwatch = require('gulp-nightwatch')
 
gulp.task('sass', function () {
  return gulp.src('./src/client/sass/app.scss')
    .pipe(sass({
		includePaths: [
            'node_modules'
		]    	
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/static'))
    .pipe(gulp.dest('./dist/app'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/client/sass/**/*.scss', ['sass']);
});

gulp.task('copy', function() {
  return [
      gulp.src('src/app/index.html')
      .pipe(gulp.dest('dist/app')),

      gulp.src('src/favicon.ico')
      .pipe(gulp.dest('dist/static')),

      gulp.src('src/client/font/**/*', { base: 'src/client/font'})
      .pipe(gulp.dest('dist/static/font')) 
      .pipe(gulp.dest('dist/app/font'))    
    ];
});

gulp.task('test', () => {
  return gulp.src('')
    .pipe(nightwatch({
      configFile: 'nightwatch.conf.js'
    }))
})

gulp.task('default', ['copy', 'sass']);
