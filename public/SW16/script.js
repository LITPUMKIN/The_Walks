let imageModelURL = 'https://teachablemachine.withgoogle.com/models/4OqCfHj6B/';

let classifier;
let video;
let canvas;
let label = "To Start SoundWalk 16";
let label2 = "Take a Picture of Your Surrounding Non-Place"
let label3 = "pictures will be collected in the map below"
let results = [];
let isPictureTaken = false;
let capturedImage;
let geolocation = { latitude: null, longitude: null };
let capturedImageDataURL;
let map;
let locationIcon;

let togglePicButton = document.getElementById('togglePicture');
let supermkton = document.getElementById('supermkt');
let gason = document.getElementById('gas');
let trafficon = document.getElementById('traffic');
let subwayon = document.getElementById('subway');

//p5.js preload section
function preload() {
    ml5.setBackend("webgl");
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');

    supermarketSound = loadSound('./sound/supermarket2.mp3');
    supermarketAmbientSound = loadSound('./sound/supermarket.mp3');
    gasStationSound = loadSound('./sound/gasstation2.mp3');
    gasStationAmbientSound = loadSound('./sound/gasstation.mp3');
    trafficLightSound = loadSound('./sound/trafficlight2.mp3');
    trafficLightAmbientSound = loadSound('./sound/trafficlight.mp3');
    subwaySound = loadSound('./sound/subway2.mp3');
    subwayAmbientSound = loadSound('./sound/subway.mp3');
}

function setup() {
    canvas = createCanvas(getCanvasWidth(), getCanvasHeight());
    canvas.parent('p5-container');
    background(255);

    video = createCapture(VIDEO, { flipped: true });
    video.size(getCanvasWidth(), getCanvasHeight());
    video.hide();

    togglePicButton.addEventListener('click', function () {
        if (!isPictureTaken) {
            takePicture();
        } else {
            retakePicture();
        }
    });

    togglePicButton.style.width = canvas.width + 'px';

    initializeMap();
    loadAllPictures();
}

function draw() {
    background(100);

    if (!isPictureTaken) {
        image(video, 0, 0);
    } else {
        image(capturedImage, 0, 0);
        pixelateImage(capturedImage, 20);
        displayResults();
    }

    // Adjust text size based on window dimensions
    let labelTextSize = windowWidth * 0.018;
    let geoTextSize = windowWidth * 0.03;

    textSize(labelTextSize);
    textAlign(CENTER, CENTER);
    textStyle(BOLDITALIC);
    fill(0, 255, 0);
    text(label, width / 2, height / 2);
    
    if (geolocation.latitude === null && geolocation.longitude === null) {
        text(label2, width / 2, height / 2 + 35);
        text(label3, width / 2, height / 2 +70);
    }

    if (geolocation.latitude !== null && geolocation.longitude !== null) {
        textSize(geoTextSize);
        textAlign(CENTER, CENTER);
        text(`${geolocation.latitude.toFixed(10)}, ${geolocation.longitude.toFixed(10)}`, width / 2, height / 2 + 40);
    }
}

// visuals
function takePicture() {
    capturedImage = createImage(video.width, video.height);
    capturedImage.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    capturedImage.loadPixels();
    capturedImageDataURL = capturedImage.canvas.toDataURL();
    isPictureTaken = true;

    togglePicButton.textContent = 'Retake Picture';
    getGeolocation();
}

function retakePicture() {
    isPictureTaken = false;
    results = [];
    geolocation = { latitude: null, longitude: null };

    togglePicButton.textContent = 'Take a Picture';

    supermkton.src = './img/supermkt.png';
    gason.src = './img/gas.png';
    trafficon.src = './img/traffic.png';
    subwayon.src = './img/subway.png';

    stopAllAmbientSounds();
}

function gotResult(output) {
    label = output[0].label;
    results = output;
    playAmbientSound();
}

function displayResults() {
    textSize(30);
    textAlign(CENTER, CENTER);
    textStyle(BOLDITALIC);
    fill(0, 255, 0);

    //  for (let i = 0; i < results.length; i++) {
    //     text(results[i].label, 10, 100 + i * 35);
    //     text(results[i].confidence, 10, 100 + i * 35 + 15);
    // }
}

function pixelateImage(img, gridSize) {
    img.loadPixels();

    for (let y = 0; y < img.height; y += gridSize) {
        for (let x = 0; x < img.width; x += gridSize) {
            let index = 4 * (x + y * img.width);
            let r = img.pixels[index + 0];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            for (let dy = 0; dy < gridSize; dy++) {
                for (let dx = 0; dx < gridSize; dx++) {
                    let pxIndex = 4 * ((x + dx) + (y + dy) * img.width);
                    img.pixels[pxIndex + 0] = r;
                    img.pixels[pxIndex + 1] = g;
                    img.pixels[pxIndex + 2] = b;
                    img.pixels[pxIndex + 3] = a;
                }
            }
        }
    }
    img.updatePixels();
}

// sound
function playAmbientSound() {
    stopAllAmbientSounds(); // Stop any currently playing sounds before playing the new one

    if (label == "Supermarket" && !supermarketAmbientSound.isPlaying()) {
        setTimeout(() => {
            supermarketSound.play();
        }, 3000);
        supermarketAmbientSound.setVolume(0.5);
        supermarketAmbientSound.play();
        supermkton.src = './img/supermkt_on.png';
    } else if (label == "GasStation" && !gasStationAmbientSound.isPlaying()) {
        setTimeout(() => {
            gasStationSound.play();
        }, 3000);
        gasStationAmbientSound.setVolume(0.5);
        gasStationAmbientSound.play();
        gason.src = './img/gas_on.png';
    } else if (label == "TrafficLight" && !trafficLightAmbientSound.isPlaying()) {
        setTimeout(() => {
            trafficLightSound.play();
        }, 3000);
        trafficLightAmbientSound.setVolume(0.5);
        trafficLightAmbientSound.play();
        trafficon.src = './img/traffic_on.png';
    } else if (label == "Subway" && !subwayAmbientSound.isPlaying()) {
        setTimeout(() => {
            subwaySound.play();
        }, 3000);
        subwayAmbientSound.setVolume(0.5);
        subwayAmbientSound.play();
        subwayon.src = './img/subway_on.png';
    }
}

// geolocations
function stopAllAmbientSounds() {
    if (supermarketAmbientSound.isPlaying()) supermarketAmbientSound.stop();
    if (gasStationAmbientSound.isPlaying()) gasStationAmbientSound.stop();
    if (trafficLightAmbientSound.isPlaying()) trafficLightAmbientSound.stop();
    if (subwayAmbientSound.isPlaying()) subwayAmbientSound.stop();
    if (supermarketSound.isPlaying()) supermarketSound.stop();
    if (gasStationSound.isPlaying()) gasStationSound.stop();
    if (trafficLightSound.isPlaying()) trafficLightSound.stop();
    if (subwaySound.isPlaying()) subwaySound.stop();
}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            geolocation.latitude = position.coords.latitude;
            geolocation.longitude = position.coords.longitude;
            classifier.classify(capturedImage, gotResult);
            addMarkerToMap();
            savePicture();
        }, (error) => {
            console.error('Error', error);
            classifier.classify(capturedImage, gotResult);
            addMarkerToMap();
            savePicture();
        });
    } else {
        console.error('Geolocation is not supported by this browser. Please allow Geolocation in the browser.');
        classifier.classify(capturedImage, gotResult);
        addMarkerToMap();
        savePicture();
    }
}

function initializeMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    locationIcon = L.icon({
        iconUrl: './img/location3.png',
        iconSize: [100, 100],
        iconAnchor: [50, 100],
        popupAnchor: [0, -70]
    });
}

function addMarkerToMap() {
    let marker = L.marker([geolocation.latitude, geolocation.longitude], { icon: locationIcon }).addTo(map);
    let imgElement = document.createElement('img');
    imgElement.src = capturedImageDataURL;
    imgElement.width = 200;
    marker.bindPopup(imgElement).openPopup();
    map.setView([geolocation.latitude, geolocation.longitude], 15);
}

function loadAllPictures() {
    fetch('/16_show')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                let imgElement = document.createElement('img');
                imgElement.src = item.dataURL;
                imgElement.width = 200;
                let marker = L.marker([item.latitude, item.longitude], { icon: locationIcon }).addTo(map);
                marker.bindPopup(imgElement).openPopup();
            });
        })
        .catch(error => console.error('Error fetching all pictures:', error));
}

function savePicture() {
    fetch('/16_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dataURL: capturedImageDataURL,
            latitude: geolocation.latitude,
            longitude: geolocation.longitude
        })
    }).catch(error => console.error('Error saving picture:', error));
}

function windowResized() {
    resizeCanvas(getCanvasWidth(), getCanvasHeight());
    video.size(getCanvasWidth(), getCanvasHeight());
    togglePicButton.style.width = canvas.width + 'px';
}

function getCanvasWidth() {
    const maxWidth = windowWidth / 2;
    const aspectRatio = 640 / 480;
    return Math.min(maxWidth, windowHeight * aspectRatio);
}

function getCanvasHeight() {
    const maxHeight = windowHeight / 2;
    const aspectRatio = 480 / 640;
    return Math.min(maxHeight, windowWidth * aspectRatio);
}

function hideElementById(id) {
    document.getElementById(id).style.display = 'none';
}

function showElementById(id) {
    document.getElementById(id).style.display = 'block';
}
