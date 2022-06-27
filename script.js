function colorsChanged(){
    const label = document.getElementById('labelColors');
    const input = document.getElementById('inputColors');

    label.innerHTML = "Number of Colors -> "+input.value;
}

function blackChanged(){
    const label = document.getElementById('labelBlack');
    const input = document.getElementById('inputBlackThreshold');

    label.innerHTML = "Black Threshold ->"+input.value;
}

function minMaxChanged(){
    const label = document.getElementById('labelMinMax');
    const input = document.getElementById('inputMinMax');

    label.innerHTML = "Min Max Scale ->"+input.value/100;
}

function colorWeightChanged(){
    const label = document.getElementById('labelColorWeight');
    const input = document.getElementById('inputColorWeight');

    label.innerHTML = "Min Color Weight ->"+input.value/100;
}

function maxColorChanged(){
    const label = document.getElementById('labelMaxColor');
    const input = document.getElementById('inputMaxColor');

    label.innerHTML = "Max Color Difference ->"+input.value;
}