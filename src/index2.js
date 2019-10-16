import {table_cell_right_resize} from './scripts/table.js'
import './styles/index.scss'

export default (function(){

    const tableResize = document.getElementsByClassName("table-header-right-resize")

    console.log(tableResize.length)
    console.log(tableResize)

    for (var num = 0; num < tableResize.length; num ++) {
        const doms = tableResize[num];

        const parent = doms.parentNode;

        //console.log(parent)

        doms.onmousedown = function(evdown){

            // 阻止冒泡,避免缩放时触发移动事件
            evdown.stopPropagation()
             evdown.preventDefault()
            var pos = {
                'x': evdown.clientX,
            }

            document.addEventListener("mousemove",function(evmove){
                const dragSize = evmove.clientX - pos.x

                const width = parent.clientWidth||parent.offsetWidth

                console.log(dragSize)

                parent.style.width = width + dragSize + 'px'

                pos.x = evmove.clientX
            },true)

            document.addEventListener("mouseup",function(){
                doms.onmousemove = null
                doms.onmouseup = null
            },true)

        }


    }

}())