window.addEventListener("load", function () {
  const searchToggle = document.querySelector(".main-header .search-toggle");
  const mainSearchBar = document.querySelector(".main-header .search-bar");

  searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("search-toggle--open");
    mainSearchBar.classList.toggle("search-bar--open");
  });

  // Nav buttons
  const navButtons = document.querySelectorAll(`[data-expand-btn="true"]`);
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleMenu(
        button,
        button.parentElement.querySelector(
          "#" + button.getAttribute("aria-controls")
        )
      );
    });
  });

  const burger = document.querySelector(".main-header .hamburger");
  const mainNav = document.querySelector(".main-nav");
  const navClose = document.querySelector(".main-nav__close-btn");
  const header = document.querySelector(".main-header");

  burger.addEventListener("click", () => {
    mainNav.classList.add("main-nav--open");

    mainNav.getAnimations()[0].finished.then(() => {
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = "fixed";
      //   document.body.append(mainNav);
    });
  });
  navClose.addEventListener("click", () => {
    mainNav.classList.remove("main-nav--open");
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
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

function toggleMenu(button, menu) {
  if (button.getAttribute("aria-expanded") == "false") {
    button.setAttribute("aria-expanded", "true");
    menu.classList.add("menu--expanded");
  } else {
    button.setAttribute("aria-expanded", "false");
    menu.classList.remove("menu--expanded");
  }
}
