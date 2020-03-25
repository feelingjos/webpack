(function(){

    Object.defineProperty(Object.prototype, "render", {
        value: function(classes,styles) {
            var thatValue = this.toString()

            var htmlDivElement = document.createElement("div");

            if(classes){
                var arr = classes.split(',');
                for (let arrKey in arr) {
                    htmlDivElement.classList.add(arr[arrKey]);
                }
            }

            //htmlDivElement.classList.add("textDimensionCalculation")

            if(styles){
                htmlDivElement.setAttribute("style",styles)
            }

            htmlDivElement.innerHTML = thatValue;

            try {
                window.document.body.appendChild(htmlDivElement);
            }catch (e) {
                debugger
                console.log(e)
            }

            var result = {
                width : htmlDivElement.offsetWidth,
                height : htmlDivElement.offsetHeight
            };

            htmlDivElement.parentNode.removeChild(htmlDivElement)

            return result;
        },
        writable: true // 是否可以改变
    })

   /* Object.prototype.width = function (classes,styles) {

        var thatValue = this.toString()

        var htmlDivElement = document.createElement("div");

        if(classes){
            var arr = classes.split(',');
            for (let arrKey in arr) {
                htmlDivElement.classList.add(arr[arrKey]);
            }
        }

        //htmlDivElement.classList.add("textDimensionCalculation")

        if(styles){
            htmlDivElement.setAttribute("style",styles)
        }

        htmlDivElement.innerHTML = thatValue;

        document.body.appendChild(htmlDivElement);

        var result = {
            width : htmlDivElement.offsetWidth,
            height : htmlDivElement.offsetHeight
        };

        //if(parseInt(this) === 74){
        //    console.log(parseInt(this) === 73)
        //}else{
        htmlDivElement.parentNode.removeChild(htmlDivElement)
        //}

        return result;
    }
*/

}(window))