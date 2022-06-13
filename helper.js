const parser = require("node-html-parser");

// Clean link
function cleanWpLink(str) {
    return str.replace(process.env["WORDPRESS_HOST"], "").trim();
}
function extractHeadings(str) {
    let doc = parser.parse(str);
    let headings = doc.querySelectorAll("h2, h3,h4,h5,h6");

    headings = headings.map((heading) => {
        return {
            level: parseInt(heading.tagName.substring(1, 2)) - 1,
            id: heading.id,
            content: heading.textContent,
        };
    });
    return orderHeadings(headings, 0).list;
}

function orderHeadings(headings, startIndex) {
    let result = [];

    for (let i = startIndex; i < headings.length; i++) {
        let heading = headings[i];
        let next = headings[i + 1];

        if (next?.level > heading.level) {
            const { list, newIndex } = orderHeadings(headings, i + 1);
            result.push({
                ...heading,
                children: list,
            });
            i = newIndex;
        } else if (next?.level > heading.level) {
            return { children: result, newIndex: i };
        } else {
            result.push({ ...heading });
        }
    }
    return { list: result };
}

function createParamsFromObject(obj) {
    return Object.entries(obj).reduce((previousVal, [key, val]) => {
        return previousVal + `&${key}=${val}`;
    }, "");
}

module.exports = { cleanWpLink, extractHeadings, createParamsFromObject };
