export function genId() {
    return Number(Math.random().toString().substr(3,10) + Date.now()).toString(36).substr(0,10)
}

Document.prototype.ToDOM = function (str) {
    const  parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')
    return doc;
}



