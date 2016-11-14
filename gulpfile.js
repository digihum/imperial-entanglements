'use strict';
 
const gulp = require('gulp');
const sass = require('gulp-sass');
const nightwatch = require('gulp-nightwatch')
 
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

gulp.task('test', () => {
  return gulp.src('')
    .pipe(nightwatch({
      configFile: 'nightwatch.conf.js'
    }))
})

gulp.task('default', ['copy', 'sass']);