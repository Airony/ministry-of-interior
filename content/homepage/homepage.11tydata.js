const { fetchSpecialPosts } = require("../../fetchPosts");
const cache = require("../../cache");

module.exports = async function () {
    return {
        featuredGuides: await cache(fetchSpecialPosts, "featuredGuides", [
            "featured_guides",
            ["link", "preview", "featured_img_url", "title", "date"],
        ]),
    };
};
