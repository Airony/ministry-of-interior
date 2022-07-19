const { dispatchEvent, convertToSlug } = require("./_helper");

const STATE_MUNICIPALITIES = {
    algiers: ["ALGER CENTRE", "EL MADANIA", "BAB EL OUED"],
    oran: ["GDYEL", "BIR EL DJIR", "ES SENIA"],
    constantine: ["HAMMA BOUZIANE", "DIDOUCHE MOURAD", "ZIGHOUD YOUCEF"],
}; // This is just an example, should probably use a json file to handle this.

window.addEventListener("load", (event) => {
    const dependantInputs = document.querySelectorAll(
        "[data-dropdown-dependant-on]"
    );
    dependantInputs.forEach((input) => {
        const dependedOn = document.querySelector(
            "#" + input.getAttribute("data-dropdown-dependant-on")
        );
        if (dependedOn.value) {
            updateOptions(input, STATE_MUNICIPALITIES[dependedOn.value]);
            input.disabled = false;
        }
        dependedOn.addEventListener("change", (e) => {
            if (e.target.value) {
                updateOptions(input, STATE_MUNICIPALITIES[e.target.value]);
                input.disabled = false;
            }
        });
    });
});

function updateOptions(input, newOptions) {
    const currentOptions = Array.from(input.children).filter((child) => {
        return child.nodeName === "OPTION";
    });
    currentOptions.forEach((option) => {
        if (!option.hasAttribute("placeholder")) {
            input.selectedIndex = 0;
            dispatchEvent(input, "change");

            option.remove();
        }
    });

    newOptions.forEach((option) => {
        addOption(input, option);
    });
}

function addOption(input, option) {
    const optionEle = document.createElement("option");
    optionEle.value = convertToSlug(option);
    optionEle.textContent = option;
    input.append(optionEle);
}
