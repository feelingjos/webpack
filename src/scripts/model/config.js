
import {isNull} from "../util/utils";


class config{

    constructor(container, config){
        this.constructor = container;
        this.config = config;
        this.initData(config)
    }

    static data = {}

    initData(config){

        if(isNull(config.data)){
            data = config.data.map(function(item,index){
                item.d_index = index + 1
                return item;
            })
        }

    }

}