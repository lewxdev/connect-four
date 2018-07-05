Element.prototype.properties = function (opt) {
    let currentHandler, errorSuffix = ' for Element DOM property: ';
    currentHandler = 'ID';
    if (typeof opt.id !== 'undefined') {
        if (typeof opt.id === 'string') {
            if (opt.id.length > 0) {
                if (isNaN(opt.id.charAt())) {
                    if (opt.id.match(/\W/g) === null) this.id = opt.id;
                    else throw new Error('String Contains Invalid Characters ' + errorSuffix + currentHandler + '.');
                } else throw new Error('First Character of String is a Number' + errorSuffix + currentHandler + '.');
            } else throw new Error('Empty String set' + errorSuffix + currentHandler + '.');
        } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
    }
    currentHandler = 'Class';
    if (typeof opt.classList !== 'undefined') {
        if (opt.classList instanceof Array) {
            for (let thisClass of opt.classList) {
                if (typeof thisClass === 'string') {
                    if (thisClass.length > 0) {
                        if (isNaN(thisClass.charAt())) {
                            this.classList.add(thisClass);
                        } else throw new Error('First Character of String is a Number' + errorSuffix + currentHandler + '.');
                    } else throw new Error('Empty String set' + errorSuffix + currentHandler + '.');
                } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
            }
        } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
    }
    currentHandler = 'Text Content';
    if (typeof opt.text !== 'undefined') {
        if (typeof opt.text === 'string') {
            if (opt.text.match(/![<>]/g) !== null)
                console.warn('Found HTML Brackets ' + errorSuffix + currentHandler + '.');
            this.textContent = opt.text;
        } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
    }
    currentHandler = 'Inner HTML';
    if (typeof opt.html !== 'undefined') {
        if (typeof opt.html === 'string') this.innerHTML = opt.html;
        else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
    }
    currentHandler = 'Insert This Element (to Adjacent...)';
    if (opt.insert instanceof Object) {
        if (opt.add instanceof Array)
            throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
        else {
            currentHandler = 'Insert This Element (to Adjacent Element)';
            if (opt.insert.elem instanceof Element) {
                currentHandler = 'Insert This Element (Position)';
                if (typeof opt.insert.pos === 'string') {
                    if (['beforebegin', 'afterbegin', 'beforeend', 'afterend'].indexOf(opt.insert.pos) !== -1) {
                        opt.insert.elem.insertAdjacentElement(opt.insert.pos, this);
                    } else throw new Error('Invalid Insert Type ' + errorSuffix + currentHandler + '.');
                } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
            } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
        }
    } else console.warn('Missing Value' + errorSuffix + currentHandler + '.');
    currentHandler = 'Add (Insert Adjacent...)';
    if (typeof opt.add !== 'undefined') {
        if (opt.add instanceof Object) {
            if (opt.add instanceof Array)
                throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
            else {
                currentHandler = 'Add Position (Insert Adjacent...)';
                if (typeof opt.add.pos === 'string') {
                    if (['beforebegin', 'afterbegin', 'beforeend', 'afterend'].indexOf(opt.add.pos) !== -1) {
                        currentHandler = 'Add Type (Insert Adjacent...)';
                        if (typeof opt.add.type === 'string') {
                            if (['elem', 'html', 'text'].indexOf(opt.add.type) !== -1) {
                                currentHandler = 'Add Type (Insert Adjacent Element)';
                                if (opt.add.type === 'elem')
                                    if (opt.add.insert instanceof Element) {
                                        this.insertAdjacentElement(opt.add.pos, opt.add.insert);
                                    } else throw new Error('Invalid Insert Type ' + errorSuffix + currentHandler + '.');
                                currentHandler = 'Add Type (Insert Adjacent HTML)';
                                if (opt.add.type === 'html')
                                    if (typeof opt.add.insert === 'string') {
                                        this.insertAdjacentHTML(opt.add.pos, opt.add.insert);
                                    } else throw new Error('Invalid Insert Type ' + errorSuffix + currentHandler + '.');
                                currentHandler = 'Add Type (Insert Adjacent Text)';
                                if (opt.add.type === 'text')
                                    if (typeof opt.add.insert === 'string') {
                                        this.insertAdjacentText(opt.add.pos, opt.add.insert);
                                    } else throw new Error('Invalid Insert Type ' + errorSuffix + currentHandler + '.');
                            } else throw new Error('Invalid Insert Type ' + errorSuffix + currentHandler + '.');
                        } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
                    } else throw new Error('Invalid Insert Position ' + errorSuffix + currentHandler + '.');
                } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
            }
        } else throw new Error('Invalid Data Type' + errorSuffix + currentHandler + '.');
    }
    return this;
}

Document.prototype.newElement = function (elem, opt) {
    let thisElem = this.createElement(elem);
    thisElem.properties(opt);
    return thisElem;
}