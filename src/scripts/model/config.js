
import {isNull} from "../util/utils";


class configModel{

    constructor(container, config){
        this.container = container;
        this.containerDOM = document.getElementById(container)
        this.config = config;
        this.columns = config.columns;
        this.initConfig()//初始化配置文件
        this.initHeaderColumns(config.columns)
        this.initData(config)//装配数据
    }

    initHeaderColumns(columns){

        var that = this.config;

        this.columns = columns.map(function(item,index){
            item.h_index = index + 1
            that.configItems[item.id] = item
            return item;
        })

    }

    initData(config){
        if(!isNull(config.data)){
            this.data = config.data.map(function(item,index){
                item.d_index = index + 1
                return item;
            })
        }

        this.config.dataRowLength = this.data.length + 1 + ""
    }

    initConfig(){
        this.config.lineModel = isNull(this.config.lineModel) ? this.config.lineModel = 'one' : this.config.lineModel
        this.config.checkbox = isNull(this.config.checkbox) ? this.config.checkbox = false : this.config.checkbox
        this.config.showLineNumber = isNull(this.config.showLineNumber) ? this.config.showLineNumber = false : this.config.showLineNumber
        this.config.selectRowCheck = isNull(this.config.selectRowCheck) ? this.config.selectRowCheck = false : this.config.selectRowCheck
        this.config.selectModel = isNull(this.config.selectModel) ? this.config.selectModel = 'default' : this.config.selectModel
        this.config.maxLineLength = isNull(this.config.maxLineLength) ? this.config.maxLineLength = 1 : this.config.maxLineLength
        this.config.fixedHeader = isNull(this.config.fixedHeader) ? this.config.fixedHeader = true : this.config.fixedHeader
        this.config.cellScrollBar = isNull(this.config.cellScrollBar) ? this.config.cellScrollBar = false : this.config.cellScrollBar
        this.config.selectRowCheck = isNull(this.config.selectRowCheck) ? this.config.selectRowCheck = false : this.config.selectRowCheck
        this.config.headerWidth = {}
        this.lengthMap = {header:{},maxValue:{0:0}}
        this.config.configItems = {}
        this.config.hashDataMap = {}
        this.config.dataLength = {}
        this.config.dataResult = {}
        this.config.keyMapHeader = {}

        if(this.config.showLineNumber){
            this.config.configItems["showLineNumber"] = {}
        }

        if(this.config.checkbox){
            this.config.configItems["checkbox"] = {};
        }


    }


}

export {configModel};
