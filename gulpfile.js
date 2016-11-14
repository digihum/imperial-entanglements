'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./client/sass/app.scss')
    .pipe(sass({
		includePaths: [
            'node_modules'
		]    	
    }).on('error', sass.logError))
    .pipe(gulp.dest('./build/static'))
    .pipe(gulp.dest('./build/app'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./client/sass/**/*.scss', ['sass']);
});

gulp.task('copy', function() {
  return [
      gulp.src('app/index.html')
      .pipe(gulp.dest('build/app')),

      gulp.src('common/*.html')
      .pipe(gulp.dest('build/common')),

      gulp.src('favicon.ico')
      .pipe(gulp.dest('build/static')),

      gulp.src('client/font/**/*', { base: 'client/font'})
      .pipe(gulp.dest('build/static/font')) 
      .pipe(gulp.dest('build/app/font'))    
    ];
});

gulp.task('default', ['copy', 'sass']);