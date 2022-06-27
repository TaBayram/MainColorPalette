


var image = document.getElementById("imgImage");
image.crossOrigin = "";
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var colorCanvas = document.getElementById('colorCanvas');
var colorContext = colorCanvas.getContext('2d');

//Crops the border

window.onload = function() {
    colorCanvas.width=1000;

    /*let colorList = [new Color, new Color, new Color];



    let max = 100;
    let maxCan = 70;
    let minCan = 10;

    let color = new Color();
    color.r = 0;
    color.g = 0;
    color.b = 0;
    


    for(let i = 0; i < colorList.length; i++){
        let currentMax = max;
        let element = colorList[i];

        if(max > maxCan) currentMax = maxCan;
        let cut = Math.floor(Math.random() * currentMax);
        if(cut < minCan && max > cut+minCan){
            cut += minCan;
        }
        if(i == colorList.length-1) cut = max;
        max -= cut;
        color.r += element.r*cut/100;
        color.g += element.g*cut/100;
        color.b += element.b*cut/100;
        showColor(element);
        console.log(cut);

    }
    
    showColor(color);*/
    let colorList = [];

    let red = new Color();
    red.r = 255;
    red.g = 0;
    red.b = 0;

    let green = new Color();
    green.r = 0;
    green.g = 255;
    green.b = 0;

    let blue = new Color();
    blue.r = 0;
    blue.g = 0;
    blue.b = 255;

    colorList.push(red,green,blue);


    let max = 100;
    let maxCan = 70;
    let minCan = 10;

    let color = new Color(true);
    


    for(let i = 0; i < colorList.length; i++){
        let currentMax = max;
        let element = colorList[i];

        if(max > maxCan) currentMax = maxCan;
        let cut = Math.floor(Math.random() * currentMax);
        if(cut < minCan && max > cut+minCan){
            cut += minCan;
        }
        if(i == colorList.length-1) cut = max;
        max -= cut;
        color.r += element.r*cut/100;
        color.g += element.g*cut/100;
        color.b += element.b*cut/100;
        showColor(element);
        console.log(cut);

    }

    showColor(color);

    
  
}

let pos = 1;
function showColor(color){

    colorContext.beginPath();
    colorContext.fillStyle ='rgb('+color.r+','+color.g+','+color.b+')';
    colorContext.fillRect(120*pos, 20, 80, 100);
    colorContext.stroke();
    colorContext.stroke();
    colorContext.fillStyle ='#FFFFFF';
    colorContext.font = "16px Arial";
    colorContext.fillText(Math.floor(color.r) +" "+Math.floor(color.g) +" "+Math.floor(color.b), 120*pos, 150);
    pos++;
    
}


class Color{
    constructor(reset){
        this.r = this.getRandomColor();
        this.g = this.getRandomColor();
        this.b = this.getRandomColor();
        if(reset){
            this.r = 0;
            this.g = 0;
            this.b = 0;
        }
    }
    getRandomColor(){
        return Math.floor(Math.random() * 256);
    }

}



//
