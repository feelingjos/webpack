import {genId} from './util/utils.js'

//点击事件
const table_cell_right_resize = (x) => {

    console.log(x)

}

class TableGrid {
    constructor(el,columns) {
        this.el = el
        this.container = document.getElementById(el);
        //this.container.classList.add('table-body-container-feelj')
        this.columns = columns

        this.calculatedsize()

        this.initHeader()

        var ids = document.getElementById('ids')

        ids.innerHTML = str
    }

    /**
     * 计算大小
     */
    calculatedsize(){

        var size = 0;

        for(var sizei = 0; sizei < this.columns.length; sizei ++ ){

            var header = this.columns[sizei];

            size += header.width;

        }


        if(size > this.container.offsetWidth ){
            this.container.style.overflow = 'auto'
        }else{
            console.log('没超过')
        }


    }

    initHeader(){

        var header =  document.createElement('div')

        header.classList.add('table-header-line-column')

        for(var i = 0; i < this.columns.length; i ++){

            var column_content = this.columns[i]

            var column = document.createElement('div')

            column.classList.add('table-header-call')

            var content = `${column_content.id}
            <div class="table-header-right-resize"></div>`

            column.innerHTML = content

            column.style.width = column_content.width + 'px'
            column.style.textAlign = column_content.align

            header.appendChild(column)

            this.container.appendChild(header)

        }

    }

    initTable() {
        const ele = document.getElementById(this.el)

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
        ele.innerHTML = inittables

    }
}

window.TableGrid = TableGrid

export {
    TableGrid,
    table_cell_right_resize
}
