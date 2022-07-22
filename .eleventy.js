require("dotenv").config();
const createPaginationItems = require("./custom filters/createPaginationItems");
const createTOCList = require("./custom filters/createTOCList");
const formatDate = require("./custom filters/formatDate");
const htmlmin = require("html-minifier");

const nodeEnv = process.env["NODE_ENV"] || "build";

const inputDir = process.env.INPUT_DIR || "content";
const outputDir = process.env.OUTPUT_DIR || "build";

module.exports = (config) => {
    config.addPassthroughCopy(`${inputDir}/assets`);
    config.setBrowserSyncConfig({
        files: [`${outputDir}/css/**/*.css`, `${outputDir}/scripts/**/*.js`],
        reloadDelay: 200,
    });

    config.setUseGitIgnore(false);

    config.addFilter("createTOCList", (content) => {
        return createTOCList(content);
    });

    config.addFilter("createPaginationItems", (data, count, collapsedCount) => {
        return createPaginationItems(data, count, collapsedCount);
    });

    config.addFilter("formatDate", (date, format = "YMD") => {
        return formatDate(date, format);
    });

    config.addCollection("news", (collection) => {
        const allItems = collection.getAll()[0].data.posts;

        return allItems.filter((item) => {
            return item.categories.includes("News");
        });
    });

    if (nodeEnv === "build") {
        config.addTransform("htmlmin", function (content, outputPath) {
            if (outputPath && outputPath.endsWith(".html")) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                });
                return minified;
            }
            return content;
        });
    }

    return {
        dir: {
            input: inputDir,
            output: outputDir,
        },
    };
};
