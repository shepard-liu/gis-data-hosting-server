import { defineElement } from "./dom";

var debugWidget: HTMLElement = null;
var debugOutputLines: string[] = [];
var counter = 0;

export function initializeDebugger() {
    debugWidget = defineElement('div', 'debugger-widget', 'debugger');
    debugWidget.style.cssText = 'display: inline; position: absolute; top: 0; left: 0; background-color:white; opacity:70%';
    document.body.appendChild(debugWidget);
}

export function Debug(text: string) {
    if (!debugWidget) throw "Not Initialized";
    counter++;

    debugOutputLines.push(text);
    if (debugOutputLines.length > 15)
        debugOutputLines.splice(0, 1);

    let innerHtml: string;

    debugOutputLines.forEach((line, index) => {
        innerHtml += `<p style='margin:0; font-size:10px;'><span style='color:blue'>${counter + index}: </span>${line}</p>`;
    })
    debugWidget.innerHTML = innerHtml;
}