

export function defineElement(_tag: string, _id?: string, _class?: string) {
    let element = document.createElement(_tag);
    if (_id) element.setAttribute('id', _id);
    if (_class) element.setAttribute('class', _class);
    return element;
}
