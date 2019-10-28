!function(win){
    "use strict"

    var GridObject = function(){
        set: {
            return   '-----'
        }
        init:  {
            return  '-----'
        }
    }

    GridObject.prototype.inits = function (aa,bb) {
        console.log(aa)
        console.log(bb)
    }

    win.GridObject = new GridObject();


}(window)