require("dotenv").config();
const createPaginationItems = require("./custom filters/createPaginationItems");
const createTOCList = require("./custom filters/createTOCList");
console.log(createTOCList);
module.exports = (config) => {
    //   config.addWatchTarget("./content/assets/");
    config.setBrowserSyncConfig({
        files: "./build/css/**/*.css",
    });
    config.addPassthroughCopy("content/assets");
    config.addPassthroughCopy("content/scripts");

    config.addFilter("createTOCList", (headings) => {
        return createTOCList(headings);
    });

    config.addFilter("createPaginationItems", (data, count, collapsedCount) => {
        return createPaginationItems(data, count, collapsedCount);
    });

    return {
        dir: {
            input: "content",
            output: `build`,
        },
    };
};
