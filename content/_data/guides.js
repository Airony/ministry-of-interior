const fetchPosts = require("../../fetchPosts");

module.exports = async function () {
    data = await fetchPosts("guides", false, []);
    return data;
};
