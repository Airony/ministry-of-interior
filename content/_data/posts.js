const fetchPosts = require("../../fetchPosts");
const cache = require("../../cache");

module.exports = async function () {
    return await cache(fetchPosts, "posts", [
        "posts",
        true,
        ["link", "preview", "featured_img_url"],
    ]);
};
