
class dataCache{
    constructor(){
        this.cache = {}
    }

    set(key,value){
        this.cache[key] = value
    }

    get(key){
        if(key){
            return this.cache(key)
        }else {
            return this.cache
        }
    }

}

window.dataCache = dataCache