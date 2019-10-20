//点击事件
const table_cell_right_resize = (x) => {

    console.log(x)

}

class TableGrid {
    constructor(domId,columns) {
        this.dom = domId
        this.columns = columns
        initHeader()
    }

    initHeader(){

        console.log(this.columns)

        for(var i = 0; i < this.columns.length; i ++){
        }

    }

    initTable() {
        const ele = document.getElementById(dom)

        document.createElement("div")

        ele.classList.add("table-body-container-feelj")

        var inittables = `
             <div class="table-header-line-column">

            <div class="table-header-call" data="cell-1">
                姓名
                <div class="table-header-right-resize"></div>
            </div>
            <div class="table-header-call" >
                年龄
                <div class="table-header-right-resize"></div>
            </div>
            <div class="table-header-call">
                性别
                <div class="table-header-right-resize"></div>
            </div>
            <div class="table-header-call">
                成绩
            </div>
            <div class="table-header-call">
                年级
            </div>
            <div class="table-header-call">
                科目
            </div>

        </div>
             <div class="table-body-tabulation">
            <div class="table-tabulation-cell-line" data="cell-1">
                吴华豪
            </div>
            <div class="table-tabulation-cell-line">
                吴华豪
            </div>
            <div class="table-tabulation-cell-line">
                吴华豪
            </div>
            <div class="table-tabulation-cell-line">
                吴华豪
            </div>
            <div class="table-tabulation-cell-line">
                吴华豪
            </div>
            <div class="table-tabulation-cell-line">
                吴华豪
            </div>

        </div>
             <div class="table-body-tabulation">
                <div class="table-tabulation-cell-line" data="cell-1">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
    
            </div>
             <div class="table-body-tabulation">
                <div class="table-tabulation-cell-line" data="cell-1">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
                <div class="table-tabulation-cell-line">
                    吴华豪
                </div>
    
            </div>
        `

        ele.appendChild(inittables)

    }
}
export {
    table_cell_right_resize,
    TableGrid
}
