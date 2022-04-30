window.addEventListener("load", function () {
  // Menu Buttons buttons
  const navButtons = document.querySelectorAll(`[data-expand-btn="true"]`);
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleMenu(button);
    });
  });

  document.addEventListener("click", (e) => {
    const expandedMenues = document.querySelectorAll(
      ".menu--expanded[data-collapse-outside='true']"
    );

    expandedMenues.forEach((modal) => {
      const buttonSelector = `button[aria-controls="${modal.id}"]`;
      if (
        !e.target.closest(`#${modal.id}`) &&
        !e.target.closest(buttonSelector)
      ) {
        toggleMenu(modal.parentNode.querySelector(buttonSelector), modal);
      }
    });
  });
});

function toggleMenu(button) {
  const menuId = button.getAttribute("aria-controls");
  const menu = document.querySelector("#" + menuId);
  const controlButtons = getControlButtons(menuId);
  console.log(button);

  if (button.getAttribute("aria-expanded") == "false") {
    controlButtons.forEach((b) => {
      b.setAttribute("aria-expanded", "true");
    });
    menu.classList.add("menu--expanded");
  } else {
    controlButtons.forEach((b) => {
      b.setAttribute("aria-expanded", "false");
    });
    menu.classList.remove("menu--expanded");
  }
}

function getControlButtons(menuId) {
  return document.querySelectorAll(
    `button[aria-controls="${menuId}"][data-expand-btn="true"]`
  );
}
