

class Dom {
    constructor(){}

    /*
        将字符串对象转换成dom对象
     */
    static strCastDom(template){
        /*if(DocumentFragment){
            return document.createRange().createContextualFragment(template).firstChild
        }*/
        return Dom.strCastNative(template)
    }

    static strCastNative(template){

        //获取domBody
        var getDomBody = new RegExp("^(\s*<\s*\/?\s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)|\s*(<\s*\/?\s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)$","g")

        var getDomContent = new RegExp("^(s*<s*/?s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)","g")

        var getdomName = /(?<=<)\s*.*?(?=>*\s*?\W)/

        //获取dom属性上下文
        var getDomAttr = new RegExp("\\s.*[^>]","g");

        var getAttrContent = new RegExp("[a-zA-Z]*\\s*=\\s*\".*?\"","g")

        var dombody = template.trim().replace(getDomBody,"")

        var headercontent = template.trim().match(getDomContent)[0]

        var dom = headercontent.match(getdomName)[0]

        //容器
        var domContainer = document.createElement(dom.trim());

        var domAttrContent = headercontent.match(getDomAttr);

        if(domAttrContent && domAttrContent.length > 0){
            var attrs = domAttrContent[0].match(getAttrContent)
            for (let i = 0;i < attrs.length;i ++){
                let attrVal = attrs[i].split("=")
                domContainer.setAttribute(attrVal[0],attrVal[1].replace(/\"/g,""))
            }
        }

        domContainer.innerHTML = dombody

        return domContainer

    }
}
export {
    Dom
}