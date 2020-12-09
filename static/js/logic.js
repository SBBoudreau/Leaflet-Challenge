

// USGS URL for All Earthquakes from the Part 7 Days

var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';



// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  console.log(data)
  // Define and color code data markers, reflecting the magnitude of the earthquake by their size and depth of the 
  //earthquake by color.  Earthquakes with higher magnitudes are larger and greater depths are darker.
  function magColor(mag) {

    if (mag > 3)
      return "red"
    else if (mag > 2.5)
      return "orange"
    else if (mag > 2.0)
      return "yellow"
    else if (mag > 1.5)
      return "green"
    else if (mag > 1.0)
      return "blue"
    else if (mag > 0.5)
      return "purple"
    else
      return "white"

  }

  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: addPopup,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)

    },
    style: function (feature) {
      return {
        radius: feature.properties.mag * 4,
        opacity: 1,
        fillOpacity: 1,
        stroke: true,
        weight: 0.2,
        color: 'gray',
        fillColor: magColor(feature.properties.mag)

      }
    }
  });

  createMap(earthquakes);
});


// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>magnitude: ${feature.properties.mag}`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["red", "orange", "yellow", "green", "blue", "purple", "white"].reverse();
    var labels = [];

    // Add min & max to the html
    div.innerHTML = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + '0' + "</div>" +
      "<div class=\"max\">" + '3.0' + "</div>" +
      "</div>";

    colors.forEach(function (limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}
