var bodyRef = document.querySelector('body');
var inputRef = document.querySelectorAll('.inputMaterial');

inputRef[0].addEventListener('input', convertHexToRgb);
inputRef[1].addEventListener('input', convertRgbToHex);

function convertHexToRgb() {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    let hex = inputRef[0].value.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgbObject = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;

    if (rgbObject && rgbObject.r > -1 && rgbObject.r < 256 && rgbObject.g > -1 && rgbObject.g < 256 && rgbObject.b > -1 && rgbObject.b < 256) {
        setRgbStyle([rgbObject.r, rgbObject.g, rgbObject.b], 1);
    } else {
        setDefaultStyle(1);
    }

}

function convertRgbToHex() {
    
    let rgbRegex = /rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/i;
    var match = rgbRegex.exec(inputRef[1].value);
    if (match !== null) {
        setRgbStyle([match[1], match[2], match[3]], 0);
    } else {
        setDefaultStyle(0);
    }
}

function setRgbStyle(rgbArray, index) {
    let rgb = '';
    if(index === 1) {
        rgb = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
    } else if(index === 0) {
        rgb = "#" + ((1 << 24) + (+rgbArray[0] << 16) + (+rgbArray[1] << 8) + +rgbArray[2]).toString(16).slice(1);
    }
    console.log("rgb: " + rgb);
    bodyRef.style.backgroundColor = rgb;
    inputRef[index].value = rgb;
    if (isLight(rgbArray)) {
        bodyRef.classList.add("light-theme");
    } else {
        bodyRef.classList.remove("light-theme");
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function isLight(rgbArray) {
    let hsp = Math.sqrt( // HSP equation from http://alienryderflex.com/hsp.html
        0.299 * (rgbArray[0] * rgbArray[0]) +
        0.587 * (rgbArray[1] * rgbArray[1]) +
        0.114 * (rgbArray[2] * rgbArray[2])
    );
    if (hsp > 127.5) {
        return true;
    }
    return false;
}

function setDefaultStyle(index) {
    bodyRef.style.backgroundColor = null;
    inputRef[index].value = null;
    if (bodyRef.className.split(" ").includes("light-theme")) {
        bodyRef.classList.remove("light-theme")
    }
}
