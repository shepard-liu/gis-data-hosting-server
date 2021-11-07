
import { defineElement } from "./dom";

/**
 * Creates a movable separator bar element
 * 
 * @param id                    element's id attribute
 * @param _class                element's class attribute
 * @param direction             the direction of the bar
 * @param siblings              what the bar seperates, the bar will be inserted into them
 *                              it has to be two existing sibling elements in order.
 * 
 * @param minPositionPercentage the highest or leftest position in percent. position percentage
 *                              is determined by the sum of the siblings' horizental/vertical size
 * @param maxPositionPercentage the lowest or rightest position in percent. position percentage
 *                              is determined by the sum of the siblings' horizental/vertical size
 * @param displaySize           the display size of the bar in pixels
 */
export function createSeperatorBar(
    id: string,
    _class: string,
    direction: 'horizental' | 'vertical',
    siblings: HTMLElement[],
    minPositionPercentage?: number,
    maxPositionPercentage?: number,
    displaySize?: number,
    //detectRange?: number,
): HTMLElement {

    // Validating params
    if (siblings.length < 2 || siblings[0].nextSibling !== siblings[1])
        throw new Error("The seperator bar needs to be put between two sibling elements");
    if (displaySize !== undefined && (isNaN(displaySize) || displaySize < 0))
        throw new Error("Invalid display size or detect range. ");
    if (isNaN(minPositionPercentage) || minPositionPercentage < 0 || minPositionPercentage > 100 ||
        isNaN(maxPositionPercentage) || maxPositionPercentage < 0 || maxPositionPercentage > 100)
        throw new Error("Invalid offset for separator bar");

    // the older is the one before separator bar
    const [olderSibling, youngerSibling] = siblings;

    // create bar and inner styling element
    const bar = defineElement('div', id, _class);
    const hint = defineElement('div', id + '-hint', _class + '-hint');

    // setting display size
    if (displaySize !== undefined) {
        if (direction === 'horizental') {
            bar.style.height = displaySize - 1 + 'px';
            // eats oldersibling's height
            olderSibling.style.height = olderSibling.offsetHeight - displaySize + 'px';
        }
        else {
            bar.style.width = displaySize + 'px';
            // eats oldersibling's height
            olderSibling.style.width = olderSibling.offsetWidth - displaySize + 'px';
        }
    }
    // // setting detect range
    // if (detectRange !== undefined) {
    //     const compensation = (detectRange - displaySize) / 2.0;
    //     if (direction === 'horizental') {
    //         bar.style.marginTop = - compensation + 'px';
    //         bar.style.marginBottom = - compensation + 'px';
    //         bar.style.paddingTop = compensation + 'px';
    //         bar.style.paddingBottom = compensation + 'px';
    //     } else {
    //         bar.style.marginLeft = - compensation + 'px';
    //         bar.style.marginRight = - compensation + 'px';
    //         bar.style.paddingLeft = compensation + 'px';
    //         bar.style.paddingRight = compensation + 'px';
    //     }
    // }


    // implement functionality
    let mouseDownX: number = 0;
    let mouseDownY: number = 0;
    let dragging: boolean = false;
    // record the original size the three elements combined
    let originalHeight: number = olderSibling.offsetHeight + youngerSibling.offsetHeight;
    let originalWidth: number = olderSibling.offsetWidth + youngerSibling.offsetWidth;

    // record the position when mouse is pressed down
    bar.addEventListener('mousedown', (event: MouseEvent) => {
        console.log(event.button);
        if (event.button === 0) {
            dragging = true;
            mouseDownX = event.clientX;
            mouseDownY = event.clientY;
            mouseMoveTotalY = mouseMoveTotalX = 0;

            console.log('Mouse down at:(', mouseDownX, mouseDownY, ')');
        }
    });

    // Testing
    let mouseUpX = 0, mouseUpY = 0;
    let mouseMoveTotalX = 0, mouseMoveTotalY = 0;
    // reset when release mouse button
    document.body.addEventListener('mouseup', (event: MouseEvent) => {
        if (event.buttons === 0) {
            console.log(dragging);
            dragging = false;
            mouseUpX = event.clientX;
            mouseUpY = event.clientY;
            console.log('Mouse Up at:(', mouseUpX, mouseUpY + ')');
            console.log('ToTAL movement:(', mouseMoveTotalX, mouseMoveTotalY, ')');
            console.log('Calculated movement:(', mouseUpX - mouseDownX, mouseUpY - mouseDownY, ')');
            mouseMoveTotalX = mouseMoveTotalY = 0;

        } else {
            event.stopImmediatePropagation();
        }
    })

    // reset when mouse go out of document body
    document.body.addEventListener('mouseleave', (event: MouseEvent) => {
        dragging = false;
        event.stopImmediatePropagation();
    })

    // adjust siblings when dragging
    document.body.addEventListener('mousemove', (event: MouseEvent) => {
        if (event.button === 0 && dragging) {
            mouseMoveTotalX += event.movementX;
            mouseMoveTotalY += event.movementY;
            console.log('Moving:(', event.movementX, event.movementY + ')');
            if (direction === 'horizental') {
                const positionPercentage = olderSibling.offsetHeight / (olderSibling.offsetHeight + youngerSibling.offsetHeight) * 100;
                if ((positionPercentage <= minPositionPercentage && event.movementY < 0) ||
                    (positionPercentage >= maxPositionPercentage && event.movementY > 0))
                    return;

                // Adjust sibling
                let newOlderHeight = olderSibling.offsetHeight + event.movementY;
                olderSibling.style.height = newOlderHeight + 'px';
                youngerSibling.style.height = originalHeight - newOlderHeight + 'px';

                // In case that it crosses the max/min position
                if (positionPercentage < minPositionPercentage) {
                    olderSibling.style.height = minPositionPercentage + 1 + '%';
                    youngerSibling.style.height = (100 - minPositionPercentage) + '%';
                } else if (positionPercentage > maxPositionPercentage) {
                    olderSibling.style.height = maxPositionPercentage - 1 + '%';
                    youngerSibling.style.height = (100 - maxPositionPercentage) + '%';
                }

            } else {
                const positionPercentage = olderSibling.offsetWidth / (olderSibling.offsetWidth + youngerSibling.offsetWidth) * 100;
                if ((positionPercentage <= minPositionPercentage && event.movementX < 0) ||
                    (positionPercentage >= maxPositionPercentage && event.movementX > 0))
                    return;

                // Adjust sibling
                let newOlderWidth = olderSibling.offsetWidth + event.movementX;
                olderSibling.style.width = newOlderWidth + 'px';
                youngerSibling.style.width = originalWidth - newOlderWidth + 'px';

                // In case that it crosses the max/min position
                if (positionPercentage < minPositionPercentage) {
                    olderSibling.style.width = minPositionPercentage + 1 + '%';
                    youngerSibling.style.width = (100 - minPositionPercentage) + '%';
                } else if (positionPercentage > maxPositionPercentage) {
                    olderSibling.style.width = maxPositionPercentage - 1 + '%';
                    youngerSibling.style.width = (100 - maxPositionPercentage) + '%';
                }
            }
            event.stopImmediatePropagation();
        }
    })

    // add seperator bar to DOM
    olderSibling.insertAdjacentElement('afterend', bar);
    bar.appendChild(hint);
    return bar;
}

/**
 * Change the current postion of the seperator bar
 * @param position in percentage. must be between the min and max point
 *                 defined when creating the bar
 */
export function moveSeperatorBar(position: number) {
    
}