const fetch = require("node-fetch");
const parser = require("node-html-parser");

async function fetchPosts(postName, makeHeadings, fields) {
    const posts = [];
    const wpPagesCount = await wpPostPages(postName);
    if (!wpPagesCount) {
        return posts;
    }

    let wpList = [];

    wpList.push(wpPosts(postName, fields, makeHeadings, 1));
    const all = await Promise.all(wpList);
    return all.flat();
}

// Get number of wp post pages
async function wpPostPages(postName) {
    const url =
        process.env["WORDPRESS_HOST"] +
        `wp-json/wp/v2/${postName}?orderby=date&order=desc&_fields=id&pages=1`;

    try {
        const res = await fetch(url);
        return res.headers.get("x-wp-totalpages") || 0;
    } catch (err) {
        console.log(`Wordpress API Call failed: ${err}`);
        return 0;
    }
}

// Fetch list of wp posts
async function wpPosts(postName, fields, makeHeadings, page = 1) {
    const url =
        process.env["WORDPRESS_HOST"] +
        `wp-json/wp/v2/${postName}?orderby=date&order=desc&_fields=${fields.join(
            ","
        )}&pages=1`;

    try {
        const res = await fetch(url),
            json = await res.json();
        return json
            .filter((p) => p.content.rendered && !p.content.protected)
            .map((p) => {
                formattedDate = new Date(p.date).toLocaleString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
                result = {
                    slug: p.slug,
                    title: p.title.rendered,
                    excerpt: p.excerpt.rendered,
                    content: p.content.rendered,
                    link: cleanLink(p.link),
                    formattedDate: formattedDate,
                    featuredImgUrl: p["featured_img_url"],
                };

                if (makeHeadings) {
                    result.headings = extractHeadings(p.content.rendered);
                }
                return result;
            });
    } catch (err) {
        console.log(`Problem fetching posts: ${err}`);
        return null;
    }
}

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

module.exports = fetchPosts;
