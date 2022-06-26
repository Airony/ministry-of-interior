module.exports = {
    permalink: (data) => {
        return (
            data.page.filePathStem.replace("/pages", "").replace("index", "") +
            "/"
        );
    },
};
