const selectNames = document.getElementById("selectColorName");


for (const color of colors) {
    const option = document.createElement("option");
    option.style="color:"+rgbToHex(color.r,color.g,color.b)+";"  + ((color.r+color.g+color.b > 500)?"background-color: black;":"background-color: white;");
    option.value = color.name;
    option.text = color.name;
    selectNames.add(option);
}

function search() {

    const checkSearchName = document.getElementById('checkSearchName');

    const images = [];
    let pickedColor;
    if (checkSearchName.checked) {
        const name = document.getElementById('selectColorName').value;
        for(const color of colors){
            if(color.name == name){
                pickedColor = color;
                break;
            }
        }

        //Incase the color is deleted from the array but still is in images
        if(pickedColor == null){
            for (const palette of imagePalettes) {
                for (const weightedColor of palette.colors) {
                    if (weightedColor.color.name == name) {
                        images.push({ weight: weightedColor.weight, palette: palette });
                        break;
                    }
                }
            }
        }

    }
    else {
        pickedColor = HexToRGB(document.getElementById('inputColor').value);
    }
    if(pickedColor != null){
        const colorWeight = document.getElementById('inputColorWeight');
        const maxColor = document.getElementById('inputMaxColor');
        const maxDifference = maxColor.value;
        const minWeight = colorWeight.value/100;

        for (const palette of imagePalettes) {
            for (const weightedColor of palette.colors) {
                const diff = Math.sqrt(Math.pow((pickedColor.r - weightedColor.color.r),2) + Math.pow((pickedColor.g - weightedColor.color.g),2) + Math.pow((pickedColor.b - weightedColor.color.b),2));
                if (diff <= maxDifference && minWeight <= weightedColor.weight) {
                    const per = 1 - diff/(255*3);
                    images.push({ weight: weightedColor.weight + per, palette: palette });
                    break;
                }
            }
        }
    }

    

    images.sort(function(a, b) { return a.weight > b.weight ? -1 : 1});

    document.getElementById("canvasSearchResults").innerHTML = "";

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const canvasResults = document.createElement("canvas");

        canvasResults.setAttribute("id","canvas"+image.palette.name);
        document.getElementById("canvasSearchResults").appendChild(canvasResults);
    
        canvasResults.width = 100;
        canvasResults.height = 120;

        const context = canvasResults.getContext('2d');
        context.stroke();
        context.fillStyle = '#000000';
        context.font = "16px Arial";
        context.fillText(i+1, canvasResults.width/2, 115);

        var img = new Image();
        img.src = 'Images/'+image.palette.name+".jpg";
        img.canvasID = canvasResults.getAttribute("id");
        img.onload = function () {
            const canvas = document.getElementById(this.canvasID);
            canvas.getContext('2d').drawImage(this, 0, 0, 100, 100);
        };

    }
}