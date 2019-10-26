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
        this.initBody()
        this.on()
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
            <div class="table-header-right-resize" resizefield=${column_content.id}></div>`

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
                data[headerindex.getAttribute('fieldindex')] = {
                    id: key,
                    text:datamap[key],
                    width: headerindex.style.width,
                    textAlign: headerindex.style.textAlign
                }
            }

            var styletemlpate  =   ``

            for(var d = 0; d < data.length; d ++){

                var ddd =  document.createElement('div')

                ddd.classList.add(`table-tabulation-cell-line`,`cell-header-${data[d].id}`)

                //console.log(data[d])

                //ddd.classList.add('cell-header-'+ data[d] )

                //ddd.style.width = data[d].width
                //ddd.style.textAlign = data[d].textAlign

                styletemlpate += `.cell-header-${data[d].id}{
                    width: ${data[d].width} 
                } \n`

                ddd.innerHTML = data[d].id

                //ddd.classList.add('text-width')

                div.appendChild(ddd)
            }

            //console.log(styletemlpate)

            this.container.appendChild(div)

            var style = document.querySelector('style')

            var sheet = style.sheet || style.styleSheet || {}
            var rules = sheet.cssRules || sheet.rules;

            for (var s = 0 ; s < rules.length; s ++){
                var rule = rules[s]

                //rule.style.width = 10000 + 'px'
            }

            var styles = document.createElement('style')

            styles.setAttribute('easy','aa')

            styles.innerHTML = styletemlpate

            this.container.after(styles)

        }

    }

    on(){


        var sytles = document.querySelectorAll("style[easy='aa']")

        console.log(sytles)

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
