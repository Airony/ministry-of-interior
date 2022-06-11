const fetch = require("node-fetch");
const helper = require("./helper");

async function fetchPosts(postName, makeHeadings, fields) {
    return await wpPosts(postName, fields, makeHeadings, 1);
}

// Fetch list of wp posts
async function wpPosts(queryName, fields, makeHeadings, p) {
    const url =
        process.env["WORDPRESS_HOST"] +
        `?quick_fetch_data=${queryName}&fields=${fields.join(",")}`;

    try {
        const res = await fetch(url),
            json = await res.json();
        return json
            .filter((p) => p.content.rendered && !p.content.protected)
            .map((p) => {
                formattedDate = new Date(p.post_date).toLocaleString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
                result = {
                    slug: p.post_name,
                    title: p.post_title,
                    excerpt: p.post_excerpt,
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
