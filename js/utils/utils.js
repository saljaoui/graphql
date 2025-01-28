export function createElementWithClass(type, classNames = '', textContent = '') {
    let element = document.createElement(type);
    if (classNames) element.classList.add(...classNames.split(' '));
    if (textContent) element.textContent = textContent;
    return element;
}

export function createInputBox(type, id, labelText, svgIcon) {
    const inputBox = createElementWithClass('div', 'input-box');

    const iconSpan = createElementWithClass('span', 'icon');
    iconSpan.innerHTML = svgIcon;
    inputBox.appendChild(iconSpan);

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.required = true;
    inputBox.appendChild(input);

    const label = createElementWithClass('label', '', labelText);
    inputBox.appendChild(label);

    return inputBox;
}