// Clean link
function cleanWpLink(str) {
    return str.replace(process.env["WORDPRESS_HOST"], "").trim();
}

function createParamsFromObject(obj) {
    return Object.entries(obj).reduce((previousVal, [key, val]) => {
        return previousVal + `&${key}=${val}`;
    }, "");
}

module.exports = { cleanWpLink, createParamsFromObject };
