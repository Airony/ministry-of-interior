const { fetchPostsByType } = require("../../fetchPosts");
const cache = require("../../cache");

module.exports = async function () {
    return await cache(fetchPostsByType, "posts", [
        "post",
        [
            "link",
            "preview",
            "featured_img_url",
            "content_rendered",
            "title",
            "name",
            "date",
            "categories",
        ],
    ]);
};
