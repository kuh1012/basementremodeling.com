const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const browserSync = require(`browser-sync`).create();
const tinypng = require(`gulp-tinypng-compress`);
const svgSprite = require(`gulp-svg-sprites`);
const webp = require(`gulp-webp`);
const rename = require(`gulp-rename`);
const del = require(`del`);
const sharp = require('sharp')
const fs = require("fs");
let version = fs.readFileSync('.applicationVersion').toString();

gulp.task(`browser-sync`, () => {
    browserSync.init({
        proxy: "localhost:8888",
        open: false,
        cors: true
    });
    gulp.watch(`./**/*.scss`, gulp.series(`styles`));
    gulp.watch(`./**/admin.scss`, gulp.series(`admin`));
    gulp.watch(`./**/editor.scss`, gulp.series(`editor`));
    gulp.watch(`./source/images/**/*.{png,jpg,jpeg}`, gulp.series(`bitmap`));
    gulp.watch(`./source/images/**/*.{png,jpg,jpeg}`, gulp.series(`webp`));
    gulp.watch(`./source/images/*.svg`, gulp.series(`vector`));
    gulp.watch(`./source/images/sprite/*.svg`, gulp.series(`sprite`));
    gulp.watch(`./source/fonts/*.{woff, woff2, ttf}`, gulp.series(`fonts`));
    gulp.watch(`./views/**/*.hbs`, gulp.series(`reload`));
    gulp.watch(`./public/scripts/*.js`, gulp.series(`reload`));
});

// SASS -> CSS (Check .scss changes in all folder && compile css)
gulp.task(`styles`, () => {
    return gulp.src(`./source/styles/index.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename(`main_${version}.min.css`))
        .pipe(gulp.dest(`./public/styles`))
        .pipe(browserSync.stream());
});

// SASS -> CSS (Check .scss changes in all folder && compile css)
gulp.task(`admin`, () => {
    return gulp.src(`./source/styles/admin.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename(`admin.min.css`))
        .pipe(gulp.dest(`./public/styles`))
        .pipe(browserSync.stream());
});

gulp.task(`home`, () => {
    return gulp.src(`./source/styles/home.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename(`home_${version}.min.css`))
        .pipe(gulp.dest(`./public/styles`))
        .pipe(browserSync.stream());
});

gulp.task(`my_bootstrap`, () => {
    return gulp.src(`./source/styles/my_bootstrap.mini.css`)
        .pipe(gulp.dest(`./public/styles`));
});

// SASS -> CSS (Check .scss changes in all folder && compile css)
gulp.task(`editor`, () => {
    return gulp.src(`./source/styles/editor.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename(`editor.min.css`))
        .pipe(gulp.dest(`./public/styles`))
        .pipe(browserSync.stream());
});

// Bitmap images => Tinypng service to optimize
gulp.task(`bitmap`, () => {
    return gulp.src(`./source/images/**/*.{png,jpg,jpeg}`)
        .pipe(tinypng({
            // key: `wNS29BVwd8BM7rkKHQxBKtnLgZHxbM81`,
            key: `k82WT7tDXGyVvxQbGxGc1TpJ740BzV3d`,
            sigFile: `./public/images/.tinypng-sigs`,
            summarize: true,
            parallel: true,
            log: true
        }))
        .pipe(gulp.dest(`./public/images`))
        .pipe(browserSync.stream());
});

// Vector images sync
gulp.task(`vector`, () => {
    del.sync(`./public/images/vector/*.svg`);
    return gulp.src(`./source/images/vector/*.svg`)
        .pipe(gulp.dest(`./public/images/vector`));
});

gulp.task(`sprite`, () => {
    return gulp.src(`./source/images/sprite/*.svg`)
        .pipe(plumber())
        .pipe(svgSprite())
        .pipe(gulp.dest(`./public/images/`));
});

gulp.task(`webp`, () => {
    return gulp.src(`./source/images/**/*.{png,jpg,jpeg}`)
        .pipe(webp())
        .pipe(gulp.dest(`./public/images`));
});

gulp.task(`copy`, () => {
    return gulp.src(`./source/images/**/*.{png,jpg,jpeg}`)
        .pipe(gulp.dest(`./public/images`));
});

gulp.task(`copy_analytics`, () => {
    return gulp.src(`./source/scripts/analytics.js`)
        .pipe(gulp.dest(`./public/scripts/`));
});
// Fonts (Copy all fonts to public folder)
gulp.task(`fonts`, () => {
    del.sync(`./public/fonts`);
    return gulp.src(`./source/fonts/*`)
        .pipe(gulp.dest(`./public/fonts`));
});

// Reload browser
gulp.task(`reload`, (done) => {
    browserSync.reload();
    done();
});

// const tasks = [`browser-sync`, `styles`, `admin`, `fonts`, `bitmap`, `webp`, `vector`, `sprite`];
const tasks = [`browser-sync`, `styles`,'home', 'my_bootstrap', `admin`, 'fonts', `vector`,`sprite`, 'webp', `editor`, 'copy', 'copy_analytics'];
gulp.task(`default`, gulp.parallel(...[`browser-sync`, `styles`,'home', 'my_bootstrap', `admin`, 'fonts', `sprite`, `editor`, 'copy', 'copy_analytics']));
gulp.task('all', gulp.series(...[`styles`,'home', `admin`,'my_bootstrap', `fonts`, `bitmap`, `webp`, `vector`, `sprite`]))
gulp.task(`prod`,gulp.series(...[`styles`,'home',`admin`,'my_bootstrap', 'fonts',`bitmap`,`webp`, `vector`,`sprite`, `editor`, 'copy', 'copy_analytics']))