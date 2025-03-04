//-----------------------------------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------------------------------

let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');

let form = document.querySelector('#postform');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';
let networkDataReceived = false;
let locationButton = document.querySelector('#location-btn');
let locationLoader = document.querySelector('#location-loader');
let mapDiv = document.querySelector('#map');
let fetchedLocation;

//-----------------------------------------------------------------------------------------------
// Add Events
//-----------------------------------------------------------------------------------------------

shareImageButton.addEventListener('click', openCreatePostModal);
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
document.querySelector('#uploadPictureSave').addEventListener('click', event => {
    event.preventDefault(); //mal testen mit Installierter App ob an oder aus
    uploadPictureClick();
});
captureButton.addEventListener('click', event => {
    event.preventDefault(); // nicht absenden und neu laden
    takePhoto();
});
locationButton.addEventListener('click', event => {
    getLocation();
});
imagePicker.addEventListener('change', event => {
    file = event.target.files[0];
});


//-----------------------------------------------------------------------------------------------
// Functions 
//-----------------------------------------------------------------------------------------------

function openCreatePostModal() {
    setTimeout(() => {
        createPostArea.style.transform = 'translateY(0)';
    }, 1);
    initializeMedia();
    initializeLocation();
    
}

function closeCreatePostModal() {
    imagePickerArea.style.display = 'none';
    videoPlayer.style.display = 'none';
    canvasElement.style.display = 'none';
    locationButton.style.display = 'inline';
    locationLoader.style.display = 'none';
    if (videoPlayer.srcObject) {
        videoPlayer.srcObject.getVideoTracks().forEach(track => track.stop());
    }
    setTimeout(() => {
        createPostArea.style.transform = 'translateY(100vH)';
    }, 1);
}

function initializeLocation() {
    if(!('geolocation' in navigator)) {
        locationButton.style.display = 'none';
    }
}

function initializeMedia() {
    if (!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if (!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented'));
            }

            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
        })
        .catch(err => {
            imagePickerArea.style.display = 'block';
        });
}

function updateUI(data) {

    for (let card of data) {
        console.log(card);
        createCard(card);
    }
}

function sendDataToBackend() {
    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('location', locationValue);
    formData.append('file', file);

    console.log('formData', formData)

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Data sent to backend ...', response);
            return response.json();
        })
        .then(data => {
            console.log('data ...', data);
            const newPost = {
                title: data.title,
                location: data.location,
                image_id: imageURI
            }
            updateUI([newPost]);
        });
}

function getLocation() {
    if(!('geolocation' in navigator)) {
        return;
    }

    locationButton.style.display = 'none';
    locationLoader.style.display = 'block';

    navigator.geolocation.getCurrentPosition( position => {
        locationButton.style.display = 'inline';
        locationLoader.style.display = 'none';
        fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        console.log('current position: ', fetchedLocation);

        let nominatimURL = 'https://nominatim.openstreetmap.org/reverse'; 
        nominatimURL += '?format=jsonv2';   // format=[xml|json|jsonv2|geojson|geocodejson]
        nominatimURL += '&lat=' + fetchedLocation.latitude;
        nominatimURL += '&lon=' + fetchedLocation.longitude;

        fetch(nominatimURL)
            .then((res) => {
                console.log('nominatim res ...', res);
                return res.json();
            })
            .then((data) => {
                console.log('nominatim res.json() ...', data);
                locationInput.value = data.display_name;
            })
            .then( d => {
                locationButton.style.display = 'none';
                locationLoader.style.display = 'none';
                mapDiv.style.display = 'block';

                const map = new ol.Map({
                    target: 'map',
                    layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                    ],
                    view: new ol.View({
                        center: ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]),
                        zoom: 12
                    })
                });

                const layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]))
                            })
                        ]
                    })
                });

                map.addLayer(layer);

                console.log('map', map)
            })
            .catch( (err) => {
                console.error('err', err)
                locationInput.value = 'In Berlin';
            });

        document.querySelector('#manual-location').classList.add('is-focused');
    }, err => {
        console.log(err);
        locationButton.style.display = 'inline';
        locationLoader.style.display = 'none';
        alert('Couldn\'t fetch location, please enter manually!');
        fetchedLocation = null;
    }, { timeout: 5000}); 
}

function takePhoto() {
    canvasElement.style.display = 'block';
    videoPlayer.style.display = 'none';
    captureButton.style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
    videoPlayer.srcObject.getVideoTracks().forEach(track => {
        track.stop();
    })
    imageURI = canvas.toDataURL("image/jpeg");

    fetch(imageURI)
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            file = new File([blob], "myFile.jpeg", { type: "image/jpeg" })
            console.log('file', file)
        })
}

function uploadPictureClick() {

    const file = document.querySelector('#image-picker');
    const titleInput = document.querySelector('#title');
    const locationInput = document.querySelector('#location');

    if (document.querySelector('#image-picker') == null) {
        alert('Erst Foto aufnehmen!')
        return;
    }
    if (document.querySelector('#title').value.trim() === '' || document.querySelector('#location').value.trim() === '') {
        alert('Bitte Titel und Location angeben!')
        return;
    }

    closeCreatePostModal();

    titleValue = titleInput.value;
    locationValue = locationInput.value;
    fileUpload = file.files;

    sendDataToBackend();
}

function createCard(card) {
    let cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    let cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    let image = new Image();
    image.src = card.image_id;
    cardTitle.style.backgroundImage = 'url(' + image.src + ')';
    cardTitle.style.backgroundSize = 'cover';
    //cardTitle.style.height = '180px';
    cardWrapper.appendChild(cardTitle);
    let cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = card.title;
    cardTitle.appendChild(cardTitleTextElement);
    let cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = card.location;
    cardSupportingText.style.textAlign = 'center';
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

fetch('http://localhost:3000/posts')
    .then((res) => {
        networkDataReceived = true;
        return res.json();
    })
    .then((data) => {
        console.log('From backend ...', data);
        updateUI(data);
    })
    .catch((err) => {
        if ('indexedDB' in window) {
            readAllData('posts')
                .then(data => {
                    console.log("network Online: ", networkDataReceived)
                    if (!networkDataReceived) {
                        console.log('From cache ...', data);
                        updateUI(data);
                    }
                })
        }
    });




