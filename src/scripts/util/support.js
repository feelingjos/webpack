String.prototype.aa = function () {
    const  parser = new DOMParser()
    const doc = parser.parseFromString(this.trim(), 'text/xml')
    return doc
}