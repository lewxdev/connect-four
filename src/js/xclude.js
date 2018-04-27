EventTarget.prototype.on = EventTarget.prototype.addEventListener;

function x(el) {
    if (el.slice(0, 1) === '#') return document.getElementById(el.slice(1));
    else if (el.slice(0, 1) === '.') return document.getElementsByClassName(el.slice(1));
    else if (el === 'body') return document.body;
    else throw new Error('Missing valid identifier for master function');
}
Element.prototype.x = (el) => {
    if (el.slice(0, 1) === '#') return document.getElementById(el.slice(1)) || getElementById(el.slice(1));
    else if (el.slice(0, 1) === '.') return document.getElementsByClassName(el.slice(1)) || getElementsByClassName(el.slice(1));
    else throw new Error('Missing valid identifier for master function');
};