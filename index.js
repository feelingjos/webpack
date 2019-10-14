import {table_cell_right_resize} from './src/scripts/table.js'
import './src/styles/index.scss'

export default (function(){

    const tableResize = document.getElementsByClassName("table-header-right-resize")

    for (var num = 0; num <= tableResize.length; num ++) {
        const doms = tableResize[0];

        const parnt = doms.parentNode;

        //doms.onclick = table_cell_right_resize

        doms.onmousemove = function (ev){

            console.log('移动了')


        }

        doms.onmousedown = function(ev){

            console.log('停止了')

        }

        doms.onmouseup=function (ev) {

            console.log("呵呵")
        }


    }

}())

