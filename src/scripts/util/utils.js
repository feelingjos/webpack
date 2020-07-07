export function genId() {
    return Number(Math.random().toString().substr(3,10) + Date.now()).toString(36).substr(0,10)
}

String.prototype.ToDOM = function (str) {
    const  parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')
    return doc;
}

/**
 * 判空
 * @param obj
 * @returns {boolean}
 */
export function isNull(obj){

    if(typeof obj === "undefined"){
        return true
    }
    
    if(typeof obj === "string"){
        if(obj === ""){
            return true
        }
    }

    if(typeof obj === "object"){
        for ( var name in obj ) {
            return false;
        }
        return true

    }

    return false

}



