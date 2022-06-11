const fetchPosts = require("../../../fetchPosts");
const cache = require("../../../cache");

module.exports = async function () {
    return {
        featuredGuides: await cache(fetchPosts, "featuredGuides", [
            "featured_guides",
            false,
            ["link", "preview", "featured_img_url"],
        ]),
    };
};
