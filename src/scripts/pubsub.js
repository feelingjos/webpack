class Pubsub{
    constructor(){
        this.handles = {}
    }
    on(type, handle) {
        if(!this.handles[type]){
            this.handles[type] = []
        }
        this.handles[type].push(handle)
    }
    emit() {
        //通过传入参数获取事件类型
        var type = Array.prototype.shift.call(arguments)
        if(!this.handles[type]){
            return false
        }
        for (var i = 0; i < this.handles[type].length; i++) {
            var handle = this.handles[type][i]
            //执行事件
            handle.apply(this, arguments)
        }
    }
    off(type, handle) {
        handles = this.handles[type]
        if(handles){
            if(!handle){
                handles.length = 0//清空数组
            }else{
                for (var i = 0; i < handles.length; i++) {
                    var _handle = handles[i]
                    if(_handle === handle){
                        handles.splice(i,1)
                    }
                }
            }
        }
    }
}

export default Pubsub;