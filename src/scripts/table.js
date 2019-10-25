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
        this.initHeader()
        //this.initBody()
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

            var content = `${column_content.text}
            <div class="table-header-right-resize"></div>`

            column.innerHTML = content

            column.style.width = column_content.width + 'px'
            column.style.textAlign = column_content.align

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

        var newdiv = document.createElement('div')

        newdiv.id = 'daiaasdfasdfa'

        header.appendChild(newdiv)

    }

    initBody(){

        for (var i = 0; i < this.data.length ; i ++){

            var div = document.createElement('div')

            div.classList.add('table-body-tabulation')

            div.style.width = this.header_width + 'px'

            var datamap = this.data[i]
            var data = []
            for(var key in datamap){

                var headerindex = document.querySelector(`[field='${key}']`)
                //console.log(headerindex.getAttribute('fieldindex'))
                data[headerindex.getAttribute('fieldindex')] = {
                    id:datamap[key],
                    width: headerindex.style.width
                }

            }

            for(var d = 0; d < data.length; d ++){

                var ddd =  document.createElement('div')

                ddd.classList.add('table-tabulation-cell-line')

                ddd.style.width = data[d].width

                ddd.innerHTML = data[d].id


                div.appendChild(ddd)
            }

            this.container.appendChild(div)


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
