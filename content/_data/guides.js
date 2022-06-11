const fetchPosts = require("../../fetchPosts");
const cache = require("../../cache");

module.exports = async function () {
    return await cache(fetchPosts, "guides", [
        "guides",
        false,
        ["link", "preview", "featured_img_url"],
    ]);
};
