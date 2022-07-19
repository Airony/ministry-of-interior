const STATE_MUNICIPALITIES = {
    algiers: ["ALGER CENTRE", "EL MADANIA", "BAB EL OUED"],
    oran: ["GDYEL", "BIR EL DJIR", "ES SENIA"],
    constantine: ["HAMMA BOUZIANE", "DIDOUCHE MOURAD", "ZIGHOUD YOUCEF"],
}; // This is just an example, should probably use a json file to handle this.
//
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
    currentOptions.forEach((option, index) => {
        if (!option.hasAttribute("hidden")) {
            option.remove();
        } else {
            option.selected = true;
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

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}
