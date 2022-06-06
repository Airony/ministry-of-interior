const fetch = require("node-fetch");
const helper = require("../../helper");

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
                    link: helper.cleanWpLink(p.link),
                    formattedDate: formattedDate,
                    featuredImgUrl: p["featured_img_url"],
                    preview: p.preview,
                };

                if (makeHeadings) {
                    result.headings = helper.extractHeadings(
                        p.content.rendered
                    );
                }

                return result;
            });
    } catch (err) {
        console.log(`Problem fetching posts: ${err}`);
        return null;
    }
}

module.exports = fetchPosts;
