function createPaginationItems(
    paginationData,
    displayCount = 10,
    collapsedDisplayCount = 6
) {
    const pageCount = paginationData.pages.length;
    const currentPage = paginationData.pageNumber + 1; // Page numbers are 0 indexed.

    const nextPagesCount = pageCount - currentPage;
    const previousPagesCount = currentPage - 1;

    // Get which page range we should create items for.
    const [startIndex, endIndex] = getIndices(
        currentPage,
        pageCount,
        nextPagesCount,
        previousPagesCount,
        displayCount
    );

    // Get which a minimized page range for smaller screen sizes.
    const [collapseStartIndex, collapseEndIndex] = getIndices(
        currentPage,
        pageCount,
        nextPagesCount,
        previousPagesCount,
        collapsedDisplayCount
    );

    result = "";
    for (let i = startIndex; i <= endIndex; i++) {
        let className = `pagination-menu__item pagination-menu__page-number`;
        let link = paginationData.hrefs[i - 1];
        let ariaCurrent = "";
        let label = "";
        if (i == currentPage) {
            ariaCurrent = "aria-current=page";
            label = `Current page, page ${i}`;
        } else {
            label = `Go to page ${i}`;
        }

        if (i < collapseStartIndex || i > collapseEndIndex) {
            className += " pagination-menu__item--hidden";
        }

        result += `<li class='${className}' ${ariaCurrent} + aria-label="${label}" ><a href="${link}" >${i}</a></li>`;
    }
    return result;
}

function getIndices(
    currentPage,
    pageCount,
    nextPagesCount,
    previousPagesCount,
    displayCount
) {
    const nextTargetCount = Math.floor((displayCount - 1) / 2); // How many pages after the current page we want to display
    const previousTargetCount = Math.ceil((displayCount - 1) / 2); // How many pages before the current page we want to display

    // How many pages we can actually display (by settings the next/previou pages count as the maximum)
    const maxNext = Math.min(nextPagesCount, nextTargetCount);
    const maxPrevious = Math.min(previousPagesCount, previousTargetCount);

    // How many pages of our target are remaining (when we cant display as many as our target count)
    const remainingNext = nextTargetCount - maxNext;
    const remainingPrevious = previousTargetCount - maxPrevious;
    return [
        // Add the remaining pages count to the other side while making sure we don't start/end at a page that doesnt exist
        Math.max(0, currentPage - maxPrevious - remainingNext), // start index
        Math.min(pageCount, currentPage + maxNext + remainingPrevious), // end index
    ];
}

module.exports = createPaginationItems;
