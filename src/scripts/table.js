import './util/event'
import {genId} from './util/utils'
import {Dom} from './util/dom.js'

var _el ,_container ,_checkValueMapStructure = {}
    ,_range,_x, _y , _hashDateMap = {},_config,_dataResultsLength,
    _headerStyleRules,_LengthMap,_keyMapHeader,_dataMapStructure = {},
    _fiexdVisual = {maxRange:0,miniRange:0},_thatShow = {maxRange: 0,maxRange: 0},
    _configPosition = {},_previousPosition = {}
;

const getOffset = function(dom){
    if(dom){
        let result = {
            top: 0,
            left: 0
        }
        const getOffset = (node, init) => {
            if (node.nodeType !== 1) {
                return
            }
            position = window.getComputedStyle(node)['position']
            if (typeof(init) === 'undefined' && position === 'static') {
                getOffset(node.parentNode)
                return
            }
            result.top = node.offsetTop + result.top - node.scrollTop
            result.left = node.offsetLeft + result.left - node.scrollLeft
            //result.width = node.width === "undefined"  ? window.getComputedStyle(node).width : node.offsetWidth
            //result.height = node.height === "undefined" ? window.getComputedStyle(node).height : node.offsetHeight
            //result.width  =  window.getComputedStyle(node).width
            //result.height =  window.getComputedStyle(node).height

            if (position === 'fixed') {
                return
            }
            getOffset(node.parentNode)
        }

        // 当前 DOM 节点的 display === 'none' 时, 直接返回 {top: 0, left: 0}
        if (window.getComputedStyle(dom)['display'] === 'none') {
            return result
        }

        let position

        getOffset(dom, true)
        result.width  =  dom.offsetWidth
        result.height =  dom.offsetHeight
        return result

    }
    throw new Error("variable DOM: " + dom + " is null");

}

const checkHeader = function () {

    var isTrue = true

    var nodeListOf = _container.querySelectorAll("span[checkbox]");

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf.length ; nodeListOfKeyAll ++) {
        if(nodeListOf[nodeListOfKeyAll].getAttribute("check-hash") !== "header"
            && nodeListOf[nodeListOfKeyAll].getAttribute("checkbox") === "false"){
            isTrue = false
            break
        };
    }
    var headerCheckBox = _container.querySelector("[check-hash='header']");
    if(isTrue){
        headerCheckBox["checkbox"] = true
        headerCheckBox.setAttribute("checkbox",true)

        _checkValueMapStructure["header"] = true

        headerCheckBox.classList.add("iconcheckboxoutline")
        headerCheckBox.classList.remove("iconcheck-box-outline-bl")

    }else{
        headerCheckBox["checkbox"] = false
        headerCheckBox.setAttribute("checkbox",false)
        delete _checkValueMapStructure["header"]
        headerCheckBox.classList.remove("iconcheckboxoutline")
        headerCheckBox.classList.add("iconcheck-box-outline-bl")
    }

}

/**
 * 选中校验 处理开关全选操作
 * @param headerCheckBox
 * @param isTrue
 */
const checkSelect = function(headerCheckBox,isTrue){

    var nodeListOf1 = _container.querySelectorAll("span[checkbox]");

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf1.length ; nodeListOfKeyAll ++) {
        if( nodeListOf1[nodeListOfKeyAll].getAttribute("checkbox") === "true"){
            isTrue = false
        }
    }

    headerCheckBox.checkbox = isTrue
    headerCheckBox.setAttribute("checkbox",headerCheckBox.checkbox)

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf1.length ; nodeListOfKeyAll ++) {

        var checkHashCheck = nodeListOf1[nodeListOfKeyAll].getAttribute("check-hash");

        var attrDisable = nodeListOf1[nodeListOfKeyAll].getAttribute("disable");

        if(attrDisable && attrDisable === "true"){
            return
        }

        nodeListOf1[nodeListOfKeyAll].checkbox = isTrue
        nodeListOf1[nodeListOfKeyAll].setAttribute("checkbox",headerCheckBox.checkbox)

        if(nodeListOf1[nodeListOfKeyAll].checkbox
            && nodeListOf1[nodeListOfKeyAll].classList.contains("iconcheck-box-outline-bl")){

            nodeListOf1[nodeListOfKeyAll].classList.add("iconcheckboxoutline")
            nodeListOf1[nodeListOfKeyAll].classList.remove("iconcheck-box-outline-bl")

            if(checkHashCheck !== "header"){
                var querySelector = _container.querySelector("div[data-hash='" + checkHashCheck +"']");

                querySelector.classList.add("select-cell-Highlight")
            }
            _checkValueMapStructure[checkHashCheck] = nodeListOf1[nodeListOfKeyAll].checkbox

        }else{
            nodeListOf1[nodeListOfKeyAll].classList.remove("iconcheckboxoutline")
            nodeListOf1[nodeListOfKeyAll].classList.add("iconcheck-box-outline-bl")
            if(checkHashCheck !== "header"){
                var querySelector = _container.querySelector("div[data-hash='" + checkHashCheck + "']");
                querySelector.classList.remove("select-cell-Highlight")
            }
            delete _checkValueMapStructure[checkHashCheck]
        }

    }

}

const checkHeaderSelect = function (selectCheckBox){

    var checkHash = selectCheckBox.getAttribute("check-hash");

    var attrDisable = selectCheckBox.getAttribute("disable");

    if(attrDisable && attrDisable === "true"){
        return
    }

    selectCheckBox.checkbox = !selectCheckBox.checkbox
    selectCheckBox.setAttribute("checkbox",selectCheckBox.checkbox)

    if(selectCheckBox.checkbox
        && selectCheckBox.classList.contains("iconcheck-box-outline-bl")){
        selectCheckBox.classList.add("iconcheckboxoutline")
        selectCheckBox.classList.remove("iconcheck-box-outline-bl")
        _checkValueMapStructure[checkHash] = selectCheckBox.checkbox
        if( checkHash !== "header"){
            var querySelector = _container.querySelector("div[data-hash='"+ checkHash +"']");
            querySelector.classList.add("select-cell-Highlight")
        }
        checkHeader()
    }else{
        delete _checkValueMapStructure[checkHash]
        selectCheckBox.classList.remove("iconcheckboxoutline")
        selectCheckBox.classList.add("iconcheck-box-outline-bl")
        if( checkHash !== "header"){
            var querySelector = _container.querySelector("div[data-hash='"+ checkHash +"']");
            querySelector.classList.remove("select-cell-Highlight")
        }
        checkHeader()

    }

}

var rangeFunc = function(range, targetRange) {
    return Math.max(range.top, targetRange.top) < Math.min(range.top + range.height, targetRange.top + targetRange.height);
}

var selectRowFun = function (nodeRow,isTrue) {

    var dataHash = nodeRow.getAttribute("data-hash");

    var checkNode = nodeRow.querySelector("[check-hash='"+dataHash+"']");

    checkNode.checkbox = isTrue
    checkNode.setAttribute("checkbox",isTrue)

    if(isTrue){
        checkNode.classList.add("iconcheckboxoutline")
        checkNode.classList.remove("iconcheck-box-outline-bl")
        _checkValueMapStructure[dataHash] = isTrue
        nodeRow.classList.add("select-cell-Highlight")
    }else{
        checkNode.classList.remove("iconcheckboxoutline")
        checkNode.classList.add("iconcheck-box-outline-bl")
        delete _checkValueMapStructure[dataHash]
        nodeRow.classList.remove("select-cell-Highlight")
    }

    checkHeader()
}

const checkRange = function(range){
    var dataCellList = _container.querySelectorAll("[data-hash]");
    for(let i = 0 ; i < dataCellList.length ; i ++){
        var cellDataHash = dataCellList[i].getAttribute("data-hash");
        var thatCell = dataCellList[i].querySelector("[check-hash='" + cellDataHash + "']");
        var cellDisable = thatCell.getAttribute("disable");
        if(cellDisable && cellDisable === "true"){
            continue
        }
        var offset = getOffset(dataCellList[i]);
        selectRowFun(dataCellList[i],rangeFunc(range,offset))
    }
}

/**
 * 设置跨行模式 ：default ， rowspan
 * @param selectModel
 */
const selectModelFun = function (selectModel = 'default') {

    if(selectModel === "rowspan"){
        selectModelClick()
        _container.classList.add("select-text-prohibit")
        document.documentElement.addEventListener("mousedown",function (ev) {
            ev = ev || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;//分别兼容ie和chrome
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var startX = ev.pageX || (ev.clientX+scrollX);//兼容火狐和其他浏览器
            var startY = ev.pageY || (ev.clientY+scrollY);
            paint(startX, startY);
        })

        function paint(startX, startY) {
            var selDiv = document.createElement("div");
            selDiv.id = "selectDiv";
            selDiv.classList.add('select-model-panel')
            selDiv.style.cursor = "pointer"
            selDiv.style.display = "none"
            document.body.appendChild(selDiv);

            selDiv.style.left = startX + "px";
            selDiv.style.top = startY + "px";

            var _x = null;
            var _y = null;

            document.documentElement.addEventListener("mousemove",function (ev) {

                var querySelector = document.querySelector(".assistor");

                if(selDiv) {

                    if(selDiv.style.display == "none") {
                        selDiv.style.display = "";
                    }

                    _x = ev.pageX;
                    _y = ev.pageY;
                    _range = {
                        width: Math.abs(_x - startX),
                        height: Math.abs(_y - startY),
                        left: _x > startX ? startX : _x,
                        top: _y > startY ? startY : _y
                    };

                    _range.top += querySelector.scrollTop

                    checkRange(_range)

                    ev = ev || window.event;
                    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;//分别兼容ie和chrome
                    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    _x = ev.pageX || (ev.clientX + scrollX);//兼容火狐和其他浏览器
                    _y = ev.pageY || (ev.clientY + scrollY);

                    selDiv.style.left = Math.min(_x, startX) + "px";
                    selDiv.style.top = Math.min(_y, startY) + "px";
                    selDiv.style.width = Math.abs(_x - startX) + "px";
                    selDiv.style.height = Math.abs(_y - startY) + "px";

                }
            })

            document.documentElement.addEventListener("mouseup",function () {
                if(selDiv){
                    document.body.removeChild(selDiv);
                }
                selDiv = null;

            })
        }
    }

}

const selectModelClick = function () {

    var isUp = false

    document.addEventListener("keydown",function (event) {
        if(event.keyCode === 17 && !isUp){
            isUp = true
            document.documentElement.clearEventListeners("mousedown")
        }
    })

    document.addEventListener("keyup",function (event) {
        if(event.keyCode === 17 && isUp){
            isUp = false
            selectModelFun("rowspan")
        }
    })

}

/**
 * 根据数据回显checkbox
 */
const checkBoxHookLine = function(){
    for (let i in _hashDateMap){
        //debugger
        if(_hashDateMap[i].config  && _hashDateMap[i].config.checkbox === "true"){
            var CellNodeHash = _container.querySelector("[data-hash='" + i + "']");
            selectRowFun(CellNodeHash,_hashDateMap[i].config.checkbox)
        }
    }
}

/**
 *   渲染表格头部
 */
const tableRenderHeader = function(){

    var lineModel = _config.lineModel || "one",showLineNumber = _config.showLineNumber || false,checkbox = _config.checkbox || false,
        dataRowLength = _config.dataRowLength || "100",maxLineLength = _config.maxLineLength || undefined
        ,headerData = _config.columns

    var headerWidth = {}, LengthMap = {header:{},maxValue:{1:""}},maxValue = {1:"null"}, headerCssRules = ``,
        maxHeight = undefined, headerContainer = `` //头部样式

    if(lineModel === "auto"){//

        if(maxLineLength && maxLineLength > 1){
            maxHeight = maxLineLength * 25
        }

        headerData.forEach(function(item){

            var height = item.text.render("hide-surplus-text,horizontally,word-break-all,text-overall-situation",`width:${item.width}px`).height;

            var ellipsis = false;

            if(maxHeight && height > maxHeight ){
                ellipsis = true
                height = maxHeight
            }

            headerWidth[item.id] = item.width
            LengthMap.header[[item.id]] = {
                heightLength:height,
                heightAbsolute:true,
                heightRelative:false,
                ellipsis: ellipsis
            }
            if(height > Object.keys(LengthMap.maxValue)[0]){
                LengthMap.maxValue = {}
                LengthMap.maxValue[height] = item.id
            }
        })
        LengthMap.header[Object.values(LengthMap.maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(LengthMap.maxValue)[0]].heightAbsolute
        LengthMap.header[Object.values(LengthMap.maxValue)[0]].heightRelative = !LengthMap.header[Object.values(LengthMap.maxValue)[0]].heightRelative
    }

    headerContainer = `<div class="table-header-line-column header-cell 
                ${lineModel === "auto" ? `heightRelative` : ``}">`;

    var cellSize = 2;

    var leftScale = 2

    if(showLineNumber){

        cellSize += 30

        if(lineModel === "one"){

            var width = parseInt(dataRowLength.render("table-tabulation-cell-line,one-line-fixed-height,space-nowrap,hide-surplus-text,margin-right-left").width);

            headerCssRules += `
                    .cell-check-box-offset{
                        width : ${width}px
                    }
                `

            headerContainer += `<div class="table-header-call heightRelative"/> 
                   <div class="one-line-fixed-height cell-check-box-offset">
                       
                   </div>
                </div>`

        }else{

            var width = parseInt(dataRowLength.render("one-line-fixed-height,FlexItem,table-tabulation-cell-line,heightAbsolute,horizontally,word-break-all,hide-surplus-text,FlexContainer,margin-right-left").width);

            headerCssRules += `
                    .cell-check-box-offset{
                        left: ${width + 6}px
                    }
                    .cell-show-line-width{
                        width: ${width}px
                    }
                `

            headerContainer += `<div class="table-header-call"/> 
                    <div class=" heightAbsolute FlexContainer cell-show-line-width margin-right-left"  >
                       <div class="FlexItem">
                            
                       </div>
                    </div>
                </div>`

            leftScale += width + 6
        }

    }


    if(checkbox){

        cellSize += 30

        if(lineModel === "one"){
            headerContainer += `<div class="table-header-call heightRelative"/> 
                <div class="cell-header-check-box one-line-fixed-height">
                    <span class="iconfont icon iconcheck-box-outline-bl" checkbox="false" check-hash="header"></span>
                   </div>
                </div>`
        }else{

            headerContainer += `<div class="table-header-call"/> 
                    <div class="cell-header-check-box height-fill-parant heightAbsolute FlexContainer
                      ${showLineNumber ? `cell-check-box-offset` : ``}
                    " >
                       <div class="FlexItem">
                          <span class="iconfont icon iconcheck-box-outline-bl" checkbox="false" check-hash="header"></span>
                       </div>
                    </div>
                </div>`

            leftScale += 25
        }

    }

    headerData.forEach(function(item,index){

        headerCssRules += `
                .cell-header-${item.id}{
                    width: ${item.width}px;
                    text-align: ${item.align};
                    ${lineModel === "one" ?
            `` : `box-sizing: border-box; top:0;
                    ${LengthMap.header[item.id].heightRelative ? `height: 100%;`:`height: 100%;`}
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
            <div class="table-header-call ${lineModel === "one" ? `heightRelative`:``}" >
            ${lineModel === "one" ? `${item.sort ? `<div class="header-sort-desc iconjiangxu iconfont one-line-fixed-height" 
               sortfield="${item.id}" title="sort-${item.id}"/></div>` : ``}
                    <div class="cell-header-${item.id} hide-surplus-text space-nowrap one-line-fixed-height" fieldindex="${index}" field="${item.id}">
               ` : `
                  <div class="cell-header-${item.id}  FlexContainer
                            ${LengthMap.header[item.id].heightRelative ? `heightRelative` : `heightAbsolute`}
                                  hide-surplus-text word-break-all horizontally" fieldindex="${index}" field="${item.id}">
                            ${item.sort ? `<div class="header-sort-desc iconjiangxu iconfont one-sort-sign" sortfield="${item.id}" title="sort-${item.id}"/></div>`:``}  
               `}
                ${lineModel === "auto" ?  `<div class="FlexItem line-Ellipsis text-row-line-sdtandard " 
                     ${LengthMap.header[item.id].ellipsis ? `style="max-height:${LengthMap.header[item.id].heightLength}px "`:``}
                >` : ``}
                ${item.text}
                
                ${lineModel === "auto" ?  `
                 ${LengthMap.header[item.id].ellipsis ? ` <div class="text-ellipsis" ellipsis="${item.id}">...</div>` : ``} </div>` : ``}
                ${lineModel === "auto" ? `${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"></div>` : ``}`:``}

                </div>
                ${lineModel === "one" ? `${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"></div>` : ``}`:``}
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

    htmlStyleElement.setAttribute("id","tableStyle")

    htmlStyleElement.innerHTML = headerCssRules;

    var headersAll = document.createElement("div");

    //headersAll.classList.add("heightAbsolute")
    headersAll.classList.add("headerCell")
    //headersAll.setAttribute("style",`top:0px;`)

    headersAll.innerHTML = headerContainer

    _container.appendChild(headersAll)

    document.head.appendChild(htmlStyleElement)

    var sheet = htmlStyleElement.sheet || htmlStyleElement.styleSheet || {}
    _headerStyleRules = sheet.cssRules || sheet.rules;

    _LengthMap = LengthMap

}

const checkLineSort = function () {

    var temp,min;

    _keyMapHeader = Object.keys(_LengthMap.header);

    for(var i = 0 ;i < _keyMapHeader.length - 1 ; i ++){
        min = i;
        for(var j = i + 1;j < _keyMapHeader.length; j ++){
            if(_LengthMap.header[_keyMapHeader[j]].heightLength > _LengthMap.header[_keyMapHeader[i]].heightLength ){
                temp= _keyMapHeader[i];
                _keyMapHeader[i] = _keyMapHeader[j];
                _keyMapHeader[j] = temp;
            }
        }
    }


}

const tableRenderDataRow = function (rowData,config) {

    var hashDateMap = {},lineModel = config.lineModel || 'one',  sort = {desc: ">",asc: "<"}, //绘制头部
        dataLength = {},configItems = config.configItems ,showLineNumber = config.showLineNumber || false,
        dataResult = {},fixedHeader = config.fixedHeader || false,maxLineLength = config.maxLineLength || undefined,
        maxHeight = undefined,cellScrollBar = config.maxLineLength || false

    if(config.sort){
        for (var i = 0; i < rowData.length - 1; i++) {
            // 内层循环,控制比较的次数，并且判断两个数的大小
            for (var j = 0; j < rowData.length - 1 - i; j++) {
                // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
                if(typeof rowData[j][config.sort.field] === "number"){
                    if(eval(rowData[j][config.sort.field] + sort[config.sort.type || "desc"] + rowData[j + 1][config.sort.field])){
                        let temp = rowData[j];
                        rowData[j] = rowData[j + 1];
                        rowData[j + 1] = temp;
                    }
                }else{
                    if(eval(rowData[j][config.sort.field].length + sort[config.sort.type || "desc"] + rowData[j + 1][config.sort.field].length)){
                        let temp = rowData[j];
                        rowData[j] = rowData[j + 1];
                        rowData[j + 1] = temp;
                    }
                }
            }
        }
    }

    var element = document.createElement("div");

    rowData.forEach(function (item,index) {

        var arr = {};
        var random = genId()

        var cellConfig = item["config"] || {}

        hashDateMap[random] = item

        if(lineModel === "auto"){

            dataLength[random] = {}

            var LentMaxValue = {1:"field"}

            if(maxLineLength && maxLineLength > 1){
                maxHeight = maxLineLength * 25
            }

            for (let itemKey in item) {

                if(itemKey === "config"){
                    continue
                }

                if(configItems[itemKey].replace
                    && typeof configItems[itemKey].replace === "function"
                    && typeof configItems[itemKey].replace(item[itemKey]) !== "undefined"
                    && typeof configItems[itemKey].replace(item[itemKey]) !== "object" ){

                    var heightCell = configItems[itemKey].replace(item[itemKey]).toString().render("hide-surplus-text,horizontally," +
                        "word-break-all,table-tabulation-cell-line,text-overall-situation",`width:${configItems[itemKey].width}px`).height

                    var ellipsis = false;

                    if(maxHeight && heightCell > maxHeight ){
                        ellipsis = true
                        heightCell = maxHeight
                    }

                    if(heightCell > Object.keys(LentMaxValue)[0]){
                        LentMaxValue = {}
                        LentMaxValue[heightCell] = itemKey
                    }

                    if(config.lineModel === "auto" && config.maxLineLength > 1
                        && cellScrollBar){
                        ellipsis = false
                    }


                    dataLength[random][itemKey] = {
                        native:item[itemKey],
                        text: configItems[itemKey].replace(item[itemKey]),
                        heightLength: heightCell,
                        heightAbsolute:true,
                        heightRelative:false,
                        ellipsis: ellipsis
                    };

                }else{

                    var heightCell = item[itemKey].toString().render("hide-surplus-text,horizontally,word-break-all," +
                        "table-tabulation-cell-line,text-overall-situation",`width:${configItems[itemKey].width}px`).height;

                    var ellipsis = false;

                    if(maxHeight && heightCell > maxHeight ){
                        ellipsis = true
                        heightCell = maxHeight
                    }

                    if(heightCell > Object.keys(LentMaxValue)[0]){
                        LentMaxValue = {}
                        LentMaxValue[heightCell] = itemKey
                    }

                    if(config.lineModel === "auto" && config.maxLineLength > 1
                        && cellScrollBar){
                        ellipsis = false
                    }

                    dataLength[random][itemKey] = {
                        text:item[itemKey],
                        heightLength: heightCell,
                        heightAbsolute:true,
                        heightRelative:false,
                        ellipsis: ellipsis
                    };
                }
            }

            dataLength[random].maxItem = LentMaxValue

            dataLength[random][Object.values(LentMaxValue)[0]].heightAbsolute = !dataLength[random][Object.values(LentMaxValue)[0]].heightAbsolute
            dataLength[random][Object.values(LentMaxValue)[0]].heightRelative = !dataLength[random][Object.values(LentMaxValue)[0]].heightRelative

        }

        if(lineModel === "one"){
            if(showLineNumber){

                var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line 
                          one-line-fixed-height space-nowrap cell-check-box-offset margin-right-left
                            hide-surplus-text "> 
                        <div class=" one-line-fixed-height">
                             ${index}
                           </div>
                        </div>
                    `

                Object.defineProperty(arr, "showLineNumber", {
                    value: showLineNumberdomCells,
                    writable: true // 是否可以改变
                })

            }

            var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          one-line-fixed-height space-nowrap
                            hide-surplus-text "> 
                <div class="cell-header-check-box one-line-fixed-height">
                    <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``}" 
                    ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``} check-hash="${random}"   checkbox="false"></span>
                   </div>
                </div>`

            Object.defineProperty(arr, "checkbox", {
                value: domCells,
                writable: true // 是否可以改变
            })

        }else{

            if(showLineNumber){

                var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line  
                          heightAbsolute horizontally word-break-all
                           FlexContainer height-fill-parant cell-show-line-width margin-right-left
                            "> 
                           <div class="FlexItem">
                            ${index}
                           </div>
                        </div>
                    `

                Object.defineProperty(arr, "showLineNumber", {
                    value: showLineNumberdomCells,
                    writable: true // 是否可以改变
                })


            }

            var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          heightAbsolute horizontally word-break-all
                            hide-surplus-text  FlexContainer height-fill-parant
                            ${showLineNumber ? `cell-check-box-offset`: ``}
                            >
                               <div class="one-line-fixed-height FlexItem">
                                <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``} " 
                                 ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``}
                                             check-hash="${random}" checkbox="false"></span>
                   </div>
                </div>`

            Object.defineProperty(arr, "checkbox", {
                value: domCells,
                writable: true // 是否可以改变
            })

        }

        for(let cell in item){

            if(cell !== "config" && cell !== "index") {

                var domCell = `<div class="table-tabulation-cell-line cell-header-${cell} 
                              ${lineModel === "auto" ? `${dataLength[random][cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                                hide-surplus-text " > ${lineModel === "auto" ? `<div class="FlexItem line-Ellipsis text-row-line-sdtandard" 
                              style="overflow:auto;max-height: ${Object.keys(dataLength[random].maxItem)[0]}px">` : ``} `

                if (configItems[cell].replace && typeof configItems[cell].replace === "function"
                    && typeof configItems[cell].replace(item[cell]) !== "undefined"
                    && typeof configItems[cell].replace(item[cell]) !== "object") {
                    domCell += typeof configItems[cell].replace(item[cell]) !== "undefined" ? configItems[cell].replace(item[cell]) : item[cell]
                } else {
                    domCell += item[cell]
                }

                domCell += ` ${lineModel === "auto" ? `</div>` : ``}
                          ${lineModel === "auto" ?  `${dataLength[random][cell].ellipsis ? `<div class="text-ellipsis" ellipsis="${cell}-${random}">...</div>`: ``}` : ``}
                        </div>`

                Object.defineProperty(arr, cell, {
                    value: domCell,
                    writable: true // 是否可以改变
                })

            }
        }

        var tableBodyTabulation = document.createElement("div");

        tableBodyTabulation.setAttribute("data-index",index)
        tableBodyTabulation.setAttribute("data-hash",random)

        dataResult[index] = item

        tableBodyTabulation.classList.add("table-body-tabulation")
        if(lineModel === "auto"){
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

        if(config.fixedHeader){
            //element.appendChild(tableBodyTabulation)
        }else{
            _container.appendChild(tableBodyTabulation)
        }
    });

    if(config.fixedHeader) {
        element.classList.add("fiexd-row-cell-scroll-container")

        var querySelector = _container.querySelector(".headerCell");

        //element.style.marginTop = querySelector.offsetHeight + 'px'

        _container.appendChild(element)
    }

    var rulesheaders

    for(let dd = 0; dd < _headerStyleRules.length; dd ++ ){
        var ruleheaders = _headerStyleRules[dd]
        if(ruleheaders.selectorText === '.header-cell'){
            rulesheaders = ruleheaders
            break
        }
    }

    _config.columns.forEach(function(item){

        if(item["resize"]){

            var querySelector = document.querySelector(`[resizefield=${item["id"]}]`);

            var  miniWidth = item["miniWidth"] || 100

            var ruleThat

            for(let dd = 0; dd < _headerStyleRules.length; dd ++ ){
                var ruleheaders = _headerStyleRules[dd]
                if(ruleheaders.selectorText === '.cell-header-'+ item.id){
                    ruleThat = ruleheaders
                    break
                }
            }

            checkLineSort();

            var mouseStart = {}
            var rightStart = {}

            function start(ev){

                ev.stopPropagation()
                ev.preventDefault()

                var oEvent = ev || event

                if(lineModel === "auto"){
                    var leftMapValue = {}

                    var valve = false

                    var itemQueue = []

                    for (let columnsKey in _config.columns) {
                        if(valve){
                            itemQueue.push(".cell-header-" + _config.columns[columnsKey].id)
                        }
                        if(_config.columns[columnsKey].id === item.id){
                            valve = true
                        }
                    }

                    for(let dd = 0; dd < _headerStyleRules.length; dd ++ ){
                        let ruleheaders = _headerStyleRules[dd]
                        if(ruleheaders.style.left && itemQueue.indexOf(ruleheaders.selectorText) !== -1){
                            leftMapValue[ruleheaders.selectorText] = parseInt(ruleheaders.style.left.replace("px","") - 2)
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

                    if(lineModel === "auto"){

                        _LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height

                        var querySelector5 = _container.querySelector(".headerCell");
                        var querySelector9 = _container.querySelector(".fiexd-row-cell-scroll-container");

                        querySelector9.style.marginTop = querySelector5.offsetHeight + 'px'

                        if(maxHeight && _LengthMap.header[item.id].heightLength  <= maxHeight + 2){
                            _LengthMap.header[item.id].ellipsis = false
                            var querySelector4 = _container.querySelector("[ellipsis='" + item.id + "']");
                            if(querySelector4){
                                querySelector4.style.display = "none"
                            }
                        }else if(!_LengthMap.header[item.id].ellipsis){
                            _LengthMap.header[item.id].ellipsis = true
                            var querySelector4 = _container.querySelector("[ellipsis='" + item.id + "']");

                            if(querySelector4){
                                querySelector4.style.display = "inline";
                            }
                        }

                        for (let dataLengthKey in dataLength) {
                            dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render(
                                "hide-surplus-text,horizontally,word-break-all," +
                                "table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height

                            if(maxHeight && dataLength[dataLengthKey][item.id].heightLength  <= maxHeight + 2 ){
                                dataLength[dataLengthKey][item.id].ellipsis = false

                                var querySelector4 = document.querySelector(`[ellipsis='${item.id}-${dataLengthKey}']`);

                                if(querySelector4){
                                    querySelector4.style.display = "none"
                                }
                            }else if(!dataLength[dataLengthKey][item.id].ellipsis){
                                dataLength[dataLengthKey][item.id].ellipsis = true
                                var querySelector4 = document.querySelector(`[ellipsis='${item.id}-${dataLengthKey}']`);

                                if (querySelector4) {
                                    querySelector4.style.display = "inline"
                                }
                            }

                            if(dataLength[dataLengthKey][item.id].heightRelative
                                && dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all" +
                                    ",table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height
                                <  parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0])){

                                var tempCell,minCell;

                                var keyMapCell = Object.keys(dataLength[dataLengthKey]);

                                for(var i = 0 ;i < keyMapCell.length - 1 ; i ++){
                                    minCell = i;
                                    for(var j = i + 1;j < keyMapCell.length; j ++){
                                        if(keyMapCell[j]  === "maxItem" || keyMapCell[i]  === "maxItem"){
                                            continue
                                        }
                                        if(dataLength[dataLengthKey][keyMapCell[j]].heightLength > dataLength[dataLengthKey][keyMapCell[i]].heightLength ){
                                            tempCell = keyMapCell[i];
                                            keyMapCell[i] = keyMapCell[j];
                                            keyMapCell[j] = tempCell;
                                        }
                                    }
                                }
                                dataLength[dataLengthKey].maxItem = {}

                                if(dataLength[dataLengthKey][keyMapCell[1]].heightLength > dataLength[dataLengthKey][keyMapCell[0]].heightLength){
                                    dataLength[dataLengthKey].maxItem = {[dataLength[dataLengthKey][keyMapCell[1]].heightLength] : keyMapCell[1]}
                                }else{
                                    dataLength[dataLengthKey].maxItem = {[dataLength[dataLengthKey][keyMapCell[0]].heightLength] : keyMapCell[0]}
                                }

                                dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height

                                dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative
                                dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute

                                var querySelector1ss = _container.querySelector(`[data-hash="${dataLengthKey}"]`);

                                var querySelector1 = querySelector1ss.querySelector(".heightRelative");

                                querySelector1.classList.remove("heightRelative")
                                querySelector1.classList.add("heightAbsolute")

                                var querySelector2 = querySelector1ss.querySelector(".cell-header-" + Object.values(dataLength[dataLengthKey].maxItem)[0]);

                                querySelector2.classList.add("heightRelative")
                                querySelector2.classList.remove("heightAbsolute")

                            }else{

                                if( dataLength[dataLengthKey][item.id].heightAbsolute
                                    && dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all" +
                                        ",table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height
                                    > parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0]) ){

                                    //dataLength[dataLengthKey][item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
                                    dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height

                                    dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                    dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                    var querySelector1ss = _container.querySelector(`[data-hash="${dataLengthKey}"]`);

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
                                        [dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line,text-row-line-sdtandard",`width: ${headercell}px;`).height]: item.id
                                    }

                                }
                            }

                        }

                        if(_LengthMap.header[item.id].heightRelative
                            && item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height
                            < Object.keys(_LengthMap.maxValue)[0]){

                            _LengthMap.maxValue = {}
                            if(_LengthMap.header[_keyMapHeader[1]].heightLength > _LengthMap.header[_keyMapHeader[0]].heightLength){
                                _LengthMap.maxValue[_LengthMap.header[_keyMapHeader[1]].heightLength] = _keyMapHeader[1]
                            }else{
                                _LengthMap.maxValue[_LengthMap.header[_keyMapHeader[0]].heightLength] = _keyMapHeader[0]
                            }

                            _LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height

                            _LengthMap.header[item.id].heightRelative = !_LengthMap.header[item.id].heightRelative
                            _LengthMap.header[item.id].heightAbsolute = !_LengthMap.header[item.id].heightAbsolute

                            _LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightRelative = !_LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightRelative
                            _LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightAbsolute = !_LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightAbsolute

                            var thatItem = _container.querySelector(`[field=${item.id}]`);

                            thatItem.classList.add("heightAbsolute");
                            thatItem.classList.remove("heightRelative");

                            var thatItemOther = _container.querySelector(`[field=${Object.values(_LengthMap.maxValue)[0]}]`);

                            thatItemOther.classList.add("heightRelative");
                            thatItemOther.classList.remove("heightAbsolute");

                        }else{

                            if( _LengthMap.header[item.id].heightAbsolute
                                && item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height > Object.keys(_LengthMap.maxValue)[0]){

                                _LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height

                                _LengthMap.header[item.id].heightRelative = !_LengthMap.header[item.id].heightRelative
                                _LengthMap.header[item.id].heightAbsolute = !_LengthMap.header[item.id].heightAbsolute

                                var thatItem = _container.querySelector(`[field=${item.id}]`);

                                thatItem.classList.add("heightRelative");
                                thatItem.classList.remove("heightAbsolute");

                                var thatItemOther = _container.querySelector(`[field=${Object.values(_LengthMap.maxValue)[0]}]`);

                                thatItemOther.classList.add("heightAbsolute");
                                thatItemOther.classList.remove("heightRelative");

                                _LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightRelative = !_LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightRelative
                                _LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightAbsolute = !_LengthMap.header[Object.values(_LengthMap.maxValue)[0]].heightAbsolute

                                _LengthMap.maxValue = {}
                                _LengthMap.maxValue[item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call,text-overall-situation",`width: ${headercell}px;`).height] = item.id
                            }
                        }
                        checkLineSort();
                    }

                    ruleThat.style.width = headercell + 'px'

                    if(lineModel === "auto"){
                        for(let dd = 0; dd < _headerStyleRules.length; dd ++ ){
                            let ruleheaders = _headerStyleRules[dd]
                            if(leftMapValue[ruleheaders.selectorText]
                                && Object.keys(leftMapValue).indexOf(`.cell-header-${item.id}`) === -1 ){
                                ruleheaders.style.left = moveindex + leftMapValue[ruleheaders.selectorText] + 'px'
                            }
                        }
                    }

                    var headerindex = headercell + rightStart.header_width - rightStart.width  - rightStart.x

                    let faultTolerant = 0

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

            var sortFieldDOM = _container.querySelector(`[sortfield=${item.id}]`);

            sortFieldDOM.addEventListener("click",function (e) {

                var dome = []

                var sortItemMap = []

                for (let i = 0; i < data.length;i ++){
                    if(typeof dataResult[i][item.id] === "number"){//内容为数字
                        dome[i] = {[i]:dataResult[i][item.id]}
                    }else {
                        dome[i] = {[i]:dataResult[i][item.id].length}
                    }
                }

                var descorasc = '>'

                if(sortFieldDOM.classList.contains("desc")){
                    descorasc = '>'
                    //sortFieldDOM.querySelector(".iconfont").innerHTML = '&#xe6a1;'
                    sortFieldDOM.classList.remove("iconshengxu1")
                    sortFieldDOM.classList.add("iconjiangxu")
                    sortFieldDOM.classList.remove("desc")
                    sortFieldDOM.classList.add("asc")
                }else{
                    descorasc = "<"
                    //sortFieldDOM.querySelector(".iconfont").innerHTML = '&#xe751;'
                    sortFieldDOM.classList.add("iconshengxu1")
                    sortFieldDOM.classList.remove("iconjiangxu")
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
                    sortItemMap[i] = _container.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`)
                    //_container.removeChild(_container.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`))
                    document.removeChild(sortItemMap[i])
                }

                /*var rowContainer = _container.querySelector(".fiexd-row-cell-scroll-container");

                _container.removeChild(rowContainer);*/

                for (let i = 0 ; i < sortItemMap.length ; i ++) {
                    _container.appendChild(sortItemMap[i])
                }
            })
        }
        return true
    })

    _dataResultsLength = dataLength;

}

/**
 * 获取 滚动条距离顶部距离
 * @returns {number}
 */
const  getScrollTop = function(dom) {
    var scrollTop = 0;
    if(dom.scrollTop) {
        scrollTop = dom.scrollTop;
    } else if(document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

const rowDataStructureInit = function () {

    var dataMap = {allHeight:0},sort = {desc: ">",asc: "<"},maxHeight = 0

    //var element = document.createElement("div");

    var element = _container.querySelector(".fiexd-row-cell-scroll-container")

    var linevisualcontainer = document.createElement("div");

    linevisualcontainer.classList.add("line-visual-container")

    //linevisualcontainer.classList.add("heightAbsolute")

    //todo 设置容器大小

    //linevisualcontainer.style.height = "1185px"

    element.appendChild(linevisualcontainer);

    var lineFixedVisualContainer = document.createElement("div");

    lineFixedVisualContainer.classList.add("line-fiexd-visual-container")

    //有用
    //lineFixedVisualContainer.classList.add("heightAbsolute")

    linevisualcontainer.appendChild(lineFixedVisualContainer);

    if(_config.sort){
        for (var i = 0; i < _config.data.length - 1; i++) {
            // 内层循环,控制比较的次数，并且判断两个数的大小
            for (var j = 0; j < _config.data.length - 1 - i; j++) {
                // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
                if(typeof _config.data[j][_config.sort.field] === "number"){
                    if(eval(_config.data[j][_config.sort.field] + sort[_config.sort.type || "desc"] + _config.data[j + 1][_config.sort.field])){
                        let temp = _config.data[j];
                        _config.data[j] = _config.data[j + 1];
                        _config.data[j + 1] = temp;
                    }
                }else{
                    if(eval(_config.data[j][_config.sort.field].length + sort[_config.sort.type || "desc"] + _config.data[j + 1][_config.sort.field].length)){
                        let temp = _config.data[j];
                        _config.data[j] = _config.data[j + 1];
                        _config.data[j + 1] = temp;
                    }
                }
            }
        }
    }

    var initHeight = 0 ; //初始化高度

    //console.log("_config.data 0",_config.data[0]);
    //console.log("_config.data 2",_config.data);

    _config.data.forEach(function (item,index) {

        var arr = {};
        //var random = genId()

        var cellConfig = item["config"] || {}

        //console.log("_config.item",item);

        var random = md5(JSON.stringify(item));

        dataMap[random] = {}

        dataMap[random].rowIndex = index

        if(_config.lineModel === "auto"){

            dataMap[random].maxVal = 0

            var fieldData = {}

            if(_config.maxLineLength && _config.maxLineLength > 1){
                maxHeight = _config.maxLineLength * 25
            }

            var config = {}

            for (let itemKey in item) {

                if(itemKey === "config"){
                    config = item[itemKey]
                    continue
                }

                if(_config.configItems[itemKey].replace
                    && typeof _config.configItems[itemKey].replace === "function"
                    && typeof _config.configItems[itemKey].replace(item[itemKey]) !== "undefined"
                    && typeof _config.configItems[itemKey].replace(item[itemKey]) !== "object" ){

                    var heightCell = _config.configItems[itemKey].replace(item[itemKey]).toString().render("hide-surplus-text,horizontally," +
                        "word-break-all,table-tabulation-cell-line,text-overall-situation",`width:${_config.configItems[itemKey].width}px`).height

                    var ellipsis = false;

                    if(maxHeight && heightCell > maxHeight ){
                        ellipsis = true
                        heightCell = maxHeight
                    }

                    if(heightCell > dataMap[random].maxVal){
                        dataMap[random].maxKey = itemKey
                        dataMap[random].maxVal = heightCell

                    }

                    if(_config.lineModel === "auto" && _config.maxLineLength > 1
                        && _config.cellScrollBar && _config.cellScrollBar === "true"){
                        ellipsis = false
                    }

                    fieldData[itemKey] = {
                        native:item[itemKey],
                        text: _config.configItems[itemKey].replace(item[itemKey]),
                        heightLength: heightCell,
                        heightAbsolute:true,
                        heightRelative:false,
                        ellipsis: ellipsis
                    };

                }else{

                    var heightCell = item[itemKey].toString().render("hide-surplus-text,horizontally,word-break-all," +
                        "table-tabulation-cell-line,text-overall-situation",`width:${_config.configItems[itemKey].width}px`).height;

                    var ellipsis = false;

                    if(maxHeight && heightCell > maxHeight ){
                        ellipsis = true
                        heightCell = maxHeight
                    }

                    if(heightCell > dataMap[random].maxVal){
                        dataMap[random].maxKey = itemKey
                        dataMap[random].maxVal = heightCell
                    }

                    if(_config.lineModel === "auto" && _config.maxLineLength > 1
                        && _config.cellScrollBar && _config.cellScrollBar === "true"){
                        ellipsis = false
                    }

                    fieldData[itemKey] = {
                        text:item[itemKey],
                        heightLength: heightCell,
                        heightAbsolute:true,
                        heightRelative:false,
                        ellipsis: ellipsis
                    };
                }
            }

            dataMap[random].field = fieldData
            dataMap[random].config = config

            dataMap[random]["field"][dataMap[random].maxKey].heightAbsolute = !dataMap[random]["field"][dataMap[random].maxKey].heightAbsolute
            dataMap[random]["field"][dataMap[random].maxKey].heightRelative = !dataMap[random]["field"][dataMap[random].maxKey].heightRelative

            dataMap[random].miniRange = initHeight

            initHeight += dataMap[random].maxVal

            dataMap[random].maxRange = initHeight

        }else{

            dataMap[random].field = item
            dataMap[random].config = item["config"]
            dataMap[random].rowIndex = index

            return dataMap;

        }



        if(_config.lineModel === "one"){
            if(_config.showLineNumber){

                var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line 
                          one-line-fixed-height space-nowrap cell-check-box-offset margin-right-left
                            hide-surplus-text "> 
                        <div class=" one-line-fixed-height">
                             ${index}
                           </div>
                        </div>
                    `

                Object.defineProperty(arr, "showLineNumber", {
                    value: showLineNumberdomCells,
                    writable: true // 是否可以改变
                })

            }

            var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          one-line-fixed-height space-nowrap
                            hide-surplus-text "> 
                <div class="cell-header-check-box one-line-fixed-height">
                    <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``}" 
                    ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``} check-hash="${random}"   checkbox="false"></span>
                   </div>
                </div>`

            Object.defineProperty(arr, "checkbox", {
                value: domCells,
                writable: true // 是否可以改变
            })

        }else{

            if(_config.showLineNumber){

                var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line  
                          heightAbsolute horizontally word-break-all
                           FlexContainer height-fill-parant cell-show-line-width margin-right-left
                            "> 
                           <div class="FlexItem">
                            ${index}
                           </div>
                        </div>
                    `

                Object.defineProperty(arr, "showLineNumber", {
                    value: showLineNumberdomCells,
                    writable: true // 是否可以改变
                })


            }

            var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          heightAbsolute horizontally word-break-all
                            hide-surplus-text  FlexContainer height-fill-parant
                            ${_config.showLineNumber ? `cell-check-box-offset`: ``}
                            >
                               <div class="one-line-fixed-height FlexItem">
                                <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``} " 
                                 ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``}
                                             check-hash="${random}" checkbox="false"></span>
                   </div>
                </div>`

            Object.defineProperty(arr, "checkbox", {
                value: domCells,
                writable: true // 是否可以改变
            })

        }

        for(let cell in item){

            if(cell === "config" && cell === "index") {
                continue
            }
            var domCell = `<div class="table-tabulation-cell-line cell-header-${cell} 
                          ${_config.lineModel === "auto" ? `${dataMap[random]["field"][cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                            hide-surplus-text " > ${_config.lineModel === "auto" ? `<div class="FlexItem line-Ellipsis text-row-line-sdtandard" 
                          style="overflow:auto;max-height: ${dataMap[random]["field"].maxVal}px">` : ``} `

            if (_config.configItems[cell].replace && typeof _config.configItems[cell].replace === "function"
                && typeof _config.configItems[cell].replace(item[cell]) !== "undefined"
                && typeof _config.configItems[cell].replace(item[cell]) !== "object") {
                domCell += typeof _config.configItems[cell].replace(item[cell]) !== "undefined" ? _config.configItems[cell].replace(item[cell]) : item[cell]
            } else {
                domCell += item[cell]
            }

            domCell += ` ${_config.lineModel === "auto" ? `</div>` : ``}
                      ${_config.lineModel === "auto" ?  `${dataMap[random]["field"][cell].ellipsis ? `<div class="text-ellipsis" ellipsis="${cell}-${random}">...</div>`: ``}` : ``}
                    </div>`

            Object.defineProperty(arr, cell, {
                value: domCell,
                writable: true // 是否可以改变
            })

        }

        var tableBodyTabulation = document.createElement("div");

        tableBodyTabulation.setAttribute("data-index",index)
        tableBodyTabulation.setAttribute("data-hash",random)

        //排序使用
        //dataResult[index] = item

        tableBodyTabulation.classList.add("table-body-tabulation")
        if(_config.lineModel === "auto"){
            tableBodyTabulation.classList.add("heightRelative")
        }
        tableBodyTabulation.classList.add("header-cell")

        for (let configItemsKey in _config.configItems) {
            if(arr[configItemsKey]){
                Dom.strCastDom(arr[configItemsKey],tableBodyTabulation)
            }else{
                let domCell =  `<div class="table-tabulation-cell-line cell-header-${configItemsKey} hide-surplus-text" >
                    </div>`
                Dom.strCastDom(domCell,tableBodyTabulation)
            }
        }

        if(_config.fixedHeader){
            //linevisualcontainer.appendChild(tableBodyTabulation)
            lineFixedVisualContainer.appendChild(tableBodyTabulation)
        }else{
            _container.appendChild(tableBodyTabulation)
        }

        //initHeight += dataMap[random].maxVal

    })

    dataMap.allHeight = initHeight;

    //console.log(dataMap);

    return dataMap;

    /*if(_config.fixedHeader) {
        element.classList.add("fiexd-row-cell-scroll-container")

        var querySelector = _container.querySelector(".headerCell");

        element.style.marginTop = querySelector.offsetHeight + 'px'

        //_container.appendChild(element)
    }*/

    //console.log(dataMap);

}

/**
 * 获取滚动条距离
 * @param d
 * @param callback
 * @param refresh
 */
const scrollDistance = function(d,callback, refresh) {

    // Make sure a valid callback was provided
    if(!callback || typeof callback !== 'function') return;

    // Variables
    var isScrolling, start, end, distance;

    // Listen for scroll events
    d.addEventListener('scroll', function(event) {

        // Set starting position
        if(!start) {
            start = d.scrollTop;
        }

        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function() {

            // Calculate distance
            end = d.scrollTop;
            distance = end - start;

            // Run the callback
            callback(distance,distance > 0,start, end);

            // Reset calculations
            start = null;
            end = null;
            distance = null;

        }, refresh || 66);

    }, false);

};

const configPosition = function(visualDom,scroll){
    var yReserve = 1;
    var rowPerPage = Math.round(visualDom / 40);
    var y = Math.round(scroll.top / 40) || 0;
    var yStart = y - yReserve >= 0 ? y - yReserve : 0;

    var yEnd = y + rowPerPage + yReserve;

    _previousPosition.yStart = _configPosition.yStart
    _previousPosition.yEnd = _configPosition.yEnd

    _configPosition.yStart = yStart
    _configPosition.yEnd = yEnd

}

const tableStyleFun = function () {

    var htmlDivElement1 = document.createElement("div")

    htmlDivElement1.classList.add("assistor")

    var htmlDivElement = document.createElement("div")

    var querySelector = _container.querySelector(".headerCell")
    var fiexdRowCellScrollContainer = _container.querySelector(".fiexd-row-cell-scroll-container")

    htmlDivElement.appendChild(querySelector)
    htmlDivElement.appendChild(fiexdRowCellScrollContainer)

    querySelector.classList.add("heightAbsolute")

    htmlDivElement.classList.add("parent")

    //htmlDivElement.style.height = "40px"

    htmlDivElement1.appendChild(htmlDivElement)

    //htmlDivElement1.appendChild(querySelector1)

    _container.appendChild(htmlDivElement1)

    var dataMapSource =  rowDataStructureInit()

    var parentDOM = document.querySelector(".assistor")

    var queryHeaderLineColum = _container.querySelector(".table-header-line-column")//行高

    var visualDom = _container.offsetHeight - queryHeaderLineColum.offsetHeight;

    console.log("容器大小",_container.offsetHeight,"可视大小",_container.offsetHeight - queryHeaderLineColum.offsetHeight )

    _container.classList.add("datagrid-default-container")

    var lineFiexdVisualContainer = _container.querySelector(".line-fiexd-visual-container");

    lineFiexdVisualContainer.style.marginTop = queryHeaderLineColum.offsetHeight + "px"

    lineFiexdVisualContainer.style.height = visualDom + 80 + 'px'

    console.log("可视化",visualDom );

    var parentDOM = document.querySelector(".parent");

    console.log("头高" , queryHeaderLineColum.offsetHeight)

    console.log("整体容器大小",parentDOM.offsetHeight );

    var showDataMapVisual = {}

    showDataMapVisual["field"] = {}

    var lineVisualContainer = document.querySelector(".line-visual-container");

    if(_config.lineModel === 'one'){
        lineVisualContainer.style.height = _config.data.length * 40  + 'px'
    }else{
        lineVisualContainer.style.height = dataMapSource.allHeight  + 'px'
    }

    configPosition(visualDom,{top:0})

    console.log("_configPosition",_configPosition)

    console.log("dataMapSource",dataMapSource);
    //console.log("dataMapSource lenght",_config.data.length);
    console.log("dataMapSource lenght",Object.keys(dataMapSource).length);

    if(_config.lineModel === 'one'){
        algorithmRow(visualDom,0)
    }

    parentDOM.addEventListener('scroll', function(event) {

        //console.log(parentDOM.scrollTop + visualDom)

        /*if((Math.ceil(parentDOM.scrollTop / 40)) === 0){
            lineVisualContainer.style.marginTop = "0px" ;
        }else{
            lineVisualContainer.style.marginTop = ( (Math.ceil(parentDOM.scrollTop / 40) - 1 ) * 40 ) + "px" ;
        }*/

        configPosition(visualDom,{top:parentDOM.scrollTop})

        lineVisualContainer.style.paddingTop = (_configPosition.yStart * 40 ) + "px" ;

        if(_config.lineModel === 'one'){
            renderScrollRow()
             //algorithmRow(parentDOM.scrollTop + visualDom,parentDOM.scrollTop)
        }




    })

    var addButton = document.getElementById("add");
    var subtractButton = document.getElementById("subtract");

    addButton.onclick = function(){
        parentDOM.scrollTop = parentDOM.scrollTop + 1

    }
    subtractButton.onclick = function(){
        parentDOM.scrollTop = parentDOM.scrollTop - 1
    }

    scrollDistance(parentDOM,function(e){

         //console.log("范围",_configPosition)

    },1000)


}

const renderScrollRow = function(){

    //var data = _config.data ? _config.data.slice(_configPosition.yStart, _configPosition.yEnd) : [];

    rowSwitchCalculation();

}

const rowSwitchCalculation = function(){
    //todo //算范围
    var reslut = []

    var lineFiexdVisualContainer = document.querySelector(".line-fiexd-visual-container");

    if(_configPosition.yStart > _previousPosition.yStart ){
        for (let s = _previousPosition.yStart ; s < _configPosition.yStart ;  s ++){
            reslut.push(s);

            console.log("-",s,"上")
            var removeRow = _container.querySelector("div[data-index='" + parseInt( s + 1) +"']");
            if(removeRow){
                removeRow.parentNode.removeChild(removeRow)
            }
        }

        for (let e = _previousPosition.yEnd ; e < _configPosition.yEnd ; e ++){
            console.log("+",e,"下")

            var addRow = _container.querySelector("div[data-index='" + parseInt( e + 1) +"']");

            if(!addRow){
                addRowForTransform(md5(JSON.stringify(_config.data[e - 1])),_config.data[e + 1],lineFiexdVisualContainer,parseInt( e + 1),true)
            }

        }

    }else if(_configPosition.yStart < _previousPosition.yStart ){
        for (let s = _configPosition.yStart ; s < _previousPosition.yStart ;  s ++){
            reslut.push(s);

            console.log("+",s,"上")

            var addRow = _container.querySelector("div[data-index='" + parseInt( s + 1) +"']");

            if(!addRow){
                addRowForTransform(md5(JSON.stringify(_config.data[s + 1])),_config.data[s + 1],lineFiexdVisualContainer,parseInt( s + 1),false)
            }


        }
        for (let e = _configPosition.yEnd ; e < _previousPosition.yEnd ; e ++){

            console.log("-",e,"下")

            var removeRow = _container.querySelector("div[data-index='" + parseInt( e + 1) +"']");
            if(removeRow){
                removeRow.parentNode.removeChild(removeRow)
            }


        }
    }
    return reslut
}

const algorithmRow = function (maxRange,miniRange) {

    //todo 算法行

    var lineFiexdVisualContainer = _container.querySelector(".line-fiexd-visual-container");

    //lineFiexdVisualContainer.innerHTML = ""

    if(miniRange == 0){
        var number = Math.ceil(maxRange / 40) + 3;
        for (let i  = 1;i < number ; i ++) {

            var rowData = lineFiexdVisualContainer.querySelector("div[data-hash='" + md5(JSON.stringify(_config.data[i - 1])) +"']");
            if(rowData === null || rowData === undefined){
                addRowForTransform(md5(JSON.stringify(_config.data[i - 1])),_config.data[i - 1],lineFiexdVisualContainer,i)
            }

        }

        _fiexdVisual.maxRange  = number
        _fiexdVisual.miniRange  = 1

    }else if(miniRange > 0){

        var benRowNumber = Math.floor(miniRange / 40);

        var endRowNumber = Math.ceil(maxRange / 40);

        if(benRowNumber === 0){
            rowRemoveAndAdd(endRowNumber,1)
            _fiexdVisual.maxRange  = endRowNumber
            _fiexdVisual.miniRange  = 1
        }else{
            rowRemoveAndAdd(endRowNumber,benRowNumber)
            _fiexdVisual.maxRange  = endRowNumber
            _fiexdVisual.miniRange  = benRowNumber
        }





    }


}

const rowCalculationMini = function(flag,range){

    if(_fiexdVisual.miniRange == 0  ||  range == 0){
        return
    }

    if(!flag){
        console.log("上")
        return rangeArray(_fiexdVisual.miniRange + range, _fiexdVisual.miniRange)
    }else{
        console.log("下")
        return rangeArray(_fiexdVisual.maxRange + range, _fiexdVisual.maxRange)
    }

}

const rowCalculationMax = function (flag,range) {

    if( range == 0){
        return
    }

    if(!flag){
        return rangeArray(_fiexdVisual.maxRange + range, _fiexdVisual.maxRange);
    }else{
        return rangeArray(_fiexdVisual.miniRange + range, _fiexdVisual.miniRange)

    }

}

const rangeArray = function(max,mini){
    let rangeArr = []
    for(let i = mini; i < max ; i ++){
        rangeArr.push(i)
    }
    return rangeArr;
}

const rowRemoveAndAdd = function (maxRange,miniRange) {

    //减少的
    var removeRow = rowCalculationMini(_fiexdVisual.maxRange >  maxRange,Math.abs(_fiexdVisual.maxRange -  maxRange))

    console.log("removeRow",removeRow);

    var lineFiexdVisualContainer = _container.querySelector(".line-fiexd-visual-container");

    if(removeRow){

        for (let i = 0 ; i < removeRow.length;i ++){

            //var rowData = _container.querySelector("div[data-hash='" + md5(JSON.stringify(_config.data[removeRow[i]])) +"']");
            //data-index
            var rowData = _container.querySelector("div[data-index='" + removeRow[i] + "']");

            if(rowData){
                lineFiexdVisualContainer.removeChild(rowData)
            }
        }

    }

}


const addRowForTransform = function(dataHash,data,container,rowIndex,before){

    var dataField = data

    var arr = {};

    var cellConfig = data["config"] || {}

    if(_config.lineModel === "one"){
        if(_config.showLineNumber){

            var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line 
                          one-line-fixed-height space-nowrap cell-check-box-offset margin-right-left
                            hide-surplus-text "> 
                        <div class=" one-line-fixed-height">
                             ${rowIndex}
                           </div>
                        </div>
                    `

            Object.defineProperty(arr, "showLineNumber", {
                value: showLineNumberdomCells,
                writable: true // 是否可以改变
            })

        }

        var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          one-line-fixed-height space-nowrap
                            hide-surplus-text "> 
                <div class="cell-header-check-box one-line-fixed-height">
                    <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``}" 
                    ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``} check-hash="${dataHash}"   checkbox="false"></span>
                   </div>
                </div>`

        Object.defineProperty(arr, "checkbox", {
            value: domCells,
            writable: true // 是否可以改变
        })

    }else{

        if(_config.showLineNumber){

            var showLineNumberdomCells = `
                         <div class="table-tabulation-cell-line  
                          heightAbsolute horizontally word-break-all
                           FlexContainer height-fill-parant cell-show-line-width margin-right-left
                            "> 
                           <div class="FlexItem">
                            ${rowIndex}
                           </div>
                        </div>
                    `

            Object.defineProperty(arr, "showLineNumber", {
                value: showLineNumberdomCells,
                writable: true // 是否可以改变
            })


        }

        var domCells = `<div class="table-tabulation-cell-line cell-header-check-box
                          heightAbsolute horizontally word-break-all
                            hide-surplus-text  FlexContainer height-fill-parant
                            ${_config.showLineNumber ? `cell-check-box-offset`: ``}
                            >
                               <div class="one-line-fixed-height FlexItem">
                                <span class="iconfont icon iconcheck-box-outline-bl ${cellConfig && cellConfig.disable && cellConfig.disable === "true" ? `cell-check-box-disable` : ``} " 
                                 ${cellConfig && cellConfig.disable || cellConfig.disable === "true" ? `disable='true'` : ``}
                                             check-hash="${dataHash}" checkbox="false"></span>
                   </div>
                </div>`

        Object.defineProperty(arr, "checkbox", {
            value: domCells,
            writable: true // 是否可以改变
        })

    }

    for(let cell in dataField){

        if(cell === "config" || cell === "index") {
            continue
        }
        var domCell = `<div class="table-tabulation-cell-line cell-header-${cell} 
                          ${_config.lineModel === "auto" ? `${dataField[cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                            hide-surplus-text " > ${_config.lineModel === "auto" ? `<div class="FlexItem line-Ellipsis text-row-line-sdtandard" 
                          style="overflow:auto;max-height: ${data.maxVal}px">` : ``} `

        if (_config.configItems[cell].replace && typeof _config.configItems[cell].replace === "function"
            && typeof _config.configItems[cell].replace(dataField[cell]) !== "undefined"
            && typeof _config.configItems[cell].replace(dataField[cell]) !== "object") {
            domCell += typeof _config.configItems[cell].replace(dataField[cell]) !== "undefined" ? _config.configItems[cell].replace(dataField[cell]) : dataField[cell]
        } else {
            domCell += dataField[cell]
        }

        domCell += ` ${_config.lineModel === "auto" ? `</div>` : ``}
                      ${_config.lineModel === "auto" ?  `${dataField[cell].ellipsis ? `<div class="text-ellipsis" ellipsis="${cell}-${dataHash}">...</div>`: ``}` : ``}
                    </div>`

        Object.defineProperty(arr, cell, {
            value: domCell,
            writable: true // 是否可以改变
        })


    }

    var tableBodyTabulation = document.createElement("div");

    tableBodyTabulation.setAttribute("data-index",rowIndex)
    tableBodyTabulation.setAttribute("data-hash",dataHash)

    //排序使用
    //dataResult[index] = item

    tableBodyTabulation.classList.add("table-body-tabulation")
    if(_config.lineModel === "auto"){
        tableBodyTabulation.classList.add("heightRelative")
    }
    tableBodyTabulation.classList.add("header-cell")

    for (let configItemsKey in _config.configItems) {
        if(arr[configItemsKey]){
            Dom.strCastDom(arr[configItemsKey],tableBodyTabulation)
        }else{
            let domCell =  `<div class="table-tabulation-cell-line cell-header-${configItemsKey} hide-surplus-text" >
                    </div>`
            Dom.strCastDom(domCell,tableBodyTabulation)
        }
    }

    if(before){
        container.insertBefore(tableBodyTabulation,container.lastElementChild.nextSibling);
    }else{
        container.appendChild(tableBodyTabulation)

    }



    /*

    for(let cell in item){

        if(cell === "config") {
            continue
        }
        var domCell = `<div class="table-tabulation-cell-line cell-header-${cell}
                          ${_config.lineModel === "auto" ? `${dataMap[random]["field"][cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                            hide-surplus-text " > ${_config.lineModel === "auto" ? `<div class="FlexItem line-Ellipsis text-row-line-sdtandard"
                          style="overflow:auto;max-height: ${dataMap[random]["field"].maxVal}px">` : ``} `

        if (_config.configItems[cell].replace && typeof _config.configItems[cell].replace === "function"
            && typeof _config.configItems[cell].replace(item[cell]) !== "undefined"
            && typeof _config.configItems[cell].replace(item[cell]) !== "object") {
            domCell += typeof _config.configItems[cell].replace(item[cell]) !== "undefined" ? _config.configItems[cell].replace(item[cell]) : item[cell]
        } else {
            domCell += item[cell]
        }

        domCell += ` ${_config.lineModel === "auto" ? `</div>` : ``}
                      ${_config.lineModel === "auto" ?  `${dataMap[random]["field"][cell].ellipsis ? `<div class="text-ellipsis" ellipsis="${cell}-${random}">...</div>`: ``}` : ``}
                    </div>`

        Object.defineProperty(arr, cell, {
            value: domCell,
            writable: true // 是否可以改变
        })

    }

    var tableBodyTabulation = document.createElement("div");

    tableBodyTabulation.setAttribute("data-index",index)
    tableBodyTabulation.setAttribute("data-hash",random)

    //排序使用
    //dataResult[index] = item

    tableBodyTabulation.classList.add("table-body-tabulation")
    if(_config.lineModel === "auto"){
        tableBodyTabulation.classList.add("heightRelative")
    }
    tableBodyTabulation.classList.add("header-cell")

    for (let configItemsKey in _config.configItems) {
        if(arr[configItemsKey]){
            Dom.strCastDom(arr[configItemsKey],tableBodyTabulation)
        }else{
            let domCell =  `<div class="table-tabulation-cell-line cell-header-${configItemsKey} hide-surplus-text" >
                    </div>`
            Dom.strCastDom(domCell,tableBodyTabulation)
        }
    }*/



}


class TableGrid {

    constructor(elP,config) {

        _el = elP;
        _container = document.getElementById(_el);
        this.columns = config.columns;
        this.data = config.data;
        config.data = config.data.map(function(row, index) {
            row.index = index
            return row
        });
        _config = config
        _config.dataRowLength = config.data.length.toString()

        this.init(config)
        selectModelFun(_config.selectModel)

    }

    init(config){

        /*var sort = {desc: ">",asc: "<"}, //绘制头部
            data = config.data,
         columns = config.columns,headerCssRules = ``,dataResult = {},maxValue = {1:"null"}
            ,LengthMap = {header:{}},lineModel = config.lineModel || "one" ,
            headerWidth = {},dataLength = {}, headerContainer =``,showLineNumber = config.showLineNumber || false,
            selectRowCheck = config.selectRowCheck || false,selectModel = config.selectRowCheck || 'default',
            dataRowLength = config.data.length.toString()
        ;*/

        /*var config = {
            "lineModel":config.lineModel || "one",
            "showLineNumber" : config.showLineNumber || false,
            "checkbox": config.checkbox || false,
            "dataRowLength": config.data.length.toString(),
            "sort" : config.sort || null,
            "maxLineLength" : config.maxLineLength || undefined,
            "fixedHeader": config.fixedHeader
        }

             console.log("config",config,"_config",_config)
        */
        tableRenderHeader()

        var configItems = {}

        if(_config.showLineNumber){
            configItems["showLineNumber"] = {}
        }

        if(_config.checkbox){
            configItems["checkbox"] = {};
        }

        _config.columns.forEach(function(item){
            configItems[item.id] = item
        })

        _config["configItems"] = configItems

        tableRenderDataRow(data,config)

        this.checkBoxInit(_config.selectRowCheck)

    }

    checkBoxInit(selectRowCheck){

        tableStyleFun()

        checkBoxHookLine();

        var headerNodeAll = _container.querySelector("[check-hash='header']");
        headerNodeAll.addEventListener("click",function () {

            var disableTrue = _container.querySelectorAll("[checkbox='true'][disable]");
            var disableFalse = _container.querySelectorAll("[checkbox='false'][disable]");

            var headerState = headerNodeAll.getAttribute("checkbox");

            if(disableTrue && disableTrue.length > 0
                && disableFalse && disableFalse.length === 0){//禁用下存在true

                if(headerState === "true"){
                    headerNodeAll.checkbox = false
                    headerNodeAll.setAttribute("checkbox",false)
                    headerNodeAll.classList.remove("iconcheckboxoutline")
                    headerNodeAll.classList.add("iconcheck-box-outline-bl")
                    delete _checkValueMapStructure['header']

                    var checkboxIsTrueNode = _container.querySelectorAll("[checkbox='true']:not([disable])");

                    for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                        checkboxIsTrueNode[i].setAttribute("checkbox",false)
                        checkboxIsTrueNode[i].checkbox = false
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete _checkValueMapStructure['thatCellNode']
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }

                }else{

                    headerNodeAll.setAttribute("checkbox",true)
                    headerNodeAll.classList.add("iconcheckboxoutline")
                    headerNodeAll.classList.remove("iconcheck-box-outline-bl")
                    _checkValueMapStructure['header'] = true

                    var checkboxIsTrueNode = _container.querySelectorAll("[checkbox='false']:not([disable])");

                    for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                        checkboxIsTrueNode[i].checkbox = true
                        checkboxIsTrueNode[i].setAttribute("checkbox",true)
                        checkboxIsTrueNode[i].classList.add("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.remove("iconcheck-box-outline-bl")
                        var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        _checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length > 0
                && disableFalse && disableFalse.length > 0){ //禁用下存在true,false

                var checkboxIsTrueNode = _container.querySelectorAll("[checkbox]:not([disable])");

                for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                    var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                    if(attributeHash && attributeHash === 'header'){
                        continue
                    }
                    checkboxIsTrueNode[i].checkbox = !checkboxIsTrueNode[i].checkbox
                    checkboxIsTrueNode[i].setAttribute("checkbox",checkboxIsTrueNode[i].checkbox)

                    if(checkboxIsTrueNode[i].checkbox === true){
                        checkboxIsTrueNode[i].classList.add("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.remove("iconcheck-box-outline-bl")
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        _checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }else{
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete _checkValueMapStructure[attributeHash]
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length === 0
                && disableFalse && disableFalse.length > 0){//禁用下存在false

                var checkboxIsTrueNode = _container.querySelectorAll("[checkbox]:not([disable])");

                for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                    var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                    if(attributeHash && attributeHash === 'header'){
                        continue
                    }
                    checkboxIsTrueNode[i].checkbox = !checkboxIsTrueNode[i].checkbox
                    checkboxIsTrueNode[i].setAttribute("checkbox",checkboxIsTrueNode[i].checkbox)

                    if(checkboxIsTrueNode[i].checkbox === true){
                        checkboxIsTrueNode[i].classList.add("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.remove("iconcheck-box-outline-bl")
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        _checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }else{
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var thatCellNode = _container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete _checkValueMapStructure[attributeHash]
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length === 0
                && disableFalse && disableFalse.length === 0 ){
                checkSelect(headerNodeAll,true)
            }

        })


        if(selectRowCheck){

            var indexList = _container.querySelectorAll("[data-hash]");
            for(let i = 0; i < indexList.length ; i ++ ){
                //debugger
                var dataHashCell = indexList[i].getAttribute("data-hash");
                var checkBoxIcon = indexList[i].querySelector("[check-hash='" + dataHashCell + "']");
                var cellDisable = checkBoxIcon.getAttribute("disable");
                if(cellDisable && cellDisable === "true"){
                    continue
                }
                indexList[i].addEventListener("click",function(ev){
                    var dataHash = indexList[i].getAttribute("data-hash");
                    var hashNode = _container.querySelector("[check-hash='" +dataHash+ "']");
                    checkHeaderSelect(hashNode)
                })
            }

        }else{
            var nodeListOf = _container.querySelectorAll("span[checkbox]");
            for (let nodeListOfKey = 0; nodeListOfKey < nodeListOf.length ; nodeListOfKey ++) {
                var cellDisable = nodeListOf[nodeListOfKey].getAttribute("disable");
                var checkHash = nodeListOf[nodeListOfKey].getAttribute("check-hash");
                if(cellDisable && cellDisable === "true"
                    || checkHash === 'header'){
                    continue
                }
                nodeListOf[nodeListOfKey].addEventListener("click",function () {
                    //if(checkHash === "header"){
                    //checkSelect(nodeListOf[nodeListOfKey],true)
                    //}else{
                    checkHeaderSelect(nodeListOf[nodeListOfKey])
                    //}
                })
            }
        }
    }

    getSelectRow(){

        return _checkValueMapStructure

    }


}

export {
    TableGrid
}
