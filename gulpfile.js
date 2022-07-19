const path = require("path");
const { watch, series, dest, src, lastRun } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const dependants = require("gulp-dependents");
const filter = require("gulp-filter");
const chalk = require("chalk");
const through = require("through2");
const { cwd } = require("process");

const inputPath = process.env.INPUT_DIR || "content";
const buildPath = process.env.OUTPUT_DIR || "build";

const globs = {
    sass: `./${inputPath}/sass/**/*.scss`,
    sassPages: `./${inputPath}/sass/pages/*.scss`,
};

function compileSass() {
    const basePath = `${inputPath}/sass`;

    return src(globs.sass, {
        since: lastRun(compileSass),
        base: basePath,
    })
        .pipe(dependants())
        .pipe(filter(globs.sassPages))
        .pipe(
            sass().on("error", function (err) {
                console.log(
                    chalk.red(
                        `[SASS] Error compiling file ${formatPath(err.file)}`
                    )
                );
                sass.logError.call(this, err);
            })
        )
        .pipe(dest(`./${buildPath}/css`))
        .pipe(printSuccess("SASS"));
}

function formatPath(str) {
    return path.normalize(path.resolve(str).replace(cwd(), ""));
}

function printSuccess(type) {
    return through.obj(function (file, encoding, callback) {
        const inputPath = file.history[file.history.length - 2];
        const formattedPath = formatPath(inputPath);
        console.log(chalk.green(`[${type}] Compiled file ${formattedPath}`));
        callback(null, file);
    });
}

function watchSass() {
    watch(globs.sass, compileSass);
}

exports.dev = series(compileSass, watchSass);
exports.build = compileSass;
