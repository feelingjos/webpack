//点击事件
const table_cell_right_resize = (x) =>{

    console.log(x)

}

var mouseStart = {};
var rightStart = {};

const table_cell_rigth_doresize = (ev) =>{
    var oEvent = ev || event;
    var l = oEvent.clientX - mouseStart.x + rightStart.x;
    var w = l + oDiv.offsetWidth;

    if (w < oDiv.offsetWidth) {
        w = oDiv.offsetWidth;
    }
    else if (w > document.documentElement.clientWidth - oDiv2.offsetLeft) {
        w = document.documentElement.clientWidth - oDiv2.offsetLeft - 2;
    }
}

const table_cell_rigth_stopresize = (ev) =>{
    if (right.releaseCapture) {
        right.onmousemove = null;
        right.onmouseup = null;
        right.releaseCapture();
    }
    else {
        document.removeEventListener("mousemove", table_cell_rigth_doresize, true);
        document.removeEventListener("mouseup", table_cell_rigth_stopresize, true);
    }
}




module.exports = {
    table_cell_right_resize,
    table_cell_rigth_doresize,
    table_cell_rigth_stopresize
}
