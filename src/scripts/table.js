import './util/event'
import {genId} from './util/utils'
import {Dom} from './util/dom.js'

class TableGrid {

    constructor(el,config) {
        this.el = el;
        this.container = document.getElementById(el);
        this.columns = config.columns;
        this.data = config.data;
        this.init(el,config)
    }

    init(el,config){

        var self = this, lineheight = 10,defualt = 30 ,sort = {desc: ">",asc: "<"},
            maxline = 1 ,//绘制头部
         columns = config.columns,headerCssRules = ``,dataResult = {};

        config.columns.forEach(function(item){
            if(item.dataformat && item.dataformat.line && maxline < item.dataformat.line){
                maxline = item.dataformat.line
            }
        })

        var headerContainer = `<div class="table-header-line-column header-cell">`;

        var cellSize = 2;

        if(config.checkbox){

            cellSize += 30

            headerContainer += `<div class="checkbox-header table-header-call"/>
                <span class="iconfont checkbox-true">&#xec58;</span>
                </div>`

        }

       // var headerBody = `<div class="table-body-tabulation header-cell ">`;

        columns.forEach(function(item,index){

            var dataformat =  item.dataformat || {line:1}

            var contentLen = Math.ceil(item.text.width("hide-surplus-text").width / item.width)

            if(contentLen > dataformat.line && contentLen > maxline) {
                dataformat.line = maxline
            }else{
                dataformat.line = contentLen
            }

            headerCssRules +=  `
            .cell-header-${item.id}{
                 width: ${item.width}px;
                 text-align: ${item.align};
                 height: ${defualt + ( maxline - 1 ) * lineheight}px;
                 -webkit-line-clamp: ${dataformat.line};
                 line-height: ${(defualt + ( maxline - 1 ) * lineheight) / dataformat.line}px;
            }`

            //6 边块框
            cellSize += item.width + 6;

            headerContainer += `
            <div class="table-header-call" >
               <div class="cell-header-${item.id} hide-surplus-text" fieldindex="${index}" field="${item.id}">
               ${item.sort ? `<div class="header-sort-desc" sortfield="${item.id}"/>
                <span class="iconfont">&#xe6a1;</span>
                </div>` : ``}
                ${item.text}
               </div>
            ${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"/></div>` : ``}
            </div>
            `;

            //headerBody += `<div class="table-tabulation-cell-line cell-header-${item.id}" >${item.text}</div>`

        });
        headerContainer += `</div>`;
       // headerBody += `</div>`;

        headerCssRules = `
            .header-cell{
             width: ${cellSize}px;
             font-size: 16px;
            }
        ` + headerCssRules

        var htmlStyleElement = document.createElement('style');

        htmlStyleElement.innerHTML = headerCssRules;

        Dom.strCastDom(headerContainer,this.container)

        document.head.appendChild(htmlStyleElement)

        var sheet = htmlStyleElement.sheet || htmlStyleElement.styleSheet || {}
        var rules = sheet.cssRules || sheet.rules;

        var rulesheaders

        for(let dd = 0; dd < rules.length; dd ++ ){
            var ruleheaders = rules[dd]
            if(ruleheaders.selectorText === '.header-cell'){
                rulesheaders = ruleheaders
                break
            }
        }

        columns.forEach(function(item){

            if(item["resize"]){

                var querySelector = document.querySelector(`[resizefield=${item["id"]}]`);

                var  miniWidth = item["miniWidth"] || 100

                var ruleThat

                for(let dd = 0; dd < rules.length; dd ++ ){
                    var ruleheaders = rules[dd]
                    if(ruleheaders.selectorText === '.cell-header-'+ item.id){
                        ruleThat = ruleheaders
                        break
                    }
                }

                var mouseStart = {}
                var rightStart = {}

                function start(ev){

                    ev.stopPropagation()
                    ev.preventDefault()

                    var oEvent = ev || event

                    mouseStart.x = oEvent.clientX
                    rightStart.x = this.offsetLeft;
                    rightStart.width = this.offsetWidth;

                    rightStart.header_width = parseFloat(rulesheaders.style.width.substr(0 , rulesheaders.style.width.length - 2))

                    document.documentElement.addEventListener("mousemove",function (e) {

                        e.stopPropagation()
                        e.preventDefault()

                        var oEvent = e || event

                        var moveindex = oEvent.clientX - mouseStart.x

                        var headercell = moveindex + rightStart.x + rightStart.width

                        if(headercell < miniWidth){
                            headercell = miniWidth
                        }
                        ruleThat.style.width = headercell + 'px'

                        var headerindex = headercell + rightStart.header_width - rightStart.width  - rightStart.x

                        //容错处理
                        let faultTolerant = 6

                        rulesheaders.style.width = headerindex + faultTolerant + 'px'

                    })

                    document.documentElement.addEventListener("mouseup",function (event) {

                        event.stopPropagation()
                        event.preventDefault()

                        document.documentElement.clearEventListeners("mousemove")
                        document.documentElement.clearEventListeners("mouseup")

                        mouseStart = {}
                        rightStart = {}

                    })

                }

                querySelector.addEventListener("mousedown",start)

            }
            if(item["sort"]){

                var sortFieldDOM = document.querySelector(`[sortfield=${item.id}]`);

                sortFieldDOM.addEventListener("click",function (e) {

                    var dome = []

                    var dafasf = []

                    for (let i = 0; i < config.data.length;i ++){
                        if(typeof dataResult[i][item.id] === "number"){//内容为数字
                            dome[i] = {[i]:dataResult[i][item.id]}
                        }else {
                            dome[i] = {[i]:dataResult[i][item.id].length}
                        }
                    }

                    var descorasc = '>'

                    if(sortFieldDOM.classList.contains("desc")){
                        descorasc = '>'
                        sortFieldDOM.querySelector(".iconfont").innerHTML = '&#xe6a1;'
                        sortFieldDOM.classList.remove("desc")
                        sortFieldDOM.classList.add("asc")
                    }else{
                        descorasc = "<"
                        sortFieldDOM.querySelector(".iconfont").innerHTML = '&#xe751;'
                        sortFieldDOM.classList.add("desc")
                        sortFieldDOM.classList.remove("asc")
                    }

                    for (var i = 0; i < dome.length - 1; i++) {
                        // 内层循环,控制比较的次数，并且判断两个数的大小
                        for (var j = 0; j < dome.length - 1 - i; j++) {
                            // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
                            if ( eval(Object.values(dome[j])[0] + descorasc + Object.values(dome[j + 1])[0])) {
                                let temp = dome[j];
                                dome[j] = dome[j + 1];
                                dome[j + 1] = temp;
                            }
                        }
                    }

                    for(let i = 0 ; i < dome.length ; i ++){
                        dafasf[i] = document.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`)
                        self.container.removeChild(document.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`))
                    }

                    for (let i = 0 ; i < dafasf.length ; i ++) {
                        self.container.appendChild(dafasf[i])
                    }
                })
            }
            return true
        })

        var configItems = {}

        config.columns.forEach(function(item){
            configItems[item.id] = item
        })

        if(config.sort){
            for (var i = 0; i < config.data.length - 1; i++) {
                // 内层循环,控制比较的次数，并且判断两个数的大小
                for (var j = 0; j < config.data.length - 1 - i; j++) {
                    // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
                    if(typeof config.data[j][config.sort.field] === "number"){
                        if(eval(config.data[j][config.sort.field] + sort[config.sort.type || "desc"] + config.data[j + 1][config.sort.field])){
                            let temp = config.data[j];
                            config.data[j] = config.data[j + 1];
                            config.data[j + 1] = temp;
                        }
                    }else{
                        if(eval(config.data[j][config.sort.field].length + sort[config.sort.type || "desc"] + config.data[j + 1][config.sort.field].length)){
                            let temp = config.data[j];
                            config.data[j] = config.data[j + 1];
                            config.data[j + 1] = temp;
                        }
                    }

                }
            }
        }

        config.data.forEach(function (item,index) {

            var arr = {};

            for(var cell in item){

                var domCell =  `<div class="table-tabulation-cell-line cell-header-${cell} hide-surplus-text" >`

                if(configItems[cell].replace && typeof configItems[cell].replace === "function"){
                    domCell += typeof configItems[cell].replace(item[cell]) === "string" ? configItems[cell].replace(item[cell]) :item[cell]
                }else{
                    domCell += item[cell]
                }

                domCell += `</div>`

                Object.defineProperty(arr, cell, {
                    value: domCell,
                    writable: true // 是否可以改变
                })

            }

            var tableBodyTabulation = document.createElement("div");

            tableBodyTabulation.setAttribute("data-index",index)

            dataResult[index] = item

            tableBodyTabulation.classList.add("table-body-tabulation")
            tableBodyTabulation.classList.add("header-cell")

            for (let configItemsKey in configItems) {
                if(arr[configItemsKey]){
                    Dom.strCastDom(arr[configItemsKey],tableBodyTabulation)
                }else{
                    let domCell =  `<div class="table-tabulation-cell-line cell-header-${configItemsKey} hide-surplus-text" >
                    </div>`
                    Dom.strCastDom(domCell,tableBodyTabulation)
                }
            }
            
            self.container.appendChild(tableBodyTabulation)

        });

    }

    teset(){

        //console.log(defineProperty[ddd]);


        //console.log( new AesUtil())

        //console.log(Dom.strCastNative(doms));


        //获取domBody
        /*var getDomBody = new RegExp("^(\s*<\s*\/?\s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)|\s*(<\s*\/?\s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)$","g")

        var getDomContent = new RegExp("^(s*<s*!/?s*[a-zA-z_]([^>]*?[\"][^\"]*[\"])*[^>\"]*>)","g")

        var getdomName = new RegExp("(?<=<)\\s*.*?(?=\\s.*?\\W)","g")

        //获取dom属性上下文
        var getDomAttr = new RegExp("\\s.*[^>]","g");

        var getAttrContent = new RegExp("[a-zA-Z]*\\s*=\\s*\".*?\"","g")

        var dombody = doms.trim().replace(getDomBody,"")

        var headercontent = doms.trim().match(getDomContent)[0]

        var dom = headercontent.match(getdomName)[0];

        //容器
        var domContainer = document.createElement(dom.trim());

        var domAttrContent = headercontent.match(getDomAttr)[0];

        var attrs = domAttrContent.match(getAttrContent)

        for (let i = 0;i < attrs.length;i ++){

            let attrVal = attrs[i].split("=")

            domContainer.setAttribute(attrVal[0],attrVal[1].replace(/\"/g,""))

        }

        domContainer.innerHTML = dombody

        return domContainer*/

    }


}


export {
    TableGrid
}
