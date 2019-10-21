import TableGrid from './src/scripts/table.js'
import {Persion} from './src/scripts/actionone'
import './src/styles/index.scss'
//import './src/index2'

export default (function(){


    /*var data = [
        { width: 200, id: "name"},
        { width: 200, id: "age"},
        { width: 200, id: "sex"},
        { width: 200, id: "成绩"},
        { width: 200, id: "年级"},
        { width: 200, id: "科目"}
    ]

    new TableGrid('tableinit',data)*/


    /*const tableResize = document.getElementsByClassName("table-header-right-resize")

    const cells = document.querySelectorAll("[data~=cell-1]")

    for (var num = 0; num < tableResize.length; num ++) {
        const doms = tableResize[num]
        const parentdoms = doms.parentNode

        var mouseStart = {}
        var rightStart = {}

        doms.onmousedown = function(evdown){

            evdown.stopPropagation()
            evdown.preventDefault()

            var oEvent = evdown || event
            mouseStart.x = oEvent.clientX
            mouseStart.y = oEvent.clientY
            rightStart.x = doms.offsetLeft

            if(doms.setCapture){
                doms.onmousemove = doDrag1
                doms.onmouseup = stopDrag1
                doms.setCapture()
            }else{
                document.addEventListener("mousemove",doDrag1,true)
                document.addEventListener("mouseup",stopDrag1,true)
            }

        }

        function doDrag1(ev){

            var oEvent = ev || event

            var l = oEvent.clientX - mouseStart.x + rightStart.x
            var w = l + doms.offsetWidth

            if(w < doms.offsetWidth){

                w = doms.offsetWidth

            }else if( w > document.documentElement.clientWidth - parentdoms.offsetLeft){
                w = document.documentElement.clientWidth - parentdoms.offsetLeft - 2
            }

            for (var ci = 0 ; ci <= cells.length; ci ++){
                if(ci < cells.length){
                    cells[ci].style.width = w + 'px'
                }else if (ci = cells.length){
                    parentdoms.style.width = w + "px"
                }

            }


        }

        function stopDrag1(){
            if(doms.releaseCapture){
                doms.onmousemove = null
                doms.onmouseup = null
                doms.releaseCapture()
            }else{
                document.removeEventListener("mousemove",doDrag1,true)
                document.removeEventListener("mouseup",stopDrag1,true)
            }
        }


    }*/

}())

