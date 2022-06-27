window.addEventListener("load", function () {
    const modals = this.document.querySelectorAll("[data-modal='true']");

    modals.forEach((modal) => {
        const modalControls = document.querySelectorAll(
            `button[data-modal-btn="true"][aria-controls="${modal.id}"]`
        );
        console.log(modalControls);
        bindModalButtons(modal, modalControls);
        if (modal.dataset.preventScroll == "true") {
            observeModalCollapseState(modal, modalControls);
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

function toggleModal(modal, controls) {
    const expanded =
        controls[0].getAttribute("aria-expanded") == "true" ? true : false;
    if (expanded) {
        closeModal(modal, controls);
    } else {
        openModal(modal, controls);
    }
}

function closeModal(modal, controls) {
    controls.forEach((button) => button.setAttribute("aria-expanded", "false"));
    modal.classList.remove("menu--expanded");
    if (modal.getAttribute("data-prevent-scroll") == "true") {
        unlockScroll();
    }
}

function openModal(modal, controls) {
    controls.forEach((button) => button.setAttribute("aria-expanded", "true"));
    modal.classList.add("menu--expanded");
    if (modal.getAttribute("data-prevent-scroll") == "true") {
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

function observeModalCollapseState(modal, controls) {
    const resizeObserver = new ResizeObserver(() => {
        const collapsed =
            getComputedStyle(modal).getPropertyValue("--collapsed");
        if (collapsed !== true && modal.classList.contains("menu--expanded")) {
            closeModal(modal, controls);
        }
    });
    resizeObserver.observe(modal);
}
