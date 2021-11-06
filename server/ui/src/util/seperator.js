"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeperatorBar = void 0;
const dom_1 = require("./dom");
/**
 * Creates a movable separator bar element
 * @param id                    element's id attribute
 * @param _class                element's class attribute
 * @param direction             the direction of the bar
 * @param siblings              what the bar seperates, the bar will be inserted into them
 *                              it has to be two existing sibling elements in order.
 * @param detectRange           the detecting range for dragging in pixels
 * @param displaySize           the display size of the bar in pixels
 * @param maxOffsetUpOrLeft     the maximum offset in pixels for the bar to move up if it's
 * a horizental bar, and offset left if a vertical one.
 * @param maxOffsetDownOrRight the maximum offset in pixels for the bar to move down if it's
 * a horizental bar, and offset right if a vertical one.
 */
function createSeperatorBar(id, _class, direction, siblings, detectRange, displaySize, maxOffsetUpOrLeft, maxOffsetDownOrRight) {
    // Validating params
    if (siblings.length < 2 || siblings[0].nextSibling !== siblings[1])
        throw new Error("The seperator bar needs to be put between two sibling elements");
    if (isNaN(displaySize) || displaySize < 0 || isNaN(detectRange) || detectRange < displaySize)
        throw new Error("Invalid display size or detect range. ");
    if (isNaN(maxOffsetUpOrLeft) || maxOffsetUpOrLeft < 0 || isNaN(maxOffsetDownOrRight) || maxOffsetDownOrRight < 0)
        throw new Error("Invalid offset for separator bar");
    // create bar
    const bar = (0, dom_1.defineElement)('div', id, _class);
    if (direction === 'horizental')
        bar.style.height = displaySize + 'px';
    else
        bar.style.width = displaySize + 'px';
    // implement functionality
    let mouseDownX = 0;
    let mouseDownY = 0;
    let dragging = false;
    // the older is the one before separator bar
    const [olderSibling, youngerSibling] = siblings;
    // record the position when mouse is pressed down
    bar.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            dragging = true;
            mouseDownX = event.clientX;
            mouseDownY = event.clientY;
        }
    });
    // reset when release mouse button
    bar.addEventListener('mouseup', (event) => {
        if (event.buttons === 0) {
            dragging = false;
        }
    });
    // adjust siblings when dragging
    bar.addEventListener('mousemove', (event) => {
        if (event.button === 0) {
            if (direction === 'horizental') {
                const totalUp = mouseDownY - event.clientY;
                const totalDown = event.clientY - mouseDownY;
                if (totalUp > maxOffsetUpOrLeft && totalDown > maxOffsetDownOrRight)
                    return;
                // Adjust sibling
                olderSibling.style.height = olderSibling.offsetHeight + event.movementY + 'px';
                youngerSibling.style.height = youngerSibling.offsetHeight - event.movementY + 'px';
            }
            else {
                const totalLeft = mouseDownX - event.clientX;
                const totalRight = event.clientX - mouseDownX;
                if (totalLeft > maxOffsetUpOrLeft && totalRight > maxOffsetDownOrRight)
                    return;
                // Adjust sibling
                olderSibling.style.width = olderSibling.offsetWidth + event.movementX + 'px';
                youngerSibling.style.width = youngerSibling.offsetWidth - event.movementX + 'px';
            }
        }
    });
    // add seperator bar to DOM
    olderSibling.insertAdjacentElement('afterend', bar);
    return bar;
}
exports.createSeperatorBar = createSeperatorBar;
