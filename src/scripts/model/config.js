
import {isNull} from "../util/utils";


class configModel{

    constructor(container, config){
        this.container = container;
        this.config = config;
        this.initData(config)
    }

    initData(config){

        if(!isNull(config.data)){
            this.data = config.data.map(function(item,index){
                item.d_index = index + 1
                return item;
            })
        }

    }

}

export {configModel};
