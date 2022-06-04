const fetch = require("node-fetch");
const parser = require("node-html-parser");

const POSTS_API_LINK =
    process.env["WORDPRESS_HOST"] +
    "wp-json/wp/v2/posts?orderby=date&order=desc";

// Get number of wp post pages
async function wpPostPages() {
    try {
        const res = await fetch(`${POSTS_API_LINK}&_fields=id&pages=1`);
        return res.headers.get("x-wp-totalpages") || 0;
    } catch (err) {
        console.log(`Wordpress API Call failed: ${err}`);
        return 0;
    }
}

// Fetch list of wp posts
async function wpPosts(page = 1) {
    try {
        const res = await fetch(`${POSTS_API_LINK}`),
            json = await res.json();
        return json
            .filter((p) => p.content.rendered && !p.content.protected)
            .map((p) => {
                return {
                    slug: p.slug,
                    date: new Date(p.date),
                    dateYMD: dateYMD(p.date),
                    dateFriendly: dateFriendly(p.date),
                    title: p.title.rendered,
                    excerpt: p.excerpt.rendered,
                    content: p.content.rendered,
                    link: cleanLink(p.link),
                    headings: extractHeadings(p.content.rendered),
                };
            });
    } catch (err) {
        console.log(`Problem fetching posts: ${err}`);
        return null;
    }
}

// pad date digits
function pad(v = "", len = 2, chr = "0") {
    return String(v).padStart(len, chr);
}

// format date as YYYY-MM-DD
function dateYMD(d) {
    d = new Date(d);
    return (
        d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())
    );
}

// format friendly date
function dateFriendly(d) {
    const toMonth = new Intl.DateTimeFormat("en", { month: "long" });
    d = new Date(d);
    return d.getDate() + " " + toMonth.format(d) + ", " + d.getFullYear();
}

// // clean WordPress strings
// function wpStringClean(str) {
//   return str.replace(/http:\/\/localhost:8001/gi, "").trim();
// }

// Clean link
function cleanLink(str) {
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

module.exports = async function () {
    const posts = [];
    const wpPagesCount = await wpPostPages();
    if (!wpPagesCount) {
        return posts;
    }

    let wpList = [];

    wpList.push(wpPosts(1));
    const all = await Promise.all(wpList);
    return all.flat();
};
