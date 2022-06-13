const fetch = require("node-fetch");
const helper = require("./helper");

// Fetch list of wp posts
async function fetchPostsByType(
    postType,
    fields = [],
    postProcessingOpts = {}
) {
    const url =
        process.env["WORDPRESS_HOST"] +
        `?quick_fetch_data=posts&post_type=${postType}&fields=${fields.join(
            ","
        )}`;

    try {
        const res = await fetch(url),
            json = await res.json();

        return processPosts(json, postProcessingOpts);
    } catch (err) {
        console.log(`Problem fetching posts: ${err}`);
        return null;
    }
}

async function fetchSpecialPosts(
    postsIdentifer,
    fields = [],
    postProcessingOpts = {}
) {
    const url =
        process.env["WORDPRESS_HOST"] +
        `?quick_fetch_data=${postsIdentifer}&fields=${fields.join(",")}`;
    try {
        const res = await fetch(url),
            json = await res.json();

        return processPosts(json, postProcessingOpts);
    } catch (err) {
        console.log(`Problem fetching posts: ${err}`);
        return null;
    }
}

function processPosts(posts, postProcessingOpts) {
    return posts.map((p) => {
        p.link = helper.cleanWpLink(p.link);
        if (postProcessingOpts["extractHeadings"]) {
            console.log("nope");
            p.headings = helper.extractHeadings(p.content_rendered);
        }

        console.log(p);
        return p;
    });
}

module.exports = { fetchPostsByType, fetchSpecialPosts };
