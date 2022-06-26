const parser = require("node-html-parser");

function createTOCList(content) {
    let headings = extractHeadings(content);
    return generateMarkup(headings);
}

function generateMarkup(headings, currentDepth = 1) {
    let result = "";
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        result += `<li class='toc__level-${currentDepth}'>
                  <a href='#${heading.id}' class='toc__item'>${heading.content}</a>`;
        if (heading.children) {
            result += `<ul>${generateMarkup(
                heading.children,
                currentDepth + 1
            )}</ul>`;
        }
        result += `</li>`;
    }
    return result;
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

module.exports = createTOCList;
