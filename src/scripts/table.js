import {genId} from './util/utils.js'

//点击事件
const table_cell_right_resize = (x) => {

    console.log(x)

}

class TableGrid {
    constructor(el,columns,data) {
        this.el = el
        this.container = document.getElementById(el);
        this.columns = columns
        this.data = data
        this.initHeaderStyle()
        this.initHeader()
        this.initBody()
        this.on()
    }

    initHeaderStyle(){

        var template = ``

        for(var i = 0; i < this.columns.length; i ++){
            var styleheaderdata = this.columns[i]
            template += `.cell-header-${styleheaderdata.id}{
                width: ${styleheaderdata.width}px;
                text-align: ${styleheaderdata.align};
            }`
        }

        var myheaderstyle = document.createElement('style')

        myheaderstyle.setAttribute('fj','headerStyle')

        myheaderstyle.innerHTML = template

        //this.container.after(myheaderstyle)
        //this.container.insertBefore(myheaderstyle)
        this.container.append(myheaderstyle)

    }

    initHeader(){

        var header =  document.createElement('div')

        header.classList.add('table-header-line-column')

        var header_width = 0

        for(var i = 0; i < this.columns.length; i ++){

            //头内容
            var column_content = this.columns[i]

            //头div
            var column = document.createElement('div')

            column.classList.add('table-header-call')

            column.setAttribute('fieldindex',i)

            column.setAttribute('field',column_content.id)

           /* var content = `${column_content.text}
            <div class="table-header-right-resize" resizefield=${column_content.id}></div>`

            column.innerHTML = content*/

            column.innerHTML = column_content.text

            var resize =  document.createElement('div')
            resize.classList.add('table-header-right-resize')
            resize.setAttribute('resizefield',column_content.id)

            /*resize.onmousedown =function(){

                console.log(resize)

            }*/

            column.appendChild(resize)


            column.classList.add(`cell-header-${column_content.id}`)

            header.appendChild(column)

            this.container.appendChild(header)

            header_width += column.offsetWidth

        }

        this.header = header
        this.header_width = header_width

        header.style.width = header_width  + 'px'

        if (this.container.offsetWidth < header.offsetWidth) {
            this.container.style.overflow = 'auto'
        }

    }

    initBody(){

        for (var i = 0; i < this.data.length ; i ++){

            var div = document.createElement('div')

            div.classList.add('table-body-tabulation')

            for(var key in this.data[i]){

                var  table_header_call = document.createElement('div')

                table_header_call.classList.add('table-tabulation-cell-line',`cell-header-${key}`)
                table_header_call.innerHTML=this.data[i][key]
                div.appendChild(table_header_call)

            }

            div.style.width = this.header_width + 'px'

            this.container.appendChild(div)

            /*for(var d = 0; d < this.data.length; d ++){

                var ddd =  document.createElement('div')

                ddd.classList.add(`table-tabulation-cell-line`,`cell-header-${data[d].id}`)

                ddd.innerHTML = data[d].id

                div.appendChild(ddd)
            }*/


            /*var style = document.querySelector('style')

            var sheet = style.sheet || style.styleSheet || {}
            var rules = sheet.cssRules || sheet.rules;

            for (var s = 0 ; s < rules.length; s ++){
                var rule = rules[s]
            }*/
        }
    }

    on(){

        var sytles = document.querySelector("style[fj='headerStyle']")

        var sheet = sytles.sheet || sytles.styleSheet || {}
        var rules = sheet.cssRules || sheet.rules;

        var resizeElements =  document.querySelectorAll(".table-header-right-resize")

        for (var r = 0 ; r < resizeElements.length; r++){

            var resizeElement = resizeElements[r]

            var mouseStart = {}
            var rightStart = {}

            resizeElement.onmousedown = function(evdown){

                evdown.stopPropagation()
                evdown.preventDefault()

                var that = this

                var oEvent = evdown || event

                mouseStart.x = oEvent.clientX
                rightStart.x = that.offsetLeft;


                if(resizeElement.setCapture){
                    resizeElement.onmousemove = doDrag1
                    resizeElement.onmouseup = stopDrag1
                    resizeElement.setCapture()
                }else{

                    document.addEventListener("mousemove",doDrag1.bind(this,that,that.getAttribute('resizefield')),true)
                    document.addEventListener("mouseup",stopDrag1,true)
                }

            }


            function doDrag1(that,key){

                var oEvent = that || event

                var parent = oEvent.parentNode;

                var index = document.getElementById('index')

                var l = oEvent.clientX - mouseStart.x ;

                for(var re = 0; re < rules.length;re ++){

                    var rule = rules[re]

                    if(rule.selectorText == '.cell-header-'+key){
                        //console.log(moveindex)

                        var old = rule.style.width

                        var olds = old.substr(0 , old.length - 2)

                        //console.log(parseInt(parseInt(olds) + parseInt(moveindex)))

                        //console.log(olds)

                        rule.style.width = parseInt(parseInt(olds) + parseInt(moveindex)) + 'px'


                    }

                }

                //var l = oEvent.clientX - mouseStart.x + rightStart.x
                /*var l =  mouseStart.x + rightStart.x
                var w = l + oEvent.offsetWidth

                if(w < oEvent.offsetWidth){
                    w = oEvent.offsetWidth
                }else if( w > document.documentElement.clientWidth - parent.offsetLeft){
                    w = document.documentElement.clientWidth - parent.offsetLeft - 2
                }

                for (var sy = 0 ; sy < rules.length; sy ++){

                    var indys = rules[sy]

                    if(indys.selectorText == '.cell-header-'+ oEvent.getAttribute('resizefield')){
                        //console.log(indys)
                    }
                }*/

                //style.style.width = w + "px"

            }

            function stopDrag1(that){

                if(that.releaseCapture){
                    that.onmousemove = null
                    that.onmouseup = null
                    that.releaseCapture()
                }else{
                    document.removeEventListener("mousemove",doDrag1.bind(this,null,''),true)
                    document.removeEventListener("mouseup",stopDrag1,true)
                }
            }
        }
    }

}

var Grid = function () {
    set: {

    }
    init: {

    }
}

Grid.prototype.inid = function () {

    console.log("nimiedid");

}


export {
    TableGrid,
    Grid,
    table_cell_right_resize
}
