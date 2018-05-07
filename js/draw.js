var myRectangle=[];

// Initialize Leaflet Draw

var drawControl = new L.Control.Draw({
  draw: {
    polyline: true,
    polygon: true,
    circle: true,
    marker: true,
    rectangle: true,
  }
});

map.addControl(drawControl);

// Event which is run every time Leaflet draw creates a new layer
map.on('draw:created', function (e) {
    var type = e.layerType; // The type of shape
    var layer = e.layer; // The Leaflet layer for the shape
    var id = L.stamp(layer); // The unique Leaflet ID for the layer
    map.removeLayer(myRectangle);
    map.addLayer(layer);
    myRectangle=layer;
});
