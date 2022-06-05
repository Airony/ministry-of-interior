const fetchPosts = require("./fetchPosts");

module.exports = async function () {
    data = await fetchPosts("posts", true, []);
    return data;
};
