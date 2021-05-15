// make sure logic.js is loaded
console.log("logic.js loaded");

// function to set the circle size by the magnitude
function markerSize(magnitude) {
  return magnitude * 50000;
}

// set the color depending on depth
function markerColor(depth) {
  return  depth > 90 ? "#FF0000" :
          depth > 70 ? "#FFC0CB" :
          depth > 50 ? "#FFA500" :
          depth > 30 ? "#FFFF00" :
          depth > 10 ? "#ADFF2F" :
                       "#008000";
}

// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var geoTectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Get data with d3
d3.json(geoData).then(function(data) {
  
  var features = data.features;
  console.log(features);

  d3.json(geoTectonic).then(function(data) {
    var tectonicFeatures = data.features;



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

  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Topographic": OpenTopoMap,
    "World Imagery": Esri_WorldImagery
  };

  // saving earthquake data to array
  var earthquakeMarkers = [];

  for (var i = 0; i < features.length; i++) {
    var coordinates = []
    coordinates.push(features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]);
    
    
    var circle =  L.circle(coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "#000000",
        fillColor: markerColor(features[i].geometry.coordinates[2]),
        radius: markerSize(features[i].properties.mag)
        })
    
    circle.bindPopup("<h3>" + features[i].properties.place + 
      "</h3><hr><h4>Magnitude: " +  (features[i].properties.mag) + "</h4>");  
      
    earthquakeMarkers.push(circle);
  }
  
  // saving tectonic plate data to array
  var tectonicLines = [];

  for (var i = 0; i < tectonicFeatures.length; i++) {
    var lineCoordinates = [];
    var coordinates = tectonicFeatures[i].geometry.coordinates;

    for (var j = 0; j < coordinates.length; j++) {
      lineCoordinates.push([coordinates[j][1], coordinates[j][0]]);
    }
    console.log(lineCoordinates);
    var line = L.polyline(lineCoordinates, {
      color: "#FFD700"
    })
  
    tectonicLines.push(line);
  }
  

  var earthquakes = L.layerGroup(earthquakeMarkers);
  var tectonicPlates = L.layerGroup(tectonicLines);

  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Create map object
  var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // set up legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
      grades = [-10, 10, 30, 50, 70, 90];
      labels = [];

      for (var i = 0; i < grades.length; i ++) {
        div.innerHTML +=
          labels.push('<i style="background:' + markerColor(grades[i] + 1) + '"></i>' +
          grades[i] + (grades[i +1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
      }
      
      div.innerHTML = labels.join('');
      return div;
      
  };

  // add legend to the map
  legend.addTo(myMap);
})
})  
  