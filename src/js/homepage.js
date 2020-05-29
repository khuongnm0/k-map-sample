// HOMEPAGE

// Helper Load JSON from Local path
async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

function getGreenToRed(percent) {
  let r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
  let g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
  return 'rgb(' + r + ',' + g + ',0)';
}

// function invoke when callback from google API
function initMapGoogle() {
  const mapGoogle = new google.maps.Map(document.getElementById('mapGoogle'), {
    zoom: 6,
    center: { lat: 53, lng: -2 } // England
  });

  var infowindow = new google.maps.InfoWindow({
    content: `<div>Test marker.<br> Clickable !</div>`
  });

  const marker = new google.maps.Marker({
    position: { lat: 51.5, lng: -0.09 },
    map: mapGoogle,
    title: 'Test marker.<br> Clickable !'
  });
  marker.addListener('click', function () {
    infowindow.open(mapGoogle, marker);
  });


  // Load GeoJSON.
  mapGoogle.data.loadGeoJson(
    './assets/json/wpc.json'
  );

  // Set the stroke width, and fill color for each polygon
  mapGoogle.data.setStyle(
    function (feature) {
      // let color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

      let percent = Math.floor(Math.random() * 100);
      // console.log('percent: ', percent);

      let color = getGreenToRed(percent)
      // console.log('color: ', color);

      return {
        fillColor: color,
        strokeWeight: 1

      };
    }
  );

  // Add listener click event
  mapGoogle.data.addListener('click', function (event) {

    let PCON13CD = event.feature.getProperty('PCON13CD');
    let PCON13CDO = event.feature.getProperty('PCON13CDO');
    let PCON13NM = event.feature.getProperty('PCON13NM');

    console.log('PCON13CD: ', PCON13CD);
    console.log('PCON13CDO: ', PCON13CDO);
    console.log('PCON13NM: ', PCON13NM);

    // let percent = Math.floor(Math.random() * 100);
    // console.log('percent: ', percent);

    // let newColor = getGreenToRed(percent)
    // console.log('color: ', newColor);

    // mapGoogle.data.overrideStyle(event.feature, { fillColor: newColor }); // override current style with new color

  });


  window.mapGoogle = mapGoogle;
  setTimeout(() => {
    $('#cbLayer').attr('disabled', false);
  }, 3000)
}


function renderLayerToLeafletMap() {
  loadJSON('./assets/json/wpc.json').then(data => {
    if (!window.dataJSON) {
      window.dataJSON = data;
    }

    // Render to Leaflet
    L.geoJSON(dataJSON,
      {
        style: function (feature) {
          let percent = Math.floor(Math.random() * 100);
          let color = getGreenToRed(percent)
          return {
            fillColor: color,
            color: '#000', // Stroke color
            weight: 1 // Stroke weight
          };
        },
        onEachFeature: function (feature, layer) {
          layer.myTag = "myGeoJSON"
        }

      }
    ).addTo(window.mapLeaflet);
  });

}

function removeLayerOnLeafletMap() {
  window.mapLeaflet.eachLayer(function (layer) {
    if (layer.myTag && layer.myTag === "myGeoJSON") {
      window.mapLeaflet.removeLayer(layer)
    }
  });
}

function initMapLeaflet() {
  window.mapLeaflet = L.map('mapLeaflet', {
    center: [53, -2],
    zoom: 6
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(window.mapLeaflet);

  L.marker([51.5, -0.09]).addTo(window.mapLeaflet)
    .bindPopup('Test marker.<br> Clickable !')
  //   .openPopup();

  renderLayerToLeafletMap();
}



function showData() {
  loadJSON('./assets/json/data.json').then(data => {

    const Sheet1 = data.Sheet1;
    Sheet1.forEach(el => {
      // console.log('LSOA Name: ', el['LSOA Name']);

      // console.log('Index of Multiple Deprivation Decile: ', el['Index of Multiple Deprivation Decile']);

    })
  });
}

showData();


$(document).ready(() => {
  // console.log("ready!");
  initMapLeaflet();

  $('#cbLayer').on('change', function (event) {
    let _this = $(this);
    let isChecked = _this.prop('checked');
    console.log('isChecked: ', isChecked);

    if (isChecked) {
      window.mapGoogle.data.setMap(window.mapGoogle);

      renderLayerToLeafletMap();

    } else {
      window.mapGoogle.data.setMap(null);

      removeLayerOnLeafletMap();
    }
  })
});
