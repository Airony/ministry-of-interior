const fetch = require("node-fetch");
const helper = require("../../../helper");
const FEATURED_GUIDES_API_LINK =
    process.env["WORDPRESS_HOST"] + "wp-json/homepage-settings/featured-guides";

async function getFeaturedGuides() {
    try {
        const res = await fetch(`${FEATURED_GUIDES_API_LINK}`),
            json = await res.json();
        return json.map((guide) => {
            return {
                title: guide.post_title,
                content: guide.no_tag_content.substring(0, 80).trim() + "...",
                image: guide.thumbnail,
                link: helper.cleanWpLink(guide.link),
            };
        });
    } catch (err) {
        console.log("Fetching featured guides failed: " + err);
        return 0;
    }
}
module.exports = async function () {
    return { featuredGuides: await getFeaturedGuides() };
};
