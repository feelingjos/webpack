import './util/event'
import {Dom} from './util/dom.js'

class TableGrid {

    constructor(el,config) {
        this.el = el;
        this.container = document.getElementById(el);
        this.columns = config.columns;
        this.data = config.data;
        this.init(el,config)
        this.test()
    }

    init(el,config){



        var self = this, lineheight = 10,defualt = 40;

        var maxline = 1

        config.columns.forEach(function(item){
            if(item.dataformat && item.dataformat.line && maxline < item.dataformat.line){
                maxline = item.dataformat.line
            }
        })

        //绘制头部
        var columns = config.columns;

        var headerCssRules = ``;

        var headerContainer = `<div class="table-header-line-column header-cell">`;

        var headerBody = `<div class="table-body-tabulation header-cell ">`;

        var cellSize = 0;

        columns.forEach(function(item,index){

            var dataformat =  item.dataformat || {line:1}

            var contentLen = Math.ceil(item.text.width("hide-surplus-text").width / item.width)

            /*if(contentLen > dataformat.line){
                dataformat.line = maxline
            }else if(contentLen < dataformat.line){
                dataformat.line = contentLen
            }*/

            headerCssRules +=  `
            .cell-header-${item.id}{
                 width: ${item.width}px;
                 text-align: ${item.align};
                 height: ${defualt + ( maxline - 1 ) * lineheight}px;
                 -webkit-line-clamp: ${dataformat.line};
                 line-clamp: ${dataformat.line};
                 line-height: ${(defualt + ( maxline - 1 ) * lineheight) / dataformat.line}px;
            }`

            cellSize += item.width + 10;

            headerContainer += `
            <div class="table-header-call" >
               <div class="cell-header-${item.id} hide-surplus-text" fieldindex="${index}" field="${item.id}">
                ${item.text}
               </div>
            ${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"/></div>` : ``}
            </div>
            `;

            headerBody += `<div class="table-tabulation-cell-line cell-header-${item.id}" >${item.text}</div>`

        });
        headerContainer += `</div>`;
        headerBody += `</div>`;
        /*headerCssRules += `
            .header-cell{
           width: ${cellSize}px;
            }
        `*/
        headerCssRules = `
            .header-cell{
             width: ${cellSize}px;
             font-size: 16px;
            }
        ` + headerCssRules

        var htmlStyleElement = document.createElement('style');

        /*htmlStyleElement.setAttribute("content","handler-" + el)
        htmlStyleElement.type  = 'text/css'*/

        htmlStyleElement.innerHTML = headerCssRules;

        this.container.appendChild(Dom.strCastDom(headerContainer));

        this.container.appendChild(htmlStyleElement)

        //console.log(document.styleSheets);

        var sheet = htmlStyleElement.sheet || htmlStyleElement.styleSheet || {}
        var rules = sheet.cssRules || sheet.rules;

        columns.forEach(function(item){

            if(item["resize"]){

                var querySelector = document.querySelector(`[resizefield=${item["id"]}]`);

                var  miniWidth = item["miniWidth"] || 100

                //console.log(rules)

                /*console.log("删除前:----", sheet);

                console.log(sheet.deleteRule(0));

                if (sheet.deleteRule) {

                    console.log("成功")

                    sheet.deleteRule(0);
                }

                console.log("删除后:----" , sheet);*/

                var rulesheaders

                for(let dd = 0; dd < rules.length; dd ++ ){
                    var ruleheaders = rules[dd]
                    if(ruleheaders.selectorText === '.header-cell'){
                        rulesheaders = ruleheaders
                        break
                    }
                }

                var mouseStart = {}
                var rightStart = {}

                function start(ev){

                    //ev.stopPropagation()
                    ev.preventDefault()

                    var oEvent = ev || event

                    //console.log("that",this)

                    mouseStart.x = oEvent.clientX
                    rightStart.x = this.offsetLeft;
                    rightStart.width = this.offsetWidth;

                    //var count = parseFloat(rulesheaders.style.width.substr(0 , rulesheaders.style.width.length - 2))
                    //var count = cellSize

                    rightStart.header_width = parseFloat(rulesheaders.style.width.substr(0 , rulesheaders.style.width.length - 2))

                    /*console.log("cellSize",cellSize);

                    console.log(rightStart);*/

                    var key = this.getAttribute('resizefield')

                    //var dragelem = document.querySelector(`[field=${key}]`);

                    document.documentElement.addEventListener("mousemove",function (e) {
                        var oEvent = e || event

                        /*console.log("oEvent",oEvent.clientX);
                        console.log("mouseStart",mouseStart.x)*/

                        //console.log("move-index",oEvent.clientX - mouseStart.x)

                        var moveindex = oEvent.clientX - mouseStart.x

                        var headercell = moveindex + rightStart.x + rightStart.width

                        var headerindex = moveindex + rightStart.header_width

                        //if(moveindex > document.documentElement.clientWidth ) {
                        //  moveindex = document.documentElement.clientWidth
                        //}

                        //console.log(rules);

                        for(let re = 0; re < rules.length;re ++){
                            let rule = rules[re]
                            if(rule.selectorText === '.cell-header-'+ key){
                                if(headercell < miniWidth){
                                    headercell = miniWidth
                                }
                                rule.style.width = headercell + 'px'
                                break;
                            }
                        }

                        for(let re = 0; re < rules.length;re ++){
                            let rule = rules[re]
                            if(rule.selectorText === '.header-cell'){
                                headerindex = headercell + rightStart.header_width - rightStart.width  - rightStart.x
                                //headerindex = moveindex + rightStart.header_width
                                /*console.log("headerindex",headerindex);
                                console.log("rightStart.header_width",rightStart.header_width)
                                console.log("headercell",headercell)*/
                                rule.style.width = headerindex + 'px'
                                break;
                            }
                        }

                    })

                    document.documentElement.addEventListener("mouseup",function () {

                        //console.log("mouseup",rulesheaders.style.width);

                        document.documentElement.clearEventListeners("mousemove")
                        document.documentElement.clearEventListeners("mouseup")

                        mouseStart = {}
                        rightStart = {}

                    })

                }

                querySelector.addEventListener("mousedown",start)

            }

        })

        for(let dd = 0; dd < rules.length; dd ++ ){
            let ruleheaders = rules[dd]
            if(ruleheaders.selectorText === '.header-cell'){

                //console.log(ruleheaders.style.width);
                break
            }
        }

        //this.container.appendChild(Dom.strCastDom(headerBody));

        config.data.forEach(function (item,index) {

            var arr =[];

            for(var cell in item){

                let index =  document.querySelector(`.cell-header-${cell}`).getAttribute("fieldindex");

                arr[index] =  `<div class="table-tabulation-cell-line cell-header-${cell}" >${item[cell]}</div>`
            }
            var tableBodyTabulation = document.createElement("div");

            tableBodyTabulation.setAttribute("data-index",index)

            tableBodyTabulation.classList.add("table-body-tabulation","header-cell");
            for (var cellBody in arr){
                tableBodyTabulation.appendChild(Dom.strCastDom(arr[cellBody]))
            }

            self.container.appendChild(tableBodyTabulation)

        });

        //设置行的宽高
        /*document.querySelector(".table-header-line-column").style.width = cellSize + 'px';
        document.querySelector(".table-body-tabulation").style.width = cellSize + 'px';*/

    }

    test(){

        var doms = `<div class="admin" style="width: 100px;" title="nihao ">你好正则表达式</div>`

        var reg = new RegExp('^<.*?\\s')

        console.log(reg.exec(doms));

    }

}



export {
    TableGrid
}
