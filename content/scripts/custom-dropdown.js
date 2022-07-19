const {
    dispatchEvent,
    scrollToElementIfNotVisibile,
    hasAttributeNotFalse,
    createElementWithClass,
} = require("./_helper");

// Create a custom drop down to wrap a select element
// Inorder to enable, add attribute 'data-custom-dropdown' to select element.
// And add 'data-custom-dropdown-search' attribute to enable search box.

// TODO: Add support for optgroups.

const DROPDOWN_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d="M24 30 14 20.05H34Z" />
    </svg>`;
const SEARCH_ICON = `
    <svg id="search" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
    `;
const CLOSE_ICON = `<svg id="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
</svg>`;
const CLASS = "custom-dropdown";

const ARROW_UP_KEYCODE = 38;
const ARROW_DOWN_KEYCODE = 40;
const ESCAPE_KEYCODE = 27;

class CustomDropDown {
    constructor(selectElement) {
        this.selectElement = selectElement;
        this.createDropDown();

        // Update custom drop down options from original select
        this.updateDropDownOptions();

        // Observe original select for changes
        this.observeSelect();

        // Check whether to make the custom dropdown disabled
        this.toggleDisabledStatus();

        this.btn.addEventListener("click", () => {
            this.toggleDropDown();
        });
        // Focus on search input if it exists
        if (this.searchField) {
            this.searchInput.focus();

            //Close dropdown when search input loses focus
            this.searchInput.addEventListener("blur", (e) => {
                if (
                    e.relatedTarget !== this.btn &&
                    e.relatedTarget !== this.searchClearBtn
                ) {
                    this.closeDropDown();
                }
            });

            this.searchInput.addEventListener("input", (e) => {
                this.filterOptions(e.target.value);
                this.toggleSearchClearBtn(e.target.value);
            });

            this.searchClearBtn.addEventListener(
                "click",
                this.clearSearchInput.bind(this)
            );
        } else {
            //Close dropdown when button loses focus
            this.btn.addEventListener("blur", this.closeDropDown.bind(this));
        }

        this.dropDown.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                case ESCAPE_KEYCODE:
                    this.closeDropDown();
                    if (this.searchInput) {
                        this.btn.focus();
                    }
                    break;
                case ARROW_DOWN_KEYCODE:
                    this.selectNextOption();
                    break;
                case ARROW_UP_KEYCODE:
                    this.selectPreviousOption();
                    break;
            }
        });
    }

    clearSearchInput() {
        this.searchInput.value = "";
        this.toggleSearchClearBtn("");
        this.filterOptions("");
        this.searchInput.focus();
    }

    toggleSearchClearBtn(value) {
        if (value.length > 0) {
            this.searchIcon.style.display = "none";
            this.searchClearBtn.style.display = "";
        } else {
            this.searchIcon.style.display = "";
            this.searchClearBtn.style.display = "none";
        }
    }

    updateDropDownOptions() {
        let result = [];

        // Clear all old options
        Array.from(this.optionsList.children).forEach((oldOption) => {
            oldOption.remove();
        });

        const newOptions = Array.from(this.selectElement.children);

        newOptions.forEach((option, index) => {
            const newOptionEle = createElementWithClass(
                "li",
                `${CLASS}__option`
            );
            newOptionEle.role = "option";
            newOptionEle.setAttribute("value", option.value);
            newOptionEle.textContent = option.textContent;

            if (hasAttributeNotFalse(option, "hidden") !== false) {
                newOptionEle.setAttribute("hidden", "true");
            }
            if (hasAttributeNotFalse(option, "disabled")) {
                newOptionEle.setAttribute("disabled", "true");
            }

            newOptionEle.addEventListener("mousedown", () => {
                if (hasAttributeNotFalse(newOptionEle, "disabled")) {
                    return;
                }
                this.updateNativeSelection(newOptionEle);
            });

            this.optionsList.append(newOptionEle);
            result.push(newOptionEle);
        });

        this.options = result;

        if (this.selectElement.selectedIndex >= 0) {
            this.updateWrapperSelection(
                this.options[this.selectElement.selectedIndex]
            );
        } else if (this.selectedOption) {
            this.clearSelection();
        }
    }

    clearSelection() {
        this.placeholder.textContent = "";
        this.selectedOption.removeAttribute("aria-selected");
        this.selectedOption = null;
    }

    createDropDown() {
        this.dropDown = createElementWithClass("div", CLASS);

        this.btn = createElementWithClass(
            "button",
            `input-field text-input  ${CLASS}__btn`
        );
        this.btn.setAttribute("type", "button");

        if (hasAttributeNotFalse(this.selectElement, "disabled")) {
            this.btn.setAttribute("disabled", "true");
        }

        this.placeholder = createElementWithClass(
            "span",
            `${CLASS}__placeholder`
        );
        this.placeholder.textContent =
            hasAttributeNotFalse(this.selectElement, "placeholder") ||
            "Select an Option";
        this.btn.append(this.placeholder);

        this.dropDownIcon = createElementWithClass(
            "i",
            "icon custom-dropdown__arrow-icon"
        );
        this.dropDownIcon.innerHTML = DROPDOWN_ICON;
        this.btn.append(this.dropDownIcon);

        this.dropDown.append(this.btn);

        this.contents = createElementWithClass("div", `${CLASS}__content`);
        if (this.selectElement.hasAttribute("data-custom-dropdown-search")) {
            this.searchField = createElementWithClass(
                "div",
                `${CLASS}__search-field`
            );

            this.searchInput = createElementWithClass(
                "input",
                "text-input input-field"
            );
            this.searchInput["role"] = "searchbox";
            this.searchInput.tabindex = -1;
            this.searchInput.type = "text";
            this.searchInput.placeholder = "Search";
            this.searchInput.size = "1";
            this.searchField.append(this.searchInput);

            this.searchIcon = createElementWithClass(
                "i",
                `icon ${CLASS}__search-icon`
            );
            this.searchField.append(this.searchIcon);
            this.searchIcon.innerHTML = SEARCH_ICON;

            this.searchClearBtn = createElementWithClass(
                "button",
                `icon ${CLASS}__search-clear-btn`
            );
            this.searchClearBtn.innerHTML = CLOSE_ICON;
            this.searchClearBtn.setAttribute("type", "button");
            this.searchClearBtn.style.display = "none";
            this.searchField.append(this.searchClearBtn);

            this.contents.append(this.searchField);
        }

        this.optionsList = createElementWithClass("ul", `${CLASS}__options`);
        this.optionsList.style.position = "relative"; //Required for handling scrolling to options when selected
        this.optionsList["role"] = "presentation";

        this.contents.append(this.optionsList);
        this.dropDown.append(this.contents);

        // Hide old select
        this.selectElement.parentNode.replaceChild(
            this.dropDown,
            this.selectElement
        );
        this.selectElement.style.opacity = 0;
        this.selectElement.style.pointerEvents = "none";
        this.selectElement.style.position = "absolute";
        this.selectElement.style.inset = 0;
        this.selectElement.setAttribute("tabindex", "-1");
        this.dropDown.append(this.selectElement);
    }

    filterOptions(query) {
        this.options.forEach((option) => {
            if (
                !option.textContent
                    .toLowerCase()
                    .startsWith(query.toLowerCase())
            ) {
                option.style.display = "none";
            } else {
                option.style.display = "";
            }
        });
    }

    toggleDisabledStatus() {
        if (hasAttributeNotFalse(this.selectElement, "disabled")) {
            this.dropDown.setAttribute("aria-disabled", "true");
            this.btn.setAttribute("disabled", "true");
        } else {
            this.dropDown.removeAttribute("aria-disabled");
            this.btn.removeAttribute("disabled");
        }
    }

    observeSelect() {
        console.log("wtf");
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.target == this.selectElement &&
                    mutation.type == "attributes" &&
                    mutation.attributeName === "disabled"
                ) {
                    this.toggleDisabledStatus();
                } else {
                    this.updateDropDownOptions();
                }
            });
        });
        observer.observe(this.selectElement, {
            attributes: true,
            subtree: true,
            childList: true,
            characterData: true,
        });

        // Update custom drop down selection whenever the select element changes.
        this.selectElement.addEventListener("change", (e) => {
            this.updateWrapperSelection(
                this.options[this.selectElement.selectedIndex]
            );
        });
    }

    toggleDropDown() {
        if (hasAttributeNotFalse(this.dropDown, "open")) {
            this.closeDropDown();
        } else {
            this.openDropDown();
        }
    }

    closeDropDown() {
        this.dropDown.removeAttribute("open");
    }

    openDropDown() {
        this.dropDown.setAttribute("open", "true");
        if (this.searchField) {
            this.searchInput.focus();
        }
    }

    // Update original select element selected option.
    updateNativeSelection(option) {
        let index = this.options.indexOf(option);
        this.selectElement.selectedIndex = index;
        dispatchEvent(this.selectElement, "change");
    }

    // Update custom drop down selected option.
    updateWrapperSelection(newOption) {
        this.placeholder.textContent = newOption.textContent;
        this.selectedOption = newOption;
        scrollToElementIfNotVisibile(this.selectedOption);

        this.options.forEach((oldOption) => {
            oldOption.removeAttribute("aria-selected");
        });

        this.selectedOption.setAttribute("aria-selected", "true");
    }

    selectNextOption() {
        if (this.options.length == 0) {
            return;
        }
        const selectedIndex = this.options.indexOf(this.selectedOption);
        let i = selectedIndex;
        do {
            i++;
            if (i > this.options.length - 1) {
                i = 0;
            }
            const nextOption = this.options[i];

            if (i == selectedIndex) {
                return;
            }

            if (
                !(
                    hasAttributeNotFalse(nextOption, "hidden") !== false ||
                    hasAttributeNotFalse(nextOption, "disabled") !== false
                )
            ) {
                this.updateNativeSelection(nextOption);
                return;
            }
        } while (i != selectedIndex);
    }
    selectPreviousOption() {
        const selectedIndex = this.options.indexOf(this.selectedOption);
        if (selectedIndex < 0) {
            return;
        }
        let i = selectedIndex;
        do {
            i--;
            if (i < 0) {
                i = this.options.length - 1;
            }
            const previousOption = this.options[i];

            if (i == selectedIndex) {
                return;
            }

            if (
                !(
                    hasAttributeNotFalse(previousOption, "hidden") !== false ||
                    hasAttributeNotFalse(previousOption, "disabled") !== false
                )
            ) {
                this.updateNativeSelection(previousOption);
                return;
            }
        } while (i != selectedIndex);
    }
}

window.addEventListener("load", () => {
    const selectElements = document.querySelectorAll(
        "select[data-custom-dropdown]"
    );

    selectElements.forEach((selectElement) => {
        new CustomDropDown(selectElement);
    });
});
