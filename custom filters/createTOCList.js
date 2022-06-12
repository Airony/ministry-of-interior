function createTOCList(headings, currentDepth = 1) {
    let result = "";
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        result += `<li class='toc__level-${currentDepth}'>
                  <a href='#${heading.id}' class='toc__item'>${heading.content}</a>`;
        if (heading.children) {
            result += `<ul>${createTOCList(
                heading.children,
                currentDepth + 1
            )}</ul>`;
        }
        result += `</li>`;
    }
    return result;
}

module.exports = createTOCList;
