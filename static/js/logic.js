console.log("logic.js loaded");

function markerSize(magnitude) {
  return magnitude * 50000;
}

function markerColor(depth) {
  return  depth > 90 ? "#FF0000" :
          depth > 70 ? "#FFC0CB" :
          depth > 50 ? "#FFA500" :
          depth > 30 ? "#FFFF00" :
          depth > 10 ? "#ADFF2F" :
                       "#ADFF2F";
}



// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";



// Get data with d3
d3.json(geoData).then(function(data) {
  
  var features = data.features;
  console.log(features);

  

// Create map object


var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: streetmap
});


  // Adding tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

var earthquakeMarkers = [];

for (var i = 0; i < features.length; i ++) {
  var coordinates = []
  coordinates.push(features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]);
  
  earthquakeMarkers.push(
    L.circle(coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "black",
      fillColor: markerColor(features[i].geometry.coordinates[2]),
      radius: markerSize(features[i].properties.mag)
      })
  );
}
console.log(earthquakeMarkers);

var earthquakes = L.layerGroup(earthquakeMarkers);

var overlayMaps = {
  "Earthquakes": earthquakes
};

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = ['10', '10-30', '30-50', '50-70', '90'],
    labels = [];

    for (var i = 0; i < grades.length; i ++) {
      div.innerHTML +=
      '<i style="background;' + markerColor(grades[i] + 1) + '"></i>' +
      grades[i] + (grades[i +1] ? '&ndash;' + grades[i +1] + '<br' : '+');
    }
    return div;
};
legend.addTo(myMap);
})

// function createFeatures(earthquakeData) {

//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place + 
//     "</h3><hr><p>" +  new Date(feature.properties.time) + "</p>");  
//   }
  
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });
//   createMap(earthquakes);

// }