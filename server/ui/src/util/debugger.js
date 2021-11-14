"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = exports.initializeDebugger = void 0;
const dom_1 = require("./dom");
var debugWidget = null;
var debugOutputLines = [];
var counter = 0;
function initializeDebugger() {
    debugWidget = (0, dom_1.defineElement)('div', 'debugger-widget', 'debugger');
    debugWidget.style.cssText = 'display: inline; position: absolute; top: 0; left: 0; background-color:white; opacity:70%';
    document.body.appendChild(debugWidget);
}
exports.initializeDebugger = initializeDebugger;
function Debug(text) {
    if (!debugWidget)
        throw "Not Initialized";
    counter++;
    debugOutputLines.push(text);
    if (debugOutputLines.length > 15)
        debugOutputLines.splice(0, 1);
    let innerHtml;
    debugOutputLines.forEach((line, index) => {
        innerHtml += `<p style='margin:0; font-size:10px;'><span style='color:blue'>${counter + index}: </span>${line}</p>`;
    });
    debugWidget.innerHTML = innerHtml;
}
exports.Debug = Debug;
