

class Dom {
    constructor(){}

    /*
        将字符串对象转换成dom对象
     */
    static strCastDom(template){
        if(DocumentFragment){
            return document.createRange().createContextualFragment(template).firstChild
        }
        return document.createRange().createContextualFragment(template).firstChild
    }
}
export {
    Dom
}