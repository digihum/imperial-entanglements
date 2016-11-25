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
    .pipe(gulp.dest('./dist/server/static'))
    .pipe(gulp.dest('./dist/app'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/client/sass/**/*.scss', ['sass']);
});

gulp.task('copy', function() {
  return [
      gulp.src('src/app/index.html')
      .pipe(gulp.dest('dist/app')),

      gulp.src('src/common/*.html')
      .pipe(gulp.dest('dist/server')),

      gulp.src('src/favicon.ico')
      .pipe(gulp.dest('dist/server/static')),

      gulp.src('src/client/font/**/*', { base: 'client/font'})
      .pipe(gulp.dest('dist/server/static/font')) 
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
