//Local file can't be loaded
function setPreviewImage() {
    const input = document.getElementById("inputImage");
    const canvas = document.getElementById("imgPreview");
    const context = canvas.getContext('2d');

    const image = new Image();
    image.src = input.value;
    image.onload = function () {
        context.drawImage(image, 0, 0);
    }
}

var index = 1;

function changeImage() {
    index = ((index + 1) % 5); index = (index == 0)? 5 : index; 
    const input = document.getElementById("imgSource");
    input.src = "Images/rIcon" + index + ".jpg";
}

function submit() {
    const checkCropBorder = document.getElementById('checkCropBorder');                         

    const img = document.getElementById('imgSource');
    cropIconBorder = (img.width*6.25)/100;
    //const canvas = document.createElement("canvas");
    const canvas = document.getElementById('canvasPreview');
    canvas.width = img.width;
    canvas.height = img.height;
    if(checkCropBorder.checked){
        canvas.getContext('2d').drawImage(
            img, 
            cropIconBorder, 
            cropIconBorder,
            img.width-cropIconBorder*2,
            img.height-cropIconBorder*2,
            0,
            0,
            img.width,
            img.height);
    }
    else{
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    }

    generatePalette(canvas);
}


function generatePalette(canvas) {
    const inputColors = document.getElementById('inputColors');
    const inputBlackThreshold = document.getElementById('inputBlackThreshold');
    const inputMinMax = document.getElementById('inputMinMax');
    const checkLeastDeviation = document.getElementById('checkLeastDeviation');
    //Number of buckets/ number of colors that pallette will contain
    var colorAmount = parseInt(inputColors.value);
    //Filters out pixels that are darker than the blackValue
    var blackThreshold = parseInt(inputBlackThreshold.value);
    //
    var useLeastDeviation = checkLeastDeviation.checked;
    //This helps the last bucket to have more pixels. 0.75-1.00 advised.
    var mainMaxScale = inputMinMax.value/100;

    const redData = { average:0, max:0 };
    const greenData = { average:0, max:0 };
    const blueData = { average:0, max:0 };

    //Pixels
    var rgbs = [];

    const context = canvas.getContext('2d');

    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {

            var pixel = context.getImageData(x, y, 1, 1);
            var data = pixel.data;
            if (data[0] < blackThreshold && data[1] < blackThreshold && data[2] < blackThreshold) continue;

            rgbs.push(data);

            redData.average += data[0];
            greenData.average += data[1];
            blueData.average += data[2];

            if (redData.max < data[0]) redData.max = data[0];
            if (greenData.max < data[1]) greenData.max = data[1];
            if (blueData.max < data[2]) blueData.max = data[2];
        }
    }

    redData.average /= rgbs.length;
    greenData.average /= rgbs.length;
    blueData.average /= rgbs.length;

    const {mainMax, mainColor} = getMainColorWithStandartDeviation(rgbs, redData, blueData, greenData, useLeastDeviation);

    var buckets = bucketSort(rgbs, colorAmount, mainMaxScale, mainMax, mainColor);

    //Sort by how much pixels each bucket contains higher to lower
    buckets = insertSortLength(buckets);

    DrawPalette(buckets);

}

function DrawPalette(buckets) {
    const canvasPalette = document.getElementById("canvasPalette");
    const contextPalette = canvasPalette.getContext('2d');

    canvasPalette.width = buckets.length * 160;
    canvasPalette.height = 200;

    let totalPixels = 0;
    for (const bucket of buckets) {
        totalPixels += bucket.length;
    }

    const palette = [];

    for (let i = 0; i < buckets.length; i++) {
        let averageR = 0;
        let averageG = 0;
        let averageB = 0;
        for (let j = 0; j < buckets[i].length; j++) {
            averageR += buckets[i][j][0];
            averageG += buckets[i][j][1];
            averageB += buckets[i][j][2];
        }

        //Draw Colors
        averageR = Math.floor(averageR / buckets[i].length);
        averageG = Math.floor(averageG / buckets[i].length);
        averageB = Math.floor(averageB / buckets[i].length);
        let percentage = Math.round((buckets[i].length/totalPixels)*1000)/1000;
        //console.log("Bucket " + i + " length " + buckets[i].length + " R " + averageR + " G " + averageG + " B " + averageB);
        contextPalette.beginPath();
        contextPalette.fillStyle = 'rgb(' + averageR + ',' + averageG + ',' + averageB + ')';
        contextPalette.fillRect(i * 130, 20, 80, 100);
        contextPalette.stroke();
        contextPalette.fillStyle = '#000000';
        contextPalette.font = "16px Arial";
        contextPalette.fillText(GetColorName(averageR, averageG, averageB), i * 130, 150);
        contextPalette.fillText(percentage, i * 130, 170);

        palette.push({weight:percentage,color:new Color(averageR,averageG,averageB,GetColorName(averageR, averageG, averageB))});
    }

    console.log(JSON.stringify(palette));
}

function GetColorName(r, g, b) {
    var name = "";
    var approx = 512;
    for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        var newApprox = Math.abs((color.r - r)) + Math.abs((color.g - g)) + Math.abs((color.b - b));
        if (newApprox < approx) {
            approx = newApprox;
            name = color.name;
        }
    }
    return name;
}

//Uses Standart Deviation to determine the main color of the bucket sorting
function getMainColorWithStandartDeviation(rgbs, redData, blueData, greenData, useLeastDeviation) {
    let rVariance = 0;
    let gVariance = 0;
    let bVariance = 0;
    for (i = 0; i < rgbs.length; i++) {
        rVariance += Math.pow(rgbs[i][0] - redData.average, 2);
        gVariance += Math.pow(rgbs[i][1] - greenData.average, 2);
        bVariance += Math.pow(rgbs[i][2] - blueData.average, 2);
    }

    rVariance /= rgbs.length;
    gVariance /= rgbs.length;
    bVariance /= rgbs.length;

    rDeviaton = Math.sqrt(rVariance);
    gDeviaton = Math.sqrt(gVariance);
    bDeviaton = Math.sqrt(bVariance);

    /*console.log(rDeviaton);
    console.log(gDeviaton);
    console.log(bDeviaton);*/


    maxDev = 0;
    if (rDeviaton > maxDev) {
        maxDev = rDeviaton;
        mainMax = redData.max;
        mainColor = 0;
    }

    if (gDeviaton > maxDev) {
        maxDev = gDeviaton;
        mainMax = greenData.max;
        mainColor = 1;
    }

    if (bDeviaton > maxDev) {
        maxDev = bDeviaton;
        mainMax = blueData.max;
        mainColor = 2;
    }

    if (useLeastDeviation) {
        if (rDeviaton < maxDev) {
            maxDev = rDeviaton;
            mainMax = redData.max;
            mainColor = 0;
        }
        if (gDeviaton < maxDev) {
            maxDev = gDeviaton;
            mainMax = greenData.max;
            mainColor = 1;
        }
        if (bDeviaton < maxDev) {
            maxDev = bDeviaton;
            mainMax = blueData.max;
            mainColor = 2;
        }
    }

    return {mainMax, mainColor};
}


function bucketSort(array, k, mainMaxScale, mainMax, mainColor) {
    var buckets = [];
    for (let i = 0; i < k; i++) {
        buckets.push([]);
    }
    M = mainMax * mainMaxScale;

    for (let i = 0; i < array.length; i++) {
        var position = Math.floor((k - 1) * array[i][mainColor] / M);
        if (position > k - 1) position = k - 1;
        buckets[position].push(array[i]);
    }


    return buckets;
}



function insertSortLength(buckets) {
    let i = 1;
    while (i < buckets.length) {
        let j = i;
        while (j > 0 && buckets[j - 1].length < buckets[j].length) {
            let temp = buckets[j];
            buckets[j] = buckets[j - 1];
            buckets[j - 1] = temp;
            j--;
        }
        i++;
    }

    return buckets;
}