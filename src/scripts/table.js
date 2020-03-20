import './util/event'
import {genId} from './util/utils'
import {Dom} from './util/dom.js'

var el ,container ,checkValueMapStructure = {};

/**
 * 选中校验 处理开关全选操作
 * @param headerCheckBox
 * @param isTrue
 */
const checkSelect = function(headerCheckBox = {},isTrue = false){

    var nodeListOf1 = container.querySelectorAll("span[checkbox]");

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf1.length ; nodeListOfKeyAll ++) {
        if(nodeListOf1[nodeListOfKeyAll].getAttribute("checkbox") === "true"){
            isTrue = false
        };
    }

    headerCheckBox.checkbox = isTrue
    headerCheckBox.setAttribute("checkbox",headerCheckBox.checkbox)

    for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf1.length ; nodeListOfKeyAll ++) {

        var checkHashCheck = nodeListOf1[nodeListOfKeyAll].getAttribute("check-hash");

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

const checkHeaderSelect = function (selectCheckBox = {}){
    
    var checkHash = selectCheckBox.getAttribute("check-hash");

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

        var isTrue = true

        var nodeListOf12 = container.querySelectorAll("span[checkbox]");

        for (let nodeListOfKeyAll = 0; nodeListOfKeyAll < nodeListOf12.length ; nodeListOfKeyAll ++) {
            if(nodeListOf12[nodeListOfKeyAll].getAttribute("check-hash") !== "header"
                && nodeListOf12[nodeListOfKeyAll].getAttribute("checkbox") === "false"){
                isTrue = false
                break
            };
        }

        if(isTrue){

            var querySelector122 = container.querySelector("[check-hash='header']");

            querySelector122["checkbox"] = true
            querySelector122.setAttribute("checkbox",true)

            checkValueMapStructure["header"] = true

            querySelector122.classList.add("iconcheckboxoutline")
            querySelector122.classList.remove("iconcheck-box-outline-bl")

        }


    }else{

        delete checkValueMapStructure[checkHash]

        selectCheckBox.classList.remove("iconcheckboxoutline")
        selectCheckBox.classList.add("iconcheck-box-outline-bl")
        if( checkHash !== "header"){
            var querySelector = container.querySelector("div[data-hash='"+ checkHash +"']");
            querySelector.classList.remove("select-cell-Highlight")
        }

        var querySelector123 = container.querySelector("[check-hash='header']");

        querySelector123["checkbox"] = false
        querySelector123.setAttribute("checkbox",false)

        delete checkValueMapStructure["header"]

        querySelector123.classList.remove("iconcheckboxoutline")
        querySelector123.classList.add("iconcheck-box-outline-bl")

    }

}

const styleRules = function (htmlStyleElement) {

    var sheet = htmlStyleElement.sheet || htmlStyleElement.styleSheet || {}
    var rules = sheet.cssRules || sheet.rules;

    var rulesheaders

    for(let dd = 0; dd < rules.length; dd ++ ){
        var ruleheaders = rules[dd]

        //console.log(ruleheaders);

        //if(ruleheaders.selectorText === '.header-cell'){
            //rulesheaders = ruleheaders
            //break
       //}
    }

}

class TableGrid {

    constructor(elP,config) {
        el = elP;
        container = document.getElementById(el);
        this.columns = config.columns;
        this.data = config.data;
        this.init(config)
    }

    init(config){

        var sort = {desc: ">",asc: "<"}, //绘制头部
         columns = config.columns,headerCssRules = ``,dataResult = {},maxValue = {1:"null"}
            ,LengthMap = {header:{}},lineModel = config.lineModel || "one" ,
            headerWidth = {},dataLength = {}, headerContainer =``,showLineNumber = config.showLineNumber || false,
            selectRowCheck = config.selectRowCheck || false
        ;

        this.dataResult = dataResult

        if("auto" === lineModel){
            columns.forEach(function(item){
                headerWidth[item.id] = item.width
                LengthMap.header[[item.id]] = {
                    heightLength:item.text.width("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height,
                    heightAbsolute:true,
                    heightRelative:false,
                }
                if(item.text.width("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height > Object.keys(maxValue)[0]){
                    maxValue = {}
                    maxValue[item.text.width("hide-surplus-text,horizontally,word-break-all",`width:${item.width}px`).height] = item.id
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

                var width = parseInt(config.data.length.toString().width("table-tabulation-cell-line,one-line-fixed-height,space-nowrap,hide-surplus-text,margin-right-left").width);
                //var width = parseInt(config.data.length.toString().width("table-tabulation-cell-line,one-line-fixed-height,space-nowrap,hide-surplus-text,one-line-fixed-height").width);

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
                
                var width = parseInt(config.data.length.toString().width("one-line-fixed-height,FlexItem,table-tabulation-cell-line,heightAbsolute,horizontally,word-break-all,hide-surplus-text,FlexContainer,margin-right-left").width);

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

        if(config.checkbox){

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

        columns.forEach(function(item,index){

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
                ${lineModel === "auto" ?  `<div class="FlexItem">` : ``}
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

        styleRules(htmlStyleElement)

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
                            LengthMap.header[item.id].heightLength = item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                            for (let dataLengthKey in dataLength) {
                                dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

                                if(dataLength[dataLengthKey][item.id].heightRelative
                                    && dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
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

                                    dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height

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
                                        && dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
                                        > parseInt(Object.keys(dataLength[dataLengthKey].maxItem)[0]) ){

                                        //dataLength[dataLengthKey][item.id].heightLength = item.text.width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height
                                        dataLength[dataLengthKey][item.id].heightLength = dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height

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
                                            [dataLength[dataLengthKey][item.id].text.toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width: ${headercell}px;`).height]: item.id
                                        }

                                    }
                                }

                            }

                            if(LengthMap.header[item.id].heightRelative
                                && item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height < Object.keys(maxValue)[0]){

                                maxValue = {}
                                if(LengthMap.header[keyMapHeader[1]].heightLength > LengthMap.header[keyMapHeader[0]].heightLength){
                                    maxValue[LengthMap.header[keyMapHeader[1]].heightLength] = keyMapHeader[1]
                                }else{
                                    maxValue[LengthMap.header[keyMapHeader[0]].heightLength] = keyMapHeader[0]
                                }

                                LengthMap.header[item.id].heightLength = item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

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
                                    && item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height > Object.keys(maxValue)[0]){

                                    LengthMap.header[item.id].heightLength = item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height

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
                                    maxValue[item.text.width("hide-surplus-text,horizontally,word-break-all,table-header-call",`width: ${headercell}px;`).height] = item.id
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

        var configItems = {}

        if(showLineNumber){
            configItems["showLineNumber"] = {}
        }

        if(config.checkbox){
            configItems["checkbox"] = {};
        }

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

        //console.log(config.data.length.toString());
        //console.log(config.data.length.toString().width("one-line-fixed-height,FlexItem").width);
        //console.log(config.data.length.toString().width("one-line-fixed-height,FlexItem,table-tabulation-cell-line,heightAbsolute,horizontally,word-break-all,hide-surplus-text,FlexContainer").width);

        config.data.forEach(function (item,index) {

            var arr = {};
            var random = genId()
            if(lineModel === "auto"){

                dataLength[random] = {}

                var LentMaxValue = {1:"field"}

                for (let itemKey in item) {

                    if(configItems[itemKey].replace
                        && typeof configItems[itemKey].replace === "function"
                        && typeof configItems[itemKey].replace(item[itemKey]) !== "undefined"
                        && typeof configItems[itemKey].replace(item[itemKey]) !== "object" ){

                        if(configItems[itemKey].replace(item[itemKey]).toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${headerWidth[itemKey]}px`).height > Object.keys(LentMaxValue)[0]){
                            LentMaxValue = {}
                            LentMaxValue[configItems[itemKey].replace(item[itemKey]).toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${headerWidth[itemKey]}px`).height] = itemKey
                        }

                        dataLength[random][itemKey] = {
                            native:item[itemKey],
                            text: configItems[itemKey].replace(item[itemKey]),
                            heightLength: configItems[itemKey].replace(item[itemKey]).toString().width(`hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line`,`width:${headerWidth[itemKey]}px`).height,
                            heightAbsolute:true,
                            heightRelative:false,
                        };

                    }else{

                        if(item[itemKey].toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${headerWidth[itemKey]}px`).height > Object.keys(LentMaxValue)[0]){
                            LentMaxValue = {}
                            LentMaxValue[item[itemKey].toString().width("hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line",`width:${headerWidth[itemKey]}px`).height] = itemKey
                        }

                        dataLength[random][itemKey] = {
                            text:item[itemKey],
                            heightLength: item[itemKey].toString().width(`hide-surplus-text,horizontally,word-break-all,table-tabulation-cell-line`,`width:${headerWidth[itemKey]}px`).height,
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
                    <span class="iconfont icon iconcheck-box-outline-bl" check-hash="${random}" checkbox="false"></span>
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
                            " > 
                   <div class="one-line-fixed-height FlexItem">
                    <span class="iconfont icon iconcheck-box-outline-bl" check-hash="${random}" checkbox="false"></span>
                   </div>
                </div>`

                Object.defineProperty(arr, "checkbox", {
                    value: domCells,
                    writable: true // 是否可以改变
                })

            }

            for(let cell in item){

                var domCell =  `<div class="table-tabulation-cell-line cell-header-${cell} 
                          ${lineModel === "auto" ? `${dataLength[random][cell].heightRelative ? `heightRelative` : `heightAbsolute`} FlexContainer horizontally word-break-all` : `one-line-fixed-height space-nowrap`}
                            hide-surplus-text " > ${lineModel === "auto" ? `<div class="FlexItem">`:``} `

                if(configItems[cell].replace && typeof configItems[cell].replace === "function"
                    && typeof configItems[cell].replace(item[cell]) !== "undefined"
                    && typeof configItems[cell].replace(item[cell]) !== "object"){
                    domCell += typeof configItems[cell].replace(item[cell]) !== "undefined" ? configItems[cell].replace(item[cell]) :item[cell]
                }else{
                    domCell += item[cell]
                }

                domCell += ` ${lineModel === "auto" ? `</div>`:``}</div>`

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

        this.checkBoxInit(selectRowCheck)

    }

    checkBoxInit(selectRowCheck){

        if(selectRowCheck){
            var indexList = container.querySelectorAll("[data-hash]");
            for(let i = 0; i < indexList.length ; i ++ ){
                indexList[i].addEventListener("click",function(){
                    var dataHash = indexList[i].getAttribute("data-hash");
                    var hashNode = container.querySelector("[check-hash='" +dataHash+ "']");
                    checkHeaderSelect(hashNode)
                })
            }
            var headerNodeAll = container.querySelector("[check-hash='header']");
            headerNodeAll.addEventListener("click",function () {
                checkSelect(headerNodeAll,true)
            })
        }else{
            var nodeListOf = container.querySelectorAll("span[checkbox]");
            for (let nodeListOfKey = 0; nodeListOfKey < nodeListOf.length ; nodeListOfKey ++) {
                nodeListOf[nodeListOfKey].addEventListener("click",function () {
                    var checkHash = nodeListOf[nodeListOfKey].getAttribute("check-hash");
                    if(checkHash === "header"){
                        checkSelect(nodeListOf[nodeListOfKey],true)
                    }else{
                        checkHeaderSelect(nodeListOf[nodeListOfKey])
                    }
                })
            }
        }




    }

    getSelectRow(){

        return checkValueMapStructure

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
