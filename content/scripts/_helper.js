function dispatchEvent(element, eventName) {
    let event;
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

function scrollToElementIfNotVisibile(element) {
    const parent = element.parentNode;

    const parentHeight = parent.offsetHeight;
    const parentScroll = parent.scrollTop;
    const elementoffsetTop = element.offsetTop;
    const elementoffsetBottom = element.offsetTop + element.offsetHeight;

    if (parentScroll > elementoffsetTop) {
        parent.scrollTop = element.offsetTop;
    } else if (elementoffsetBottom > parentHeight + parentScroll) {
        parent.scrollTop = elementoffsetBottom - parentHeight;
    }
}

function hasAttributeNotFalse(element, attributeName) {
    return (
        element.hasAttribute(attributeName) &&
        element.getAttribute(attributeName) !== false
    );
}

function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

export default {
    dispatchEvent,
    convertToSlug,
    scrollToElementIfNotVisibile,
    hasAttributeNotFalse,
    createElementWithClass,
};
