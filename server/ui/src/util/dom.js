"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineElement = void 0;
function defineElement(_tag, _id, _class) {
    let element = document.createElement(_tag);
    if (_id)
        element.setAttribute('id', _id);
    if (_class)
        element.setAttribute('class', _class);
    return element;
}
exports.defineElement = defineElement;
