var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var ejs = require("gulp-ejs");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var browserSync = require("browser-sync").create();

gulp.task("default", function () {
    gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
    gulp.watch("src/ejs/**/*.ejs", gulp.series("ejs"));
    gulp.watch("src/js/**/*.js", gulp.series("babel"));
});

// Sass
gulp.task("sass", function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/assets/css'));
});

// EJS
gulp.task("ejs", function () {
    return gulp.src(["src/ejs/**/*.ejs", '!' + "src/ejs/**/_*.ejs"])
        .pipe(ejs({}, {}, { ext: '.html' }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest("./dist/"));
});

// Babel
gulp.task("babel", function () {
    return gulp.src(["src/js/**/*.js", '!' + "js/**/_*.js"])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./dist/assets/js/'));
});

// browser-sync
gulp.task('build-server', function (done) {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    done();
    console.log('Server was launched');
});

// ブラウザのリロード
gulp.task('browser-reload', function (done) {
    browserSync.reload();
    done();
    console.log('Browser reload completed');
});

// 監視ファイル
gulp.task('watch-files', function (done) {
    gulp.watch("./dist/*/*.html", gulp.task('browser-reload'));
    gulp.watch("./dist/*/*/*.css", gulp.task('browser-reload'));
    gulp.watch("./dist/*/*.js", gulp.task('browser-reload'));
    done();
    console.log('gulp watch started');
})

gulp.task('bs', gulp.series('build-server', 'watch-files', function (done) {
    done();
    console.log('Default all task done!');
}));