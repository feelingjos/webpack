import './util/event'
import {genId} from './util/utils'
import {Dom} from './util/dom.js'

var el ,container ,checkValueMapStructure = {},checkRangeCall
    ,range, x, y,hashDateMap = {}
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
            result.width = node.offsetWidth
            result.height = node.offsetHeight

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

        return result

    }
    throw new Error("variable DOM: " + dom + " is null");

}

const checkHeader = function () {

    var isTrue = true

    var nodeListOf = container.querySelectorAll("span[checkbox]");

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf.length ; nodeListOfKeyAll ++) {
        if(nodeListOf[nodeListOfKeyAll].getAttribute("check-hash") !== "header"
            && nodeListOf[nodeListOfKeyAll].getAttribute("checkbox") === "false"){
            isTrue = false
            break
        };
    }
    var headerCheckBox = container.querySelector("[check-hash='header']");
    if(isTrue){
        headerCheckBox["checkbox"] = true
        headerCheckBox.setAttribute("checkbox",true)

        checkValueMapStructure["header"] = true

        headerCheckBox.classList.add("iconcheckboxoutline")
        headerCheckBox.classList.remove("iconcheck-box-outline-bl")

    }else{
        headerCheckBox["checkbox"] = false
        headerCheckBox.setAttribute("checkbox",false)
        delete checkValueMapStructure["header"]
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

    var nodeListOf1 = container.querySelectorAll("span[checkbox]");

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
                var querySelector = container.querySelector("div[data-hash='" + checkHashCheck +"']");

                querySelector.classList.add("select-cell-Highlight")
            }
            checkValueMapStructure[checkHashCheck] = nodeListOf1[nodeListOfKeyAll].checkbox

        }else{
            nodeListOf1[nodeListOfKeyAll].classList.remove("iconcheckboxoutline")
            nodeListOf1[nodeListOfKeyAll].classList.add("iconcheck-box-outline-bl")
            if(checkHashCheck !== "header"){
                var querySelector = container.querySelector("div[data-hash='" + checkHashCheck + "']");
                querySelector.classList.remove("select-cell-Highlight")
            }
            delete checkValueMapStructure[checkHashCheck]
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
        checkValueMapStructure[checkHash] = selectCheckBox.checkbox
        if( checkHash !== "header"){
            var querySelector = container.querySelector("div[data-hash='"+ checkHash +"']");
            querySelector.classList.add("select-cell-Highlight")
        }
        checkHeader()
    }else{
        delete checkValueMapStructure[checkHash]
        selectCheckBox.classList.remove("iconcheckboxoutline")
        selectCheckBox.classList.add("iconcheck-box-outline-bl")
        if( checkHash !== "header"){
            var querySelector = container.querySelector("div[data-hash='"+ checkHash +"']");
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
        checkValueMapStructure[dataHash] = isTrue
        nodeRow.classList.add("select-cell-Highlight")
    }else{
        checkNode.classList.remove("iconcheckboxoutline")
        checkNode.classList.add("iconcheck-box-outline-bl")
        delete checkValueMapStructure[dataHash]
        nodeRow.classList.remove("select-cell-Highlight")
    }

    checkHeader()
}

const checkRange = function(range){
    var dataCellList = container.querySelectorAll("[data-hash]");
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
        container.classList.add("select-text-prohibit")
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

            document.addEventListener("mousemove",function (ev) {
                if(selDiv) {

                    if(selDiv.style.display == "none") {
                        selDiv.style.display = "";
                    }

                    x = ev.pageX;
                    y = ev.pageY;
                    range = {
                        width: Math.abs(x - startX),
                        height: Math.abs(y - startY),
                        left: x > startX ? startX : x,
                        top: y > startY ? startY : y
                    };

                    checkRange(range)

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

            document.addEventListener("mouseup",function () {
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

    document.documentElement.addEventListener("keydown",function (event) {
        if(event.keyCode === 17 && !isUp){
            isUp = true
            document.documentElement.clearEventListeners("mousedown")
        }
    })

    document.documentElement.addEventListener("keyup",function (event) {
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
    for (let i in hashDateMap){
        //debugger
        if(hashDateMap[i].config  && hashDateMap[i].config.checkbox === "true"){
            var CellNodeHash = container.querySelector("[data-hash='" + i + "']");
            selectRowFun(CellNodeHash,hashDateMap[i].config.checkbox)
        }
    }
}

/**
 *   渲染表格头部
 */
const tableRenderHeader = function(headerData,config){

    var lineModel = config.lineModel || "one",showLineNumber = config.showLineNumber || false,headerWidth = {},
        LengthMap = {header:{}},maxValue = {1:"null"}, headerCssRules = ``,checkbox = config.checkbox || false,
        dataRowLength = config.dataRowLength || "100",dataLength = {},dataResult ={},
    headerContainer = `` //头部样式

    if(lineModel === "auto"){//
        headerData.forEach(function(item){
            headerWidth[item.id] = item.width
            LengthMap.header[[item.id]] = {
                heightLength:item.text.render("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height,
                heightAbsolute:true,
                heightRelative:false,
            }
            if(item.text.render("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height > Object.keys(maxValue)[0]){
                maxValue = {}
                maxValue[item.text.render("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height] = item.id
            }
        })
        LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute
        LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
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
                ${lineModel === "auto" ?  `<div class="FlexItem line-Ellipsis">` : ``}
                ${item.text}
                ${lineModel === "auto" ?  `</div>` : ``}
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

    Dom.strCastDom(headerContainer,container)

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


    headerData.forEach(function(item){

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

            var temp,min;

            var keyMapHeader = Object.keys(LengthMap.header);

            for(var i = 0 ;i < keyMapHeader.length - 1 ; i ++){
                min = i;
                for(var j = i + 1;j < keyMapHeader.length; j ++){
                    if(LengthMap.header[keyMapHeader[j]].heightLength > LengthMap.header[keyMapHeader[i]].heightLength ){
                        temp= keyMapHeader[i];
                        keyMapHeader[i] = keyMapHeader[j];
                        keyMapHeader[j] = temp;
                    }
                }
            }

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

                    for (let columnsKey in headerData) {
                        if(valve){
                            itemQueue.push(".cell-header-" + headerData[columnsKey].id)
                        }
                        if(headerData[columnsKey].id === item.id){
                            valve = true
                        }
                    }

                    for(let dd = 0; dd < rules.length; dd ++ ){
                        let ruleheaders = rules[dd]
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
                        LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                        for (let dataLengthKey in dataLength) {
                            dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                            if(dataLength[dataLengthKey][item.id].heightRelative
                                && dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
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

                                dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height

                                dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightRelative
                                dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute = !dataLength[dataLengthKey][Object.values(dataLength[dataLengthKey].maxItem)[0]].heightAbsolute

                                var querySelector1ss = container.querySelector(`[data-hash="${dataLengthKey}"]`);

                                var querySelector1 = querySelector1ss.querySelector(".heightRelative");

                                querySelector1.classList.remove("heightRelative")
                                querySelector1.classList.add("heightAbsolute")

                                var querySelector2 = querySelector1ss.querySelector(".cell-header-" + Object.values(dataLength[dataLengthKey].maxItem)[0]);

                                querySelector2.classList.add("heightRelative")
                                querySelector2.classList.remove("heightAbsolute")

                            }else{

                                if( dataLength[dataLengthKey][item.id].heightAbsolute
                                    && dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
                                    > parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0]) ){

                                    //dataLength[dataLengthKey][item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
                                    dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height

                                    dataLength[dataLengthKey][item.id].heightRelative = !dataLength[dataLengthKey][item.id].heightRelative
                                    dataLength[dataLengthKey][item.id].heightAbsolute = !dataLength[dataLengthKey][item.id].heightAbsolute

                                    var querySelector1ss = container.querySelector(`[data-hash="${dataLengthKey}"]`);

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
                                        [dataLength[dataLengthKey][item.id].text.toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height]: item.id
                                    }

                                }
                            }

                        }

                        if(LengthMap.header[item.id].heightRelative
                            && item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height < Object.keys(maxValue)[0]){

                            maxValue = {}
                            if(LengthMap.header[keyMapHeader[1]].heightLength > LengthMap.header[keyMapHeader[0]].heightLength){
                                maxValue[LengthMap.header[keyMapHeader[1]].heightLength] = keyMapHeader[1]
                            }else{
                                maxValue[LengthMap.header[keyMapHeader[0]].heightLength] = keyMapHeader[0]
                            }

                            LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                            LengthMap.header[item.id].heightRelative = !LengthMap.header[item.id].heightRelative
                            LengthMap.header[item.id].heightAbsolute = !LengthMap.header[item.id].heightAbsolute

                            LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
                            LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute

                            var thatItem = container.querySelector(`[field=${item.id}]`);

                            thatItem.classList.add("heightAbsolute");
                            thatItem.classList.remove("heightRelative");

                            var thatItemOther = container.querySelector(`[field=${Object.values(maxValue)[0]}]`);

                            thatItemOther.classList.add("heightRelative");
                            thatItemOther.classList.remove("heightAbsolute");

                        }else{

                            if( LengthMap.header[item.id].heightAbsolute
                                && item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height > Object.keys(maxValue)[0]){

                                LengthMap.header[item.id].heightLength = item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                                LengthMap.header[item.id].heightRelative = !LengthMap.header[item.id].heightRelative
                                LengthMap.header[item.id].heightAbsolute = !LengthMap.header[item.id].heightAbsolute

                                var thatItem = container.querySelector(`[field=${item.id}]`);

                                thatItem.classList.add("heightRelative");
                                thatItem.classList.remove("heightAbsolute");

                                var thatItemOther = container.querySelector(`[field=${Object.values(maxValue)[0]}]`);

                                thatItemOther.classList.add("heightAbsolute");
                                thatItemOther.classList.remove("heightRelative");

                                LengthMap.header[Object.values(maxValue)[0]].heightRelative = !LengthMap.header[Object.values(maxValue)[0]].heightRelative
                                LengthMap.header[Object.values(maxValue)[0]].heightAbsolute = !LengthMap.header[Object.values(maxValue)[0]].heightAbsolute

                                maxValue = {}
                                maxValue[item.text.render("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height] = item.id
                            }
                        }
                    }

                    ruleThat.style.width = headercell + 'px'

                    if(lineModel === "auto"){
                        for(let dd = 0; dd < rules.length; dd ++ ){
                            let ruleheaders = rules[dd]
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

            var sortFieldDOM = container.querySelector(`[sortfield=${item.id}]`);

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
                    sortItemMap[i] = container.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`)
                    container.removeChild(container.querySelector(`[data-index="${Object.keys(dome[i])[0]}"]`))
                }

                for (let i = 0 ; i < sortItemMap.length ; i ++) {
                    container.appendChild(sortItemMap[i])
                }
            })
        }
        return true
    })

}

const tableRenderDataRow = function (rowData,config) {

    var dataCellOld = container.querySelectorAll("[data-hash]");

    if(dataCellOld && dataCellOld > 0){
        for(let i ; dataCellOld.length < i ; i ++){
            container.removeChild(dataCellOld[i])
        }
    }

    var hashDateMap = {},lineModel = config.lineModel || 'one',  sort = {desc: ">",asc: "<"}, //绘制头部
        dataLength = {},configItems = config.configItems ,showLineNumber = config.showLineNumber || false,
        dataResult = {}

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


    rowData.forEach(function (item,index) {

        var arr = {};
        var random = genId()

        var cellConfig = item["config"] || {}

        hashDateMap[random] = item

        if(lineModel === "auto"){

            dataLength[random] = {}

            var LentMaxValue = {1:"field"}

            for (let itemKey in item) {

                if(itemKey === "config"){
                    continue
                }

                if(configItems[itemKey].replace
                    && typeof configItems[itemKey].replace === "function"
                    && typeof configItems[itemKey].replace(item[itemKey]) !== "undefined"
                    && typeof configItems[itemKey].replace(item[itemKey]) !== "object" ){

                    if(configItems[itemKey].replace(item[itemKey]).toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${configItems[itemKey].width}px`).height > Object.keys(LentMaxValue)[0]){
                        LentMaxValue = {}
                        LentMaxValue[configItems[itemKey].replace(item[itemKey]).toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${configItems[itemKey].width}px`).height] = itemKey
                    }

                    dataLength[random][itemKey] = {
                        native:item[itemKey],
                        text: configItems[itemKey].replace(item[itemKey]),
                        heightLength: configItems[itemKey].replace(item[itemKey]).toString().render(`hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line`,`width:${configItems[itemKey].width}px`).height,
                        heightAbsolute:true,
                        heightRelative:false,
                    };

                }else{

                    if(item[itemKey].toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${configItems[itemKey].width}px`).height > Object.keys(LentMaxValue)[0]){
                        LentMaxValue = {}
                        LentMaxValue[item[itemKey].toString().render("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${configItems[itemKey].width}px`).height] = itemKey
                    }

                    dataLength[random][itemKey] = {
                        text:item[itemKey],
                        heightLength: item[itemKey].toString().render(`hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line`,`width:${configItems[itemKey].width}px`).height,
                        heightAbsolute:true,
                        heightRelative:false,
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
                           <div class="one-line-fixed-height FlexItem">
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

            if(cell !== "config") {

                var domCell = `<div class="table-tabulation-cell-line cell-header-${cell} 
                              ${lineModel === "auto" ? `${dataLength[random][cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                                hide-surplus-text " > ${lineModel === "auto" ? `<div class="FlexItem line-Ellipsis">` : ``} `

                if (configItems[cell].replace && typeof configItems[cell].replace === "function"
                    && typeof configItems[cell].replace(item[cell]) !== "undefined"
                    && typeof configItems[cell].replace(item[cell]) !== "object") {
                    domCell += typeof configItems[cell].replace(item[cell]) !== "undefined" ? configItems[cell].replace(item[cell]) : item[cell]
                } else {
                    domCell += item[cell]
                }

                domCell += ` ${lineModel === "auto" ? `</div>` : ``}</div>`

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

        container.appendChild(tableBodyTabulation)

    });

}

class TableGrid {

    constructor(elP,config) {
        el = elP;
        container = document.getElementById(el);
        this.columns = config.columns;
        this.data = config.data;
        this.init(config)
        selectModelFun(config.selectModel)

        //tableRenderHeader();

        if("auto" === config.lineModel && config.maxLineLength && config.maxLineLength > 0){
            var clampNodeList = document.querySelectorAll(".line-Ellipsis");
            for(let i = 0 ; i < clampNodeList.length; i ++){
                $clamp(clampNodeList[i], {clamp: config.maxLineLength});
            }
        }

    }

    init(config){

        var sort = {desc: ">",asc: "<"}, //绘制头部
            data = config.data,
         columns = config.columns,headerCssRules = ``,dataResult = {},maxValue = {1:"null"}
            ,LengthMap = {header:{}},lineModel = config.lineModel || "one" ,
            headerWidth = {},dataLength = {}, headerContainer =``,showLineNumber = config.showLineNumber || false,
            selectRowCheck = config.selectRowCheck || false,selectModel = config.selectRowCheck || 'default',
            dataRowLength = config.data.length.toString()
        ;

        var config = {
            "lineModel":config.lineModel || "one",
            "showLineNumber" : config.showLineNumber || false,
            "checkbox": config.checkbox || false,
            "dataRowLength": config.data.length.toString(),
            "sort" : config.sort || null
        }

        tableRenderHeader(columns,config)

        var configItems = {}

        if(showLineNumber){
            configItems["showLineNumber"] = {}
        }

        if(config.checkbox){
            configItems["checkbox"] = {};
        }

        columns.forEach(function(item){
            configItems[item.id] = item
        })

        config["configItems"] = configItems

        tableRenderDataRow(data,config)

        this.checkBoxInit(selectRowCheck)

    }

    refreshHeader(){

    }

    checkBoxInit(selectRowCheck){

        checkBoxHookLine();

        var headerNodeAll = container.querySelector("[check-hash='header']");
        headerNodeAll.addEventListener("click",function () {
            var disableTrue = container.querySelectorAll("[checkbox='true'][disable]");
            var disableFalse = container.querySelectorAll("[checkbox='false'][disable]");

            var headerState = headerNodeAll.getAttribute("checkbox");

            if(disableTrue && disableTrue.length > 0
                && disableFalse && disableFalse.length === 0){//禁用下存在true

                if(headerState === "true"){
                    headerNodeAll.checkbox = false
                    headerNodeAll.setAttribute("checkbox",false)
                    headerNodeAll.classList.remove("iconcheckboxoutline")
                    headerNodeAll.classList.add("iconcheck-box-outline-bl")
                    delete checkValueMapStructure['header']

                    var checkboxIsTrueNode = container.querySelectorAll("[checkbox='true']:not([disable])");

                    for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                        checkboxIsTrueNode[i].setAttribute("checkbox",false)
                        checkboxIsTrueNode[i].checkbox = false
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete checkValueMapStructure['thatCellNode']
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }

                }else{

                    headerNodeAll.setAttribute("checkbox",true)
                    headerNodeAll.classList.add("iconcheckboxoutline")
                    headerNodeAll.classList.remove("iconcheck-box-outline-bl")
                    checkValueMapStructure['header'] = true

                    var checkboxIsTrueNode = container.querySelectorAll("[checkbox='false']:not([disable])");

                    for(let i = 0 ; i < checkboxIsTrueNode.length; i ++){
                        checkboxIsTrueNode[i].checkbox = true
                        checkboxIsTrueNode[i].setAttribute("checkbox",true)
                        checkboxIsTrueNode[i].classList.add("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.remove("iconcheck-box-outline-bl")
                        var attributeHash = checkboxIsTrueNode[i].getAttribute('check-hash');
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length > 0
                && disableFalse && disableFalse.length > 0){ //禁用下存在true,false

                var checkboxIsTrueNode = container.querySelectorAll("[checkbox]:not([disable])");

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
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }else{
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete checkValueMapStructure[attributeHash]
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length === 0
                && disableFalse && disableFalse.length > 0){//禁用下存在false

                var checkboxIsTrueNode = container.querySelectorAll("[checkbox]:not([disable])");

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
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        checkValueMapStructure[attributeHash] = true
                        thatCellNode.classList.add("select-cell-Highlight")
                    }else{
                        checkboxIsTrueNode[i].classList.remove("iconcheckboxoutline")
                        checkboxIsTrueNode[i].classList.add("iconcheck-box-outline-bl")
                        var thatCellNode = container.querySelector("[data-hash='"+ attributeHash +"']");
                        delete checkValueMapStructure[attributeHash]
                        thatCellNode.classList.remove("select-cell-Highlight")
                    }
                }

            }else if(disableTrue && disableTrue.length === 0
                && disableFalse && disableFalse.length === 0 ){
                checkSelect(headerNodeAll,true)
            }

        })


        if(selectRowCheck){

            var indexList = container.querySelectorAll("[data-hash]");
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
                    var hashNode = container.querySelector("[check-hash='" +dataHash+ "']");
                    checkHeaderSelect(hashNode)
                })
            }

        }else{
            var nodeListOf = container.querySelectorAll("span[checkbox]");
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

        return checkValueMapStructure

    }


}

export {
    TableGrid
}
