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
    .pipe(gulp.dest('./build/static'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./client/sass/**/*.scss', ['sass']);
});