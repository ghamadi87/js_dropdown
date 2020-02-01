/**
 * @param {Array<Object>} objectsList the list of options to be selected from
 * @param {String} optionTitleKey the key whose value will be displayed as a title in the option
 * @param {String} placeholder text that acts as a placeholder for the dropdown box
 * @param {String} iconColor the fill color of the arrow used for the dropdown field (default is black)
 * @param {String} optionSubKey the key whose value will be displayed as a subtitle in the option (can be null)
 * @param {Function} customClickHandler a callback function that fires when the user sele
 */
function DropDown({ objectsList, optionTitleKey,
    optionSubKey = '',
    placeholder = 'Select',
    iconColor = null,
    attributes = {},
    underlinedOptions = true,
    customClickHandler = () => { }
}) {

    // Reusable content
    const OUTLINE_CLS = 'dropdown-input-outline',
        HIDDEN_CLS = 'dropdown-hidden',
        ACTIVE_CLS = 'dropdown-active',
        INPUT_CLS = 'dropdown-input',
        SELECTED_CLS = 'dropdown-selected',
        PLACEHOLDER_CLS = 'dropdown-placeholder',
        MENU_CLS = 'dropdown-menu',
        DROP_ICON_SVG = '<svg class="dropdown-arrow" viewBox="0 -5 30 37.5"><title>dropdown</title><desc>Created with Sketch.</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(7.000000, 11.000000)" fill="#000000"><path d="M14.0059397,2.26485497e-14 C15.1072288,2.26485497e-14 15.3722573,0.627746582 14.5881847,1.41182411 L8.70999225,7.29005337 C8.317902,7.68214607 7.67653023,7.6764822 7.29009898,7.29005337 L1.41183294,1.41182411 C0.632099139,0.632095183 0.894513756,2.26485497e-14 1.99406028,2.26485497e-14 L14.0059397,2.26485497e-14 Z"/></g></g></svg>';

    // Main Elements
    const placeHolderText = document.createElement("p"),
        inputField = createInput(),
        dropDownMenu = createOptions();

    //creates the dropdown component with its clickable input field and options list
    function createDropDown() {
        const wrapper = document.createElement("div");
        wrapper.classList = OUTLINE_CLS;

        wrapper.appendChild(inputField);
        wrapper.appendChild(dropDownMenu);
        return wrapper;
    }

    // Creates the clickable input field of the dropdown component
    function createInput() {
        // Creates the input outline
        const innerContainer = document.createElement("div");
        innerContainer.classList = INPUT_CLS;
        innerContainer.onclick = toggleDropdown;

        // Holds the text used as a placeholder
        placeHolderText.textContent = placeholder;
        placeHolderText.classList.add(PLACEHOLDER_CLS)

        // Appends the placeholder and chevron to the container
        innerContainer.innerHTML = DROP_ICON_SVG;
        if (iconColor) innerContainer.querySelector('svg path').style.fill = iconColor;
        innerContainer.prepend(placeHolderText);

        // Set passed attributes to the container
        for (let key in attributes)
            innerContainer.setAttribute(key, attributes[key]);

        return innerContainer;
    }

    // Creates the options list of the dropdown component
    function createOptions() {
        const container = document.createElement("div");
        container.classList.add(MENU_CLS, HIDDEN_CLS);

        //loop through the list, get the title's key and the subtitle's key from each object and append
        for (let obj of objectsList) {
            let option = document.createElement("div"),
                n = document.createElement("h4"),
                title = obj[optionTitleKey],
                sub = optionSubKey ? ' - ' + obj[optionSubKey] : null;

            option.classList.add('dropdown-option');

            n.innerText = title;
            option.appendChild(n);

            //attach default and custom event handlers
            option.addEventListener('click', () => selectOption(obj));
            option.addEventListener('click', customClickHandler);           //this may be unnecessary but keep it for now

            //style option
            if (!underlinedOptions) option.style.border = 'none';
            else if (iconColor) option.style.borderBottom = '1px solid ' + iconColor;

            //append subtitle if one exists
            if (sub) {
                let t = document.createElement("p");
                t.innerText = sub;
                option.appendChild(t);
            }

            container.appendChild(option);
        }
        return container;
    }

    //displays the selected value inside inputField, updates the attributes of the inputField, and retracts the list
    function selectOption(obj) {
        placeHolderText.textContent = obj[optionTitleKey];

        //add data attributes with the using the object's information
        for (let key in obj)
            inputField.setAttribute(`data-${key}`, obj[key]);

        inputField.classList.add(SELECTED_CLS);
        toggleDropdown();
    }

    //toggles the classes that control the visibility of the dropdown menu and the active-status of the inputField
    function toggleDropdown() {
        dropDownMenu.classList.toggle(HIDDEN_CLS);
        inputField.classList.toggle(ACTIVE_CLS);
    }

    //closes the dropdown menu if open
    function closeDropDown() {
        let menus = document.querySelectorAll(`.${MENU_CLS}`),
            inputs = document.querySelectorAll(`.${INPUT_CLS}`);
        for (let menu of menus)
            menu.classList.add(HIDDEN_CLS);

        for (let input of inputs)
            input.classList.remove(ACTIVE_CLS);
    }

    // attach event handler to close the dropdown when clicking outside
    window.onclick = () => {
        let triggers = document.querySelectorAll(`.${INPUT_CLS}, .${INPUT_CLS} *`),
            target = window.event.target,
            triggered = false;

        for (let trigger of triggers) {
            if (trigger === target) {
                triggered = true;
                break;
            }
        }
        if (!triggered) closeDropDown();
    }

    return {
        render: createDropDown
    }
};