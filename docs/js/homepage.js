"use strict";

// HOMEPAGE JSvar map;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {
      lat: 50,
      lng: 0
    }
  });
  console.log('asda'); // Load GeoJSON.

  map.data.loadGeoJson('https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/eng/wpc.json'); // Set the stroke width, and fill color for each polygon

  map.data.setStyle( //   {
  //   fillColor: 'green',
  //   strokeWeight: 1
  // }
  function (feature) {
    var PCON13CD = feature.getProperty('PCON13CD');
    var PCON13CDO = feature.getProperty('PCON13CDO');
    var PCON13NM = feature.getProperty('PCON13NM');
    var color = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return {
      fillColor: color,
      strokeWeight: 1
    };
  }); // Add listener click event

  map.data.addListener('click', function (event) {
    var newColor = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    console.log('newColor: ', newColor);
    map.data.overrideStyle(event.feature, {
      fillColor: newColor
    }); // override current style with new color
  });
}