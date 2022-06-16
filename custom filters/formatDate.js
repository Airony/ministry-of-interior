module.exports = (date, format) => {
    switch (format) {
        case "YMD":
            return new Date(date).toLocaleString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });

        default:
            break;
    }
};
