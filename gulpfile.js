const path = require("path");
const { watch, series, dest, src, lastRun, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const dependants = require("gulp-dependents");
const filter = require("gulp-filter");
const chalk = require("chalk");
const through = require("through2");
const { cwd } = require("process");
const source = require("vinyl-source-stream");
const glob = require("glob");
const es = require("event-stream");
const buffer = require("vinyl-buffer");
const watchify = require("watchify");
const browserify = require("browserify");
const uglify = require("gulp-uglify");

const nodeEnv = process.env["NODE_ENV"] || "build";

const inputPath = process.env.INPUT_DIR || "content";
const buildPath = process.env.OUTPUT_DIR || "build";

const globs = {
    sass: `./${inputPath}/sass/**/*.scss`,
    sassPages: `./${inputPath}/sass/pages/*.scss`,
    js: `${inputPath}/scripts/*.js`,
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

function watchSass() {
    watch(globs.sass, compileSass);
}

function compileJS(cb) {
    return glob(globs.js, function (err, files) {
        if (err) cb(err);

        const tasks = files.map((entry) => {
            let b = browserify({
                entries: [entry],
                debug: nodeEnv === "dev",
                cache: {},
                packageCache: {},
            });

            const rebundle = () => {
                let stream = b
                    .bundle()
                    .on("error", function (err) {
                        console.log(
                            chalk.red(
                                "[JS] Error compiling file " + formatPath(entry)
                            )
                        );
                        console.log(err.stack || err.message);
                        this.emit("end");
                    })
                    .pipe(source(entry))
                    .pipe(setBase(`${inputPath}/scripts`))
                    .pipe(buffer());

                if (nodeEnv === "build") {
                    stream = stream.pipe(uglify());
                }

                return stream
                    .pipe(dest(`${buildPath}/scripts`))
                    .pipe(printSuccess("JS"));
            };

            if (nodeEnv === "dev") {
                const watch = watchify(b);
                watch.on("update", rebundle);
            }

            return rebundle();
        });
        return es.merge.apply(null, tasks);
    });
}

function setBase(base) {
    return through.obj(function (file, encoding, callback) {
        file["_base"] = base;
        file["base"] = base;
        callback(null, file);
    });
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

exports.dev = parallel(series(compileSass, watchSass), compileJS);
exports.build = parallel(compileSass, compileJS);
