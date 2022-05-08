window.addEventListener("load", () => {
  const filterInputs = document.querySelectorAll(
    'input[data-filter-input="true"]'
  );

  filterInputs.forEach((input) => {
    input.addEventListener("input", () => {
      filter(input);
    });
  });
});

function filter(input) {
  const filterTargets = document.querySelectorAll(
    `.${input.getAttribute("data-filter-target")}`
  );
  let i = 0;
  filterTargets.forEach((target) => {
    const filterField = target.querySelector(
      `.${input.getAttribute("data-filter-field")}`
    );
    if (
      input.value.length != 0 &&
      !filterField.textContent.toLowerCase().includes(input.value.toLowerCase())
    ) {
      i++;
      target.style.display = "none";
    } else {
      target.style.display = "";
    }
  });

  const onEmpty = document.querySelectorAll(
    `.${input.getAttribute("data-show-on-empty")}`
  );
  if (i == filterTargets.length) {
    onEmpty.forEach((ele) => (ele.style.display = "initial"));
  } else {
    onEmpty.forEach((ele) => (ele.style.display = ""));
  }
}
