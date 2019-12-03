

class Dom {
    constructor(){}

    /*
        将字符串对象转换成dom对象
     */
    static strCastDom(template){
        return document.createRange().createContextualFragment(template)
    }
}
export {
    Dom
}