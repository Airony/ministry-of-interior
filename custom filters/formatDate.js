module.exports = (date, format) => {
    switch (format) {
        case "YMD":
            return new Date(date).toLocaleString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        case "DD/MM/YY":
            return new Date(date).toLocaleString("en-gb", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            });
        default:
            break;
    }
};
