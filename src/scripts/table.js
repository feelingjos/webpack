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

        this.container.after(myheaderstyle)

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

        header.style.width = header_width + 'px'

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

        for (var r = 0 ; r< resizeElements.length; r++){

            var resizeElement = resizeElements[r]

            /*var parent =  resizeElement.parentNode;


            /!*console.log(style)
            console.log(resizeElement)
            console.log('-----------')*!/

            var mouseStart = {}
            var rightStart = {}

            resizeElement.onmousedown = function(evdown){

                evdown.stopPropagation()
                evdown.preventDefault()

                //console.log(evdown)

                var oEvent = evdown || event
                mouseStart.x = oEvent.clientX
                mouseStart.y = oEvent.clientY
                rightStart.x = resizeElement.offsetLeft

                if(resizeElement.setCapture){
                    resizeElement.onmousemove = doDrag1
                    resizeElement.onmouseup = stopDrag1
                    resizeElement.setCapture()
                }else{
                    document.addEventListener("mousemove",doDrag1,true)
                    //document.addEventListener("mousemove",doDrag1,true)
                    document.addEventListener("mouseup",stopDrag1,true)
                }

            }


            function doDrag1(ev){

                var oEvent = ev || event

                console.log(resizeElement)

                var l = oEvent.clientX - mouseStart.x + rightStart.x
                var w = l + resizeElement.offsetWidth

                if(w < resizeElement.offsetWidth){

                    w = resizeElement.offsetWidth

                }else if( w > document.documentElement.clientWidth - parent.offsetLeft){
                    w = document.documentElement.clientWidth - parent.offsetLeft - 2
                }

                //style.style.width = w + "px"

            }

            function stopDrag1(){
                if(resizeElement.releaseCapture){
                    resizeElement.onmousemove = null
                    resizeElement.onmouseup = null
                    resizeElement.releaseCapture()
                }else{
                    document.removeEventListener("mousemove",doDrag1,true)
                    document.removeEventListener("mouseup",stopDrag1,true)
                }
            }*/

        }

    }

}

var Grid = {
    set: function(data){
        console.log(data)
        return data + '-----'
    }
}

export {
    TableGrid,
    Grid,
    table_cell_right_resize
}
