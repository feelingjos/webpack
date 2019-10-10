import {table_cell_right_resize} from './src/scripts/table.js'
import './src/styles/index.scss'

export default (function(){

    const tableResize = document.getElementsByClassName("table-header-right-resize")

    for (var num = 0; num <= tableResize.length; num ++) {
        tableResize[0].onclick = table_cell_right_resize


    }

}())

