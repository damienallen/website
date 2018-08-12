// Load requirements
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
const merge = require('merge-stream');

gulp.task('serve', ['sass', 'assets'], ()=>{
    browserSync.init({
        injectChanges: true,
        notify: false,
        port: 8000,
        proxy: 'localhost:8000',
    });
    gulp.watch('assets\\styles\\*.scss', ['sass']);
    gulp.watch('base\\templates\\*.html').on('change', browserSync.reload);
    gulp.watch('assets\\scripts\\*.js').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

gulp.task('sass', ()=>{
    gulp.src('assets\\styles\\*.scss')
        .pipe(sass())
        .pipe(gulp.dest('static\\css'))
        .pipe(browserSync.stream({match: 'static\\css\\*.css'}))
});

gulp.task('assets', ()=>{
    return merge(
        gulp.src('assets\\images\\*').pipe(gulp.dest('static\\img')).pipe(browserSync.stream()),
        gulp.src('assets\\scripts\\*').pipe(gulp.dest('static\\js')).pipe(browserSync.stream()),
        // Get simple icons
        gulp.src('assets\\icons\\.*').pipe(gulp.dest('static\\ic')),
        // Import JS libraries
        gulp.src('node_modules\\jquery\\dist\\jquery.js').pipe(gulp.dest('static\\js')),
        gulp.src('node_modules\\bootstrap\\dist\\js\\*.js').pipe(gulp.dest('static\\js')),
        gulp.src('node_modules\\bootstrap\\dist\\css\\*.css').pipe(gulp.dest('static\\css')),
    )
});
