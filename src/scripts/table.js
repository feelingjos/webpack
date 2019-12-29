import './util/event'
import {Dom} from './util/dom.js'

class TableGrid {

    constructor(el,config) {
        this.el = el;
        this.container = document.getElementById(el);
        this.columns = config.columns;
        this.data = config.data;
        //this.initHeaderStyle()
        //this.initHeader()
        //this.initBody()
        this.init(el,config)
    }

    init(el,config){

        var self = this;

        //绘制头部
        var columns = config.columns;

        var headerCssRules = ``;

        var headerContainer = `<div class="table-header-line-column header-cell">`;

        var headerBody = `<div class="table-body-tabulation header-cell ">`;

        var cellSize = 0;

        columns.forEach(function(item,index){

            headerCssRules +=  `
                .cell-header-${item.id}{
                width: ${item.width}px;
                text-align: ${item.align};
            }`;

            cellSize += item.width + 2;

            headerContainer += `
            <div class="table-header-call cell-header-${item.id}" fieldindex="${index}" field="${item.id}">
            ${item.text}
            ${item.resize ? `<div class="table-header-right-resize" resizefield="${item.id}"/></div>` : ``}
            </div>
            `;

            headerBody += `<div class="table-tabulation-cell-line cell-header-${item.id}">${item.text}</div>`

        });
        headerContainer += `</div>`;
        headerBody += `</div>`;
        headerCssRules += `
            .header-cell{
           width: ${cellSize}px;
            }
        `

        var htmlStyleElement = document.createElement('style');

        /*htmlStyleElement.setAttribute("content","handler-" + el)
        htmlStyleElement.type  = 'text/css'*/

        htmlStyleElement.innerHTML = headerCssRules;

        this.container.appendChild(Dom.strCastDom(headerContainer));

        this.container.appendChild(htmlStyleElement)

        columns.forEach(function(item){

            if(item["resize"]){

                var querySelector = document.querySelector(`[resizefield=${item["id"]}]`);

                var sheet = htmlStyleElement.sheet || htmlStyleElement.styleSheet || {}
                var rules = sheet.cssRules || sheet.rules;

                var rulesheaders

                for(let dd = 0; dd < rules.length; dd ++ ){
                    var ruleheaders = rules[dd]
                    if(ruleheaders.selectorText === '.header-cell'){
                        rulesheaders = ruleheaders
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

                    var count = parseFloat(rulesheaders.style.width.substr(0 , rulesheaders.style.width.length - 2))

                    rightStart.header_width = count

                    var key = this.getAttribute('resizefield')

                    document.documentElement.addEventListener("mousemove",function (e) {
                        var oEvent = e || event

                        var moveindex = oEvent.clientX - mouseStart.x

                        var headercell = moveindex + rightStart.x + rightStart.width

                        var headerindex = moveindex + rightStart.header_width

                        //Classez.header_width = headerindex

                        if(moveindex > document.documentElement.clientWidth ) {
                            moveindex = document.documentElement.clientWidth
                        }

                        for(var re = 0; re < rules.length;re ++){
                            var rule = rules[re]
                            if(rule.selectorText === '.header-cell'){
                                rule.style.width = headerindex + 'px'
                                //Classez.header_width = headerindex
                                //console.log(countrules[0].style.width)
                            }

                            if(rule.selectorText === '.cell-header-'+ key){
                                rule.style.width = headercell + 'px'
                            }
                        }
                    })

                    /*events("html").on('mousemove',{key:key},function(e){
                        //rightStart.header.style.width = headerindex + 'px'

                    })*/
                    /*events("html").on('mouseup',function(e){
                        events("html").off("mousemove")
                        events("html").off("mouseup")
                    })*/

                    document.documentElement.addEventListener("mouseup",function () {
                        document.documentElement.clearEventListeners("mousemove")
                        document.documentElement.clearEventListeners("mouseup")
                    })

                }

                querySelector.addEventListener("mousedown",start)

            }

        })

        //this.container.appendChild(Dom.strCastDom(headerBody));

        config.data.forEach(function (item,index) {

            var arr =[];

            for(var cell in item){
                var index =  document.querySelector(`.cell-header-${cell}`).getAttribute("fieldindex");

                arr[index] =  `<div class="table-tabulation-cell-line cell-header-${cell}">${item[cell]}</div>`
            }
            var tableBodyTabulation = document.createElement("div");

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

    initHeaderStyle(){

        var template = ``;

        var headerallsize =  0;

        for(var i = 0; i < this.columns.length; i ++){
            var styleheaderdata = this.columns[i];
            template += `.cell-header-${styleheaderdata.id}{
                width: ${styleheaderdata.width}px;
                text-align: ${styleheaderdata.align};
            }`;
            headerallsize += styleheaderdata.width + 2
        }

        template += `.header-cell{
           width: ${headerallsize}px;
        }`;

        var myheaderstyle = document.createElement('style');

        myheaderstyle.id ='headerstyle';
        myheaderstyle.innerHTML = template;

        this.container.after(myheaderstyle)

    }

    initHeader(){

        var header =  document.createElement('div');

        header.classList.add('table-header-line-column','header-cell');

        var header_width = 0;

        for(var i = 0; i < this.columns.length; i ++){

            //头内容
            var column_content = this.columns[i];

            //头div
            var column = document.createElement('div');

            column.classList.add('table-header-call');

            column.setAttribute('fieldindex',i);

            column.setAttribute('field',column_content.id);

            column.innerHTML = column_content.text;

            var resize =  document.createElement('div');
            resize.classList.add('table-header-right-resize');
            resize.setAttribute('resizefield',column_content.id);

            column.appendChild(resize);

            column.classList.add(`cell-header-${column_content.id}`);

            header.appendChild(column);

            this.container.appendChild(header);

            header_width += column.offsetWidth

        }


        this.header = header;
        this.header_width = header_width;

        //header.style.width = header_width  + 'px'

        if (this.container.offsetWidth < header.offsetWidth) {
            this.container.style.overflow = 'auto'
        }

    }

    initBody(){

        for (var i = 0; i < this.data.length ; i ++){

            var div = document.createElement('div');

            div.classList.add('table-body-tabulation','header-cell');

            for(var key in this.data[i]){

                var  table_header_call = document.createElement('div');

                table_header_call.classList.add('table-tabulation-cell-line',`cell-header-${key}`);
                table_header_call.innerHTML=this.data[i][key];
                div.appendChild(table_header_call)

            }

            //div.style.width = this.header_width + 'px'

            this.container.appendChild(div)

        }
    }


}



export {
    TableGrid
}
