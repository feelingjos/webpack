import {table_cell_right_resize} from './src/scripts/table.js'
import './src/styles/index.scss'

export default (function(){

    const tableResize = document.getElementsByClassName("table-header-right-resize")

    for (var num = 0; num <= tableResize.length; num ++) {
        const doms = tableResize[0];

        //doms.onclick = table_cell_right_resize

        doms.onmousemove = function (ev){

            var oEvent = ev || event

            console.log("哈哈")

            //console.log('clientX',oEvent.clientX)

            //console.log('offsetX',oEvent.offsetX)

            //console.log(ev)

            //doms.parentNode.style.width  += oEvent.offsetX
        }

        doms.onmouseup=function (ev) {
            console.log("呵呵")
        }


    }

}())

