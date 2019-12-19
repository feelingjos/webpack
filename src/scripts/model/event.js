
(function(){



}())

class event {
    constructor(){}

    on(elem,fn,data,useCapture){
        var elementById = document.getElementById(elem);

        if(data){
            console.log(data)
        }



    }

}

window.Elevent = event;