// window.addEventListener("load", () => {
//   const tos = document.querySelector(".table-of-contents");
//   const topHeader = document.querySelector(".upper-header");
//   const mainHeader = document.querySelector(".main-header");

//   let observer = new IntersectionObserver(
//     (entries) => {
//       if (entries[0].intersectionRatio == 0) {
//         console.log("bye");
//         const yOffset = mainHeader.getBoundingClientRect().bottom;
//         tos.style["margin-top"] = `${yOffset}px`;
//         tos.style["margin-top"] = `${yOffset}px`;
//       }
//     },
//     {
//       rootMargin: "0px",
//       threshold: 0,
//     }
//   );
//   const yOffset = mainHeader.getBoundingClientRect().bottom;
//   tos.style["margin-top"] = `${yOffset}px`;
//   observer.observe(topHeader);
// });
