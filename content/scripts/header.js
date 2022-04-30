// window.addEventListener("load", function () {
//   const mainNav = document.querySelector(".main-nav");

//   //Search bar
//   const searchToggle = document.querySelector(".main-header .search-toggle");
//   const mainSearchBar = document.querySelector(".main-header .search-bar");

//   searchToggle.addEventListener("click", () => {
//     searchToggle.classList.toggle("search-toggle--open");
//     mainSearchBar.classList.toggle("search-bar--open");
//   });

//   // Nav buttons
//   const navButtons = document.querySelectorAll(`[data-expand-btn="true"]`);
//   navButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       toggleMenu(button);
//     });
//   });

//   const burger = document.querySelector(".main-header .hamburger");
//   const navClose = document.querySelector(".main-nav__close-btn");

//   [burger, navClose].forEach((ele) => {
//     ele.addEventListener("click", () => {
//       toggleNav(mainNav);
//     });
//   });
// });

// function toggleMenu(button) {
//   const menuId = button.getAttribute("aria-controls");
//   const menu = document.querySelector("#" + menuId);
//   const controlButtons = getControlButtons(menuId);

//   if (button.getAttribute("aria-expanded") == "false") {
//     controlButtons.forEach((b) => {
//       b.setAttribute("aria-expanded", "true");
//     });
//     menu.classList.add("menu--expanded");
//   } else {
//     controlButtons.forEach((b) => {
//       b.setAttribute("aria-expanded", "false");
//     });
//     menu.classList.remove("menu--expanded");
//   }
// }

// function toggleNav(mainNav) {
//   if (mainNav.classList.contains("menu--expanded")) {
//     closeNav(mainNav);
//   } else {
//     openNav(mainNav);
//   }
// }

// function closeNav(mainNav) {
//   const buttons = document.querySelectorAll(
//     `button[aria-controls="${mainNav.id}"]`
//   );
//   buttons.forEach((button) => button.setAttribute("aria-expanded", "false"));
//   mainNav.classList.remove("menu--expanded");
// }

// function openNav(mainNav) {
//   const buttons = document.querySelectorAll(
//     `button[aria-controls="${mainNav.id}"]`
//   );
//   buttons.forEach((button) => button.setAttribute("aria-expanded", "true"));
//   mainNav.classList.add("menu--expanded");
// }

// function getControlButtons(menuId) {
//   return document.querySelectorAll(
//     `button[aria-controls="${menuId}"][data-expand-btn="true"]`
//   );
// }

// // function observeNav(mainNav) {
// //   const resizeObserver = new ResizeObserver(() => {
// //     const hidden = getComputedStyle(mainNav).getPropertyValue("--hidden");
// //     console.log("resized");
// //     if (hidden == "false") {
// //       closeNav(mainNav);
// //     }
// //   });
// //   resizeObserver.observe(mainNav);
// // }
