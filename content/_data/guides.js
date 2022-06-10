const fetchPosts = require("../../fetchPosts");
const cache = require("../../cache");

module.exports = cache(fetchPosts, "guides", ["guides", false, []]);
