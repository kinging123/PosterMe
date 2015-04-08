/*jshint esnext: true, node: true*/
"use strict";
var autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps'),
    minifyCSS    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    clean        = require('gulp-clean'),
    sass         = require('gulp-sass'),
    gulp         = require('gulp'),
    to5          = require('gulp-6to5');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('watch', function() {
    browserSync({
        port: 8083,
        server: {
            baseDir: "./"
        }
    });
    
    gulp.watch('./files/javascript/*.js', [reload]);
    gulp.watch('./files/css/*.scss', ['styles', reload]);
    gulp.watch("*.html").on('change', reload);
});


gulp.task('styles', function() {
    console.log('styles');
    gulp.src('files/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(concat('output.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./files/css'));
});

gulp.task('scripts', function() {
    gulp.src('files/javascript/*.js')
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(concat('output.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./files/javascript'));
});