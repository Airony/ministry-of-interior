function dispatchEvent(element, eventName) {
    let event;
    console.log("dispatching event");
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
        event.eventName = eventName;
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventName = eventName;
        event.eventType = eventName;
        element.fireEvent("on" + event.eventType, event);
    }
}

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

module.exports = {
    dispatchEvent,
    convertToSlug,
};
