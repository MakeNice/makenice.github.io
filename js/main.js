var svg, popup, popupHeader, popupBody, mask, copyJSON;


function loadCopy(cb) {
    var xmlhttp = new XMLHttpRequest();
    var url = 'data/copy.json';

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            copyJSON = JSON.parse(this.responseText);
            ;cb();
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}

function setUpLayer(layer, name) {
    //layer.setAttribute("fill", "transparent")
    layer.onclick = function () {

        var copy = copyJSON.hotspots[name];

        if (copy) {

            //show popup!
            mask.classList.add('visible');

            popupHeader.innerText = copy.title;
            popupBody.innerText = copy.body;
            popup.style.opacity = '1';
        }
    }
}

function parseSVG() {

    var hotspots = [];
    var layers = svg.childNodes;
    for (var i = 0; i < layers.length; i++) {

        var name = layers[i].id;
        console.log(name)
        if (name && name.indexOf('hotspot') != -1) {
            var layerName = name.split('-')[1];
            hotspots.push(layers[i]);
            setUpLayer(layers[i], layerName);
        }
    }


    mask = document.getElementsByClassName('mask')[0];

    //hide popup on background click
    mask.onclick = function () {
        mask.classList.remove('visible');
        mask.style.display = 'none';
        popup.style.opacity = '0';
    };

    popup = document.getElementsByClassName('popup')[0];
    popupHeader = popup.getElementsByTagName('header')[0];
    popupBody = popup.getElementsByTagName('p')[0];

}


function checkReady() {
    var embed = document.getElementsByTagName('embed')[0];
    var doc = embed.getSVGDocument();
    if (doc == null) {
        setTimeout(checkReady, 300);
    } else {
        loadCopy(function () {
            svg = doc.getElementsByTagName('svg')[0];
            parseSVG();
        });
    }
}

checkReady();