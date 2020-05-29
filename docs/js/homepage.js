"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// HOMEPAGE
// Helper Load JSON from Local path
function loadJSON(_x) {
  return _loadJSON.apply(this, arguments);
}

function _loadJSON() {
  _loadJSON = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(path);

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.json();

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadJSON.apply(this, arguments);
}

function getGreenToRed(percent) {
  var r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
  var g = percent > 50 ? 255 : Math.floor(percent * 2 * 255 / 100);
  return 'rgb(' + r + ',' + g + ',0)';
} // function invoke when callback from google API


function initMapGoogle() {
  var mapGoogle = new google.maps.Map(document.getElementById('mapGoogle'), {
    zoom: 6,
    center: {
      lat: 53,
      lng: -2
    } // England

  });
  var infowindow = new google.maps.InfoWindow({
    content: "<div>Test marker.<br> Clickable !</div>"
  });
  var marker = new google.maps.Marker({
    position: {
      lat: 51.5,
      lng: -0.09
    },
    map: mapGoogle,
    title: 'Test marker.<br> Clickable !'
  });
  marker.addListener('click', function () {
    infowindow.open(mapGoogle, marker);
  }); // Load GeoJSON.

  mapGoogle.data.loadGeoJson('./assets/json/wpc.json'); // Set the stroke width, and fill color for each polygon

  mapGoogle.data.setStyle(function (feature) {
    // let color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    var percent = Math.floor(Math.random() * 100); // console.log('percent: ', percent);

    var color = getGreenToRed(percent); // console.log('color: ', color);

    return {
      fillColor: color,
      strokeWeight: 1
    };
  }); // Add listener click event

  mapGoogle.data.addListener('click', function (event) {
    var PCON13CD = event.feature.getProperty('PCON13CD');
    var PCON13CDO = event.feature.getProperty('PCON13CDO');
    var PCON13NM = event.feature.getProperty('PCON13NM');
    console.log('PCON13CD: ', PCON13CD);
    console.log('PCON13CDO: ', PCON13CDO);
    console.log('PCON13NM: ', PCON13NM); // let percent = Math.floor(Math.random() * 100);
    // console.log('percent: ', percent);
    // let newColor = getGreenToRed(percent)
    // console.log('color: ', newColor);
    // mapGoogle.data.overrideStyle(event.feature, { fillColor: newColor }); // override current style with new color
  });
  window.mapGoogle = mapGoogle;
  setTimeout(function () {
    $('#cbLayer').attr('disabled', false);
  }, 3000);
}

function renderLayerToLeafletMap() {
  loadJSON('./assets/json/wpc.json').then(function (data) {
    if (!window.dataJSON) {
      window.dataJSON = data;
    } // Render to Leaflet


    L.geoJSON(dataJSON, {
      style: function style(feature) {
        var percent = Math.floor(Math.random() * 100);
        var color = getGreenToRed(percent);
        return {
          fillColor: color,
          color: '#000',
          // Stroke color
          weight: 1 // Stroke weight

        };
      },
      onEachFeature: function onEachFeature(feature, layer) {
        layer.myTag = "myGeoJSON";
      }
    }).addTo(window.mapLeaflet);
  });
}

function removeLayerOnLeafletMap() {
  window.mapLeaflet.eachLayer(function (layer) {
    if (layer.myTag && layer.myTag === "myGeoJSON") {
      window.mapLeaflet.removeLayer(layer);
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
  L.marker([51.5, -0.09]).addTo(window.mapLeaflet).bindPopup('Test marker.<br> Clickable !'); //   .openPopup();

  renderLayerToLeafletMap();
}

function showData() {
  loadJSON('./assets/json/data.json').then(function (data) {
    var Sheet1 = data.Sheet1;
    Sheet1.forEach(function (el) {// console.log('LSOA Name: ', el['LSOA Name']);
      // console.log('Index of Multiple Deprivation Decile: ', el['Index of Multiple Deprivation Decile']);
    });
  });
}

showData();
$(document).ready(function () {
  // console.log("ready!");
  initMapLeaflet();
  $('#cbLayer').on('change', function (event) {
    var _this = $(this);

    var isChecked = _this.prop('checked');

    console.log('isChecked: ', isChecked);

    if (isChecked) {
      window.mapGoogle.data.setMap(window.mapGoogle);
      renderLayerToLeafletMap();
    } else {
      window.mapGoogle.data.setMap(null);
      removeLayerOnLeafletMap();
    }
  });
});