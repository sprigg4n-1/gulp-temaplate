const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');

// functions
function pages() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/pages/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        'app/scss/main.scss',
    ])
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/components/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'app/js/**/*.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/components/js'))
        .pipe(browserSync.stream())
}

function watching() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js'], scripts)
    watch(['app/pages/components/*', 'app/pages/*'], pages)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/components/css/style.min.css',
        'app/components/js/main.min.js',
        'app/images/**/*.*',
        '!app/images/dist/**/*.svg',
        'app/fonts/**/*.*',
        'app/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.pages = pages;
exports.scripts = scripts;
exports.watching = watching;
exports.building = building;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, pages, watching); 