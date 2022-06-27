const stickyModals = [];

window.addEventListener("load", function () {
    const modals = this.document.querySelectorAll("[data-modal='true']");

    modals.forEach((modal) => {
        const modalControls = document.querySelectorAll(
            `button[data-modal-btn="true"][aria-controls="${modal.id}"]`
        );
        bindModalButtons(modal, modalControls);
        if (modal.dataset.preventScroll == "true") {
            stickyModals.push({ ele: modal, expanded: false });
        }
    });
});

function bindModalButtons(modal, controls) {
    controls.forEach((button) => {
        button.addEventListener("click", () => {
            toggleModal(modal, controls);
        });
    });
}

function toggleModal(modalEle, controls) {
    const expanded =
        controls[0].getAttribute("aria-expanded") == "true" ? true : false;
    if (expanded) {
        closeModal(modalEle, controls);
    } else {
        openModal(modalEle, controls);
    }
}

function closeModal(modalEle, controls) {
    controls.forEach((button) => button.setAttribute("aria-expanded", "false"));
    modalEle.classList.remove("menu--expanded");
    if (modalEle.getAttribute("data-prevent-scroll") == "true") {
        stickyModals.find((modal) => modal.ele == modalEle).expanded = false;
        updateScroll();
    }
}

function openModal(modalEle, controls) {
    controls.forEach((button) => button.setAttribute("aria-expanded", "true"));
    modalEle.classList.add("menu--expanded");
    if (modalEle.getAttribute("data-prevent-scroll") == "true") {
        stickyModals.find((modal) => modal.ele == modalEle).expanded = true;
        updateScroll();
    }
}

function updateScroll() {
    if (stickyModals.every((modal) => modal.expanded == false)) {
        unlockScroll();
    } else {
        lockScroll();
    }
}

function lockScroll() {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
}

function unlockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
}

window.onresize = () => {
    stickyModals.forEach((modal) => {
        const collapsed = getComputedStyle(modal.ele)
            .getPropertyValue("--collapsed")
            .trim();

        if (collapsed != "true" && modal.expanded) {
            closeModal(
                modal.ele,
                document.querySelectorAll(
                    `button[data-modal-btn="true"][aria-controls="${modal.ele.id}"]`
                )
            );
        }
    });
};
