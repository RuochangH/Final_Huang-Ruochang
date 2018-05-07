var map = L.map('map', {
    center: [39.953432, -75.163669],
    zoom: 14
  });
/*
var Stamen_TonerLite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnVvY2hhbmciLCJhIjoiY2plMGN5NmduNTBzMzJ3cXA4OHJqbTg1MCJ9.hVntg2f96UxD239bHHlQFw',
{minZoom:0,
maxZoom:20}).addTo(map);
*/

/*
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
*/

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  minzoom:0,
	maxZoom: 19,
  opacity:0.65,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);


var liveURL = 'https://raw.githubusercontent.com/RuochangH/Final_Huang-Ruochang/master/map.geojson';
var featureGroup;

$(document).ready(function(){
  $.ajax(liveURL).done(function(data) {
    var parsedData = JSON.parse(data);
    console.log(parsedData);
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }
      //plot
      featureGroup = L.geoJson((parsedData),{
      //filter:myFilter1,
      pointToLayer:function(feature, latlng){
        var MarkerOption = {
          radius: 2,
          weight: 1,
          opacity: 0.8,
          color:'white',
          dashArray: '3',
          fillOpacity:0.6
        };
        return L.circleMarker(latlng,MarkerOption);
      },
      //onEachFeature: onEachFeature1
    }).addTo(map);

  });
});
