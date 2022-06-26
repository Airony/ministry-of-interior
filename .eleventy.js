require("dotenv").config();
const createPaginationItems = require("./custom filters/createPaginationItems");
const createTOCList = require("./custom filters/createTOCList");
const formatDate = require("./custom filters/formatDate");

module.exports = (config) => {
    //   config.addWatchTarget("./content/assets/");
    config.setBrowserSyncConfig({
        files: "./build/css/**/*.css",
    });
    config.addPassthroughCopy("content/assets");
    config.addPassthroughCopy("content/scripts");

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

    return {
        dir: {
            input: "content",
            output: `build`,
        },
    };
};
