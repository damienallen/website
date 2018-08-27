// Load requirements
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
var replace = require('gulp-replace');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const merge = require('merge-stream');


// Source directories
const staticSrc = 'assets';
const styleSrc = staticSrc + '/styles/**/*.scss';
const scriptSrc = staticSrc + '/scripts/**/*.js';
const imageSrc = staticSrc + '/images/**';
const documentSrc = staticSrc + '/documents/**';
const templateSrc = 'base/templates/**/*.html';

// Build directories
const buildDir = 'dist';
const cssDir = buildDir + '/css';
const jsDir = buildDir + '/js';
const imgDir = buildDir + '/img';
const docDir = buildDir + '/doc';
const svgDir = buildDir + '/svgs';

// Uncompressed file directories
const cssSrc = [cssDir + '/**/*.css', '!' + cssDir + '/**/*.min.css'];
const jsSrc = [jsDir + '/**/*.js', '!' + jsDir + '/**/*.min.js'];

// Compile and copy SASS files
function styles() {
    return gulp.src(styleSrc).pipe(sass()).pipe(gulp.dest(cssDir));
}

// Copy dashboard JS files
function scripts() {
    return gulp.src(scriptSrc).pipe(gulp.dest(jsDir));
}

// Copy & optimize images
function images() {
    return gulp.src(imageSrc).pipe(imagemin()).pipe(gulp.dest(imgDir)).pipe(browserSync.stream());
}

// Copy documents
function documents() {
    return gulp.src(documentSrc).pipe(gulp.dest(docDir));
}

// Copy required library files
function libraries() {
    return merge(
        // Dependencies from node_modules
        gulp.src('node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.*').pipe(gulp.dest(cssDir)),
        gulp.src('node_modules/trumbowyg/dist/trumbowyg.min.js').pipe(replace('ui/icons.svg', '../svgs/trumbowyg-icons.svg')).pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/trumbowyg/dist/ui/icons.svg').pipe(rename('trumbowyg-icons.svg')).pipe(gulp.dest(svgDir)),
        gulp.src('node_modules/trumbowyg/dist/ui/trumbowyg.min.css').pipe(gulp.dest(cssDir)),
        gulp.src('node_modules/popper.js/dist/umd/popper.min.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/js-cookie/src/js.cookie.js').pipe(gulp.dest(jsDir)),
        // Font icons
        gulp.src('node_modules/@fortawesome/fontawesome-free/js/all.js').pipe(rename('font-awesome.js')).pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/@fortawesome/fontawesome-free/svgs/**/*.svg').pipe(gulp.dest(svgDir)),
    )
}

function minifycss() {
    return gulp.src(cssSrc)
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssDir))
        .pipe(browserSync.stream());
}

function minifyjs() {
    return gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDir));
}

function clean() {
    return del([buildDir]);
}

// Sub tasks
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.documents = documents;
exports.libraries = libraries;

exports.minifycss = minifycss;
exports.minifyjs = minifyjs;
exports.clean = clean;

// Master tasks
var compile = gulp.series(gulp.parallel(styles, scripts, images, documents, libraries), gulp.parallel(minifycss, minifyjs));
gulp.task('compile', compile);
gulp.task('build', gulp.series(clean, compile));

var serve = gulp.series(compile, ()=>{
    browserSync.init({
        injectChanges: true,
        notify: false,
        // open: false, // turn off auto-open if desired
        port: 8000,
        proxy: {
            target: 'localhost:8000',
            proxyOptions: {
                changeOrigin: false
            }
        },
    });
    gulp.watch(styleSrc).on('change', gulp.series(styles, minifycss));
    gulp.watch(scriptSrc).on('change', gulp.series(scripts, minifyjs, browserSync.reload));
    gulp.watch(templateSrc).on('change', browserSync.reload);
});

gulp.task('serve', serve);
gulp.task('default', serve);
