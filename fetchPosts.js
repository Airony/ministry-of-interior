const fetch = require("node-fetch");
const helper = require("./helper");

// Fetch list of wp posts
async function fetchPostsByType(
    postType,
    fields = [],
    additionalFetchOpts = {},
    postProcessingOpts = {}
) {
    let url =
        process.env["WORDPRESS_HOST"] +
        `?quick_fetch_data=posts&post_type=${postType}&fields=${fields.join(
            ","
        )}`;

    url += helper.createParamsFromObject(additionalFetchOpts);

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
    additionalFetchOpts = {},
    postProcessingOpts = {}
) {
    let url =
        process.env["WORDPRESS_HOST"] +
        `?quick_fetch_data=${postsIdentifer}&fields=${fields.join(",")}`;

    url += helper.createParamsFromObject(additionalFetchOpts);

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
            p.headings = helper.extractHeadings(p.content_rendered);
        }

        return p;
    });
}

module.exports = { fetchPostsByType, fetchSpecialPosts };
