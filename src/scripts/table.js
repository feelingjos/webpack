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

        var self = this,sort = {desc: ">",asc: "<"}, //绘制头部
         columns = config.columns,headerCssRules = ``,dataResult = {},maxValue = {1:"null"}
            ,LengthMap = {header:{}},linemodel = config.linemodel || "one" ;

        var headerWidth = {}

        var dataLength = {}

        if("auto" === linemodel){
            columns.forEach(function(item){
                headerWidth[item.id] = item.width
                LengthMap.header[[item.id]] = {
                    heightLength:item.text.width("hide-surplus-text,horizontally",`width:${item.width}px`).height,
                    heightAbsolute:true,
                    heightRelative:false,
                }
                if(item.text.width("hide-surplus-text,horizontally",`width:${item.width}px`).height > Object.keys(maxValue)[0]){
                    maxValue = {}
                    maxValue[item.text.width("hide-surplus-text,horizontally",`width:${item.width}px`).height] = item.id
                }
            })
            LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute
            LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
        }

        var headerContainer = `<div class="table-header-line-column header-cell 
                ${linemodel === "auto" ? `heightRelative` : ``}">`;

        var cellSize = 2;

        if(config.checkbox){

            //cellSize += 30

            /*headerContainer += `<div class="checkbox-header table-header-call"/>
                <span class="iconfont checkbox-true">&#xec58;</span>
                </div>`*/

        }

        var leftScale = 2

        columns.forEach(function(item,index){

            headerCssRules += `
                .cell-header-${item.id}{
                    width: ${item.width}px;
                    text-align: ${item.align};
                    ${linemodel === "one" ? 
                    `` : `box-sizing: border-box; 
                    height: 100%;
                    left: ${leftScale}px;`}
                }
            `

            //6 边块框
            cellSize += item.width + 2;
            leftScale += item.width;

            if(item.sort){
                //cellSize += 24
                //leftScale += 24
            }

            headerContainer += `
            <div class="table-header-call ${linemodel === "one" ? `heightRelative`:``}" >
            ${linemodel === "one" ? `${item.sort ? `<div class="header-sort-desc iconjiangxu iconfont one-line-fixed-height" 
               sortfield="${item.id}" title="sort-${item.id}"/></div>` : ``}
                    <div class="cell-header-${item.id} hide-surplus-text space-nowrap one-line-fixed-height" fieldindex="${index}" field="${item.id}">
               ` : `
                  <div class="cell-header-${item.id}
                            ${LengthMap.header[item.id].heightRelative ? `heightRelative` : `heightAbsolute`}
                                  hide-surplus-text word-break-all horizontally" fieldindex="${index}" field="${item.id}">
                            ${item.sort ? `<div class="header-sort-desc iconjiangxu iconfont one-sort-sign" sortfield="${item.id}" title="sort-${item.id}"/></div>`:``}  
               `}
                ${item.text}
                ${linemodel === "auto" ? `${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"></div>` : ``}`:``}
            </div>  
            ${linemodel === "one" ? `${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"></div>` : ``}`:``}
            </div>
            `;

        });

        headerContainer += `</div>`;

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

                    if(linemodel === "auto"){
                        var leftMapValue = {}

                        var valve = false

                        var itemQueue = []

                        for (let columnsKey in columns) {
                            if(valve){
                                itemQueue.push(".cell-header-" + columns[columnsKey].id)
                            }
                            if(columns[columnsKey].id === item.id){
                                valve = true
                            }
                        }

                        for(let dd = 0; dd < rules.length; dd ++ ){
                            let ruleheaders = rules[dd]
                            if(ruleheaders.style.left && itemQueue.indexOf(ruleheaders.selectorText) !== -1){
                                leftMapValue[ruleheaders.selectorText] = parseInt(ruleheaders.style.left.replace("px",""))
                            }
                        }
                    }

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
                            moveindex = headercell  - (rightStart.x + rightStart.width)
                        }

                        if(linemodel === "auto"){
                            for (let dataLengthKey in dataLength) {
                                if(dataLength[dataLengthKey][item.id].heightRelative
                                    && dataLength[dataLengthKey][item.id].text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height
                                    <  parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0])){

                                    var temp,min;

                                    var keyMap = Object.keys(dataLength[dataLengthKey]);

                                    for(var i = 0 ;i < keyMap.length - 1 ; i ++){
                                        min = i;
                                        for(var j = i + 1;j < keyMap.length; j ++){
                                            if(keyMap[j]  === "maxItem" || keyMap[i]  === "maxItem"){
                                                continue
                                            }
                                            if(dataLength[dataLengthKey][keyMap[j]].heightLength > dataLength[dataLengthKey][keyMap[i]].heightLength ){
                                                temp= keyMap[i];
                                                keyMap[i] = keyMap[j];
                                                keyMap[j] = temp;
                                            }
                                        }
                                    }

                                    dataLength[dataLengthKey].maxItem = {}
                                    dataLength[dataLengthKey].maxItem = {[dataLength[dataLengthKey][keyMap[1]].heightLength] : keyMap[1]}

                                    dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height

                                    dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                    dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                    //console.log(dataLength[dataLengthKey].maxItem);
                                    dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative
                                    dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute

                                    var querySelector1ss = document.querySelector(`[data-hash="${dataLengthKey}"]`);

                                    var querySelector1 = querySelector1ss.querySelector(".heightRelative");

                                    querySelector1.classList.remove("heightRelative")
                                    querySelector1.classList.add("heightAbsolute")

                                    var querySelector2 = querySelector1ss.querySelector(".cell-header-" + Object.values(dataLength[dataLengthKey].maxItem)[0]);

                                    querySelector2.classList.add("heightRelative")
                                    querySelector2.classList.remove("heightAbsolute")

                                }else{

                                    if( dataLength[dataLengthKey][item.id].heightAbsolute
                                        && dataLength[dataLengthKey][item.id].text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height
                                        > parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0]) ){

                                        dataLength[dataLengthKey][item.id].heightLength = item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height

                                        dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                        dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                        var querySelector1ss = document.querySelector(`[data-hash="${dataLengthKey}"]`);

                                        var thatItemOther = querySelector1ss.querySelector(`.heightRelative`);

                                        thatItemOther.classList.add("heightAbsolute");
                                        thatItemOther.classList.remove("heightRelative");

                                        var querySelector3 = querySelector1ss.querySelector(".cell-header-" + item.id);

                                        querySelector3.classList.add("heightRelative");
                                        querySelector3.classList.remove("heightAbsolute");

                                        dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative
                                        dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute


                                        dataLength[dataLengthKey].maxItem = {}
                                        dataLength[dataLengthKey].maxItem = {
                                            [dataLength[dataLengthKey][item.id].text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height]: item.id
                                        }


                                    }
                                }

                            }

                            if(LengthMap.header[item.id].heightRelative
                                && item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height < Object.keys(maxValue)[0]){

                                var temp,min;

                                var keyMap = Object.keys(LengthMap.header);

                                for(var i = 0 ;i < keyMap.length - 1 ; i ++){
                                    min = i;
                                    for(var j = i + 1;j < keyMap.length; j ++){
                                        if(LengthMap.header[keyMap[j]].heightLength > LengthMap.header[keyMap[i]].heightLength ){
                                            temp= keyMap[i];
                                            keyMap[i] = keyMap[j];
                                            keyMap[j] = temp;
                                        }
                                    }
                                }

                                maxValue = {}
                                maxValue[LengthMap.header[keyMap[1]].heightLength] = keyMap[1]

                                LengthMap.header[item.id].heightLength = item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height

                                LengthMap.header[item.id].heightRelative = !LengthMap.header[item.id].heightRelative
                                LengthMap.header[item.id].heightAbsolute = !LengthMap.header[item.id].heightAbsolute

                                LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
                                LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute

                                var thatItem = document.querySelector(`[field=${item.id}]`);

                                thatItem.classList.add("heightAbsolute");
                                thatItem.classList.remove("heightRelative");

                                var thatItemOther = document.querySelector(`[field=${Object.values(maxValue)[0]}]`);

                                thatItemOther.classList.add("heightRelative");
                                thatItemOther.classList.remove("heightAbsolute");

                            }else{

                                if( LengthMap.header[item.id].heightAbsolute
                                    && item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height > Object.keys(maxValue)[0]){

                                    LengthMap.header[item.id].heightLength = item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height

                                    LengthMap.header[item.id].heightRelative = !LengthMap.header[item.id].heightRelative
                                    LengthMap.header[item.id].heightAbsolute = !LengthMap.header[item.id].heightAbsolute

                                    var thatItem = document.querySelector(`[field=${item.id}]`);

                                    thatItem.classList.add("heightRelative");
                                    thatItem.classList.remove("heightAbsolute");

                                    var thatItemOther = document.querySelector(`[field=${Object.values(maxValue)[0]}]`);

                                    thatItemOther.classList.add("heightAbsolute");
                                    thatItemOther.classList.remove("heightRelative");

                                    LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
                                    LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute

                                    maxValue = {}
                                    maxValue[item.text.width("hide-surplus-text,horizontally",`width: ${headercell}px;`).height] = item.id
                                }
                            }
                        }

                        ruleThat.style.width = headercell + 'px'

                        if(linemodel === "auto"){
                            for(let dd = 0; dd < rules.length; dd ++ ){
                                let ruleheaders = rules[dd]
                                if(leftMapValue[ruleheaders.selectorText]
                                    && Object.keys(leftMapValue).indexOf(`.cell-header-${item.id}`) === -1 ){
                                    ruleheaders.style.left = moveindex + leftMapValue[ruleheaders.selectorText] + 'px'
                                }
                            }
                        }

                        var headerindex = headercell + rightStart.header_width - rightStart.width  - rightStart.x

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
                        leftMapValue = {}

                    })

                }

                querySelector.addEventListener("mousedown",start)

            }
            if(item["sort"]){

                var sortFieldDOM = document.querySelector(`[sortfield=${item.id}]`);

                sortFieldDOM.addEventListener("click",function (e) {

                    var dome = []

                    var sortItemMap = []

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
                        sortItemMap[i] = document.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`)
                        self.container.removeChild(document.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`))
                    }

                    for (let i = 0 ; i < sortItemMap.length ; i ++) {
                        self.container.appendChild(sortItemMap[i])
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

        //return

        config.data.forEach(function (item,index) {

            var arr = {};
            var random = genId()
            if(linemodel === "auto"){


                dataLength[random] = {}

                var LentMaxValue = {1:"field"}

                for (let itemKey in item) {

                    if(item[itemKey].toString().width("hide-surplus-text,horizontally",`width:${headerWidth[itemKey]}px`).height > Object.keys(LentMaxValue)[0]){
                        LentMaxValue = {}
                        LentMaxValue[item[itemKey].toString().width("hide-surplus-text,horizontally",`width:${headerWidth[itemKey]}px`).height] = itemKey
                    }

                    dataLength[random][itemKey] = {
                        text:item[itemKey],
                        heightLength: item[itemKey].toString().width(`hide-surplus-text,horizontally`,`width:${headerWidth[itemKey]}px`).height,
                        heightAbsolute:true,
                        heightRelative:false,
                    };
                }

                dataLength[random].maxItem = LentMaxValue

                dataLength[random][Object.values(LentMaxValue)[0]].heightAbsolute = !dataLength[random][Object.values(LentMaxValue)[0]].heightAbsolute
                dataLength[random][Object.values(LentMaxValue)[0]].heightRelative = !dataLength[random][Object.values(LentMaxValue)[0]].heightRelative

            }

            for(let cell in item){

                var domCell =  `<div class="table-tabulation-cell-line cell-header-${cell} 
                          ${linemodel === "auto" ? `${dataLength[random][cell].heightRelative ? `heightRelative` : `heightAbsolute`} horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                            hide-surplus-text " >`

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
            tableBodyTabulation.setAttribute("data-hash",random)

            dataResult[index] = item

            tableBodyTabulation.classList.add("table-body-tabulation")
            if(linemodel === "auto"){
                tableBodyTabulation.classList.add("heightRelative")
            }
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

        //asdf.findKey("heh")

        //Object.keys(asdf).find(k => compare(obj[k], value))

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
