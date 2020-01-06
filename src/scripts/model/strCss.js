(function(){

    String.prototype.width = function (classes,styles) {

        console.log(this)

        if(classes){
            var arr = classes.split(',');

            classes = arr.join(" ");//转化成class
        }

        if(styles){

            console.log(styles)

        }




    }

}(window))