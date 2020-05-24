require('core-js/features/object/define-property')
require('core-js/features/object/create')
require('core-js/features/object/assign')
require('core-js/features/array/for-each')
require('core-js/features/array/index-of')
require('core-js/features/function/bind')
require('core-js/features/promise')

import './src/scripts/model/md5'
import './src/scripts/model/clamp.js'
import {TableGrid} from './src/scripts/table.js'
import './src/scripts/model/getEventListeners'
import './src/scripts/model/strCss'
import './src/scripts/model/other'
import './src/scripts/model/data'
import  './src/scripts/object'
import './src/scripts/util/support'
import './src/styles/index.scss'


export default (function(){

    window.fjcode = {
        TableGrid
    }

}())

