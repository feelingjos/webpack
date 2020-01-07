(function(){

    String.prototype.width = function (classes,styles) {
        var htmlDivElement = document.createElement("div");

        if(classes){
            var arr = classes.split(',');
            classes = arr.join(" ");//转化成class
        }

        htmlDivElement.classList.add(classes);
        htmlDivElement.classList.add("textDimensionCalculation")

        if(styles){
            htmlDivElement.setAttribute("style",styles)
        }

        htmlDivElement.innerHTML = this;

        document.body.appendChild(htmlDivElement);

        var result = {
            width : htmlDivElement.offsetWidth,
            height : htmlDivElement.offsetHeight
        };
        return result;
    }

}(window))