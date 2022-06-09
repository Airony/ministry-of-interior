require("dotenv").config();
const createPaginationItems = require("./custom filters/createPaginationItems");

module.exports = (config) => {
    //   config.addWatchTarget("./content/assets/");
    config.setBrowserSyncConfig({
        files: "./build/css/**/*.css",
    });
    config.addPassthroughCopy("content/assets");
    config.addPassthroughCopy("content/scripts");

    config.addFilter("myfilter", (headings) => {
        return constructList(headings, 1);
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

function constructList(headings, currentDepth) {
    let result = "";
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        result += `<li class='toc__level-${currentDepth}'>
                  <a href='#${heading.id}' class='toc__item'>${heading.content}</a>`;
        if (heading.children) {
            result += `<ul>${constructList(
                heading.children,
                currentDepth + 1
            )}</ul>`;
        }
        result += `</li>`;
    }
    return result;
}
