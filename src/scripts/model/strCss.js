(function(){

    String.prototype.width = function (classes,styles) {
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

        htmlDivElement.innerHTML = this;

        document.body.appendChild(htmlDivElement);

        var result = {
            width : htmlDivElement.offsetWidth,
            height : htmlDivElement.offsetHeight
        };

        htmlDivElement.parentNode.removeChild(htmlDivElement)

        return result;
    }

}(window))