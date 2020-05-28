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
function initMap() {
  const mapGoogle = new google.maps.Map(document.getElementById('mapGoogle'), {
    zoom: 6,
    center: { lat: 53, lng: -2 } // England
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


}


function initMapLeaflet() {
  const mapLeaflet = L.map('mapLeaflet', {
    center: [53, -2],
    zoom: 6
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapLeaflet);

  // L.marker([51.5, -0.09]).addTo(mapLeaflet)
  //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //   .openPopup();



  loadJSON('./assets/json/wpc.json').then(data => {
    const dataJSON = data;
    console.log('dataJSON: ', dataJSON);

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
        }
      }
    ).addTo(mapLeaflet);
  });


}



initMapLeaflet();

