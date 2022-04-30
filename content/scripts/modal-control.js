window.addEventListener("load", function () {
  const modals = this.document.querySelectorAll("[data-modal='true']");

  modals.forEach((modal) => {
    bindModalButtons(modal);
  });
});

function bindModalButtons(modal) {
  const buttons = document.querySelectorAll(
    `button[data-modal-btn="true"][aria-controls="${modal.id}"]`
  );
  buttons.forEach((button) => {
    console.log(button);
    button.addEventListener("click", () => {
      toggleModal(modal, buttons);
    });
  });
}

function toggleModal(modal, buttons) {
  const expanded =
    buttons[0].getAttribute("aria-expanded") == "true" ? true : false;
  if (expanded) {
    buttons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    modal.classList.remove("menu--expanded");
    if (modal.getAttribute("data-prevent-scroll") == "true") {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  } else {
    buttons.forEach((button) => button.setAttribute("aria-expanded", "true"));
    modal.classList.add("menu--expanded");
    if (modal.getAttribute("data-prevent-scroll") == "true") {
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = "fixed";
    }
  }
}
