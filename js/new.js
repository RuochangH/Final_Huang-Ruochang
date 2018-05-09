//mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoicnVvY2hhbmciLCJhIjoiY2plMGN5NmduNTBzMzJ3cXA4OHJqbTg1MCJ9.hVntg2f96UxD239bHHlQFw';

//Set the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ruochang/cjgx7h9d8000b2so75lhsbpjh',
    center: [-75.163669,39.953432],
    zoom: 13
});
map.addControl(new mapboxgl.NavigationControl());

//Get and Plot Live and historical data
//Size and fill styling are based on bike and dock availability
var url = 'https://www.rideindego.com/stations/json/';
var histURL = 'https://raw.githubusercontent.com/RuochangH/Final_Huang-Ruochang/master/final.geojson';


var landingPage =function(){

// Get and plot historical data as icons
//later used to provide historical information on click
  var featureGroup;
    $.ajax(histURL).done(function(data) {
      var parsedData = JSON.parse(data);
        //plot
        map.addSource('history',{type:'geojson',data:parsedData});
        map.addLayer({
          "id":"hist",
          "type":"symbol",
          "source":"history",
          "layout":{
            "icon-image":"bicycle-15"
          }
        });
    });

    //Create click Event
    map.on('click', 'hist', function (e) {
      map.flyTo({center: e.features[0].geometry.coordinates});
      var coordinates = e.features[0].geometry.coordinates.slice();
      //console.log(e.features[0].properties.monday);
        var div = window.document.createElement('div');
        div.innerHTML ='<h5 style="color:#535E80 text-align: center">Bike Station Hourly Net Changes</h5><svg/>';
                var values = e.features[0].properties;
                var data =[values.h0,values.h1,values.h2,values.h3,values.h4,
                values.h5,values.h6,values.h7,values.h8,values.h9,values.h10,
              values.h11,values.h12,values.h13,values.h14,values.h15,values.h16,
          values.h17,values.h18,values.h19,values.h20,values.h21,values.h22,values.h23];

                var margin = {top:20, right:30,bottom:20,left:30},
                    width = 340 - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom,
                    barHeight = height/data.length;

                    var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
                    var y = d3.scale.linear()
                      .domain([-y0, y0])
                      .range([height,0])
                      .nice();

                    var x = d3.scale.ordinal()
                      .domain(d3.range(data.length))
                      .rangeRoundBands([0, width], 0.2);

                    var svg = d3.select(div).select("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");


                    var bar = svg.selectAll("g.bar")
                    .data(data)
                    .enter().append("g");

                    bar.append("rect")
                    .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
                    .attr("y", function(d) { return y(Math.max(0, d)); })
                    .attr("x", function(d, i) { return x(i); })
                    .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
                    .attr("width", x.rangeBand());

                    svg.append("g")
                    .attr("class", "x axis")
                    .call(yAxis);

                    svg.append("g")
                    .attr("class", "y axis")
                    .append("line")
                    .attr("y1", y(0))
                    .attr("y2", y(0))
                    .attr("x1", 0)
                    .attr("x2", width);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(div)
            .addTo(map);
    });



map.on('load', function () {
  //Get Live data
    window.setInterval(function() {
        map.getSource('liveBike').setData(url);
    }, 2000);

    map.addSource('liveBike', { type: 'geojson', data: url });

//Plot Live data REGULAR STYLE
    map.addLayer({
        "id": "liveBike",
        "type": "circle",
        "source": "liveBike",
        "filter":["all",
          ['==','kioskPublicStatus','Active'],
        ['==','isVirtual',false],
      ['==','isVisible',false]],
        "paint": {
          "circle-stroke-width":1.5,
          "circle-stroke-color":'#535E80',
            "circle-radius": {
              "property":"totalDocks",
              "stops": [
           [0, 0],
           [5, 3],
           [10,6],
           [15, 12],
         [20,15],
       [25,18],
     [30,21]]
            },
          "circle-color":'#7EBFDC',
        "circle-opacity":{
          "property":"bikesAvailable",
          'stops':[
            [0,0],
            [10,1]
          ]
        }}
        //Put live data icon beneath historical data
    },'hist');

//Create live data HOVER STYLE
    map.addLayer({
        "id": "liveBike-Hover",
        "type": "circle",
        "source": "liveBike",
        "filter":
    ["==","kioskId",""],
        "paint": {
          "circle-stroke-width":2.5,
          "circle-stroke-color":'#535E80',
            "circle-radius": {
              "property":"totalDocks",
              "stops": [
           [0, 0],
           [5, 5],
           [10,8],
           [15, 14],
         [20,17],
       [25,20],
     [30,23]]
            },
          "circle-color":'#7EBFDC'
        },
        //put live data hover style beneath historical data
    },'hist');

//POPUP
    var popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    });

//Hover Effect
    map.on('mouseenter', 'liveBike', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        map.setFilter("liveBike-Hover",["==","kioskId",e.features[0].properties.kioskId]);
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = "<strong>"+e.features[0].properties.addressStreet + " Station</strong><br>"+
        e.features[0].properties.bikesAvailable +" Bikes Available<br>"+
        e.features[0].properties.docksAvailable +" Docks Available";


        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var station = map.queryRenderedFeatures(e.point, {
          layers: ['liveBike']
        });


          if (station.length > 0) {
            document.getElementById('pd').innerHTML = description;
          } else {
            document.getElementById('pd').innerHTML = '<p>Hover Over a Station for Detail!</p>';
          }

    });

    map.on('mouseleave', 'liveBike', function() {
        map.setFilter("liveBike-Hover",["==","kioskId",""]);
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});
};

landingPage();

//Start to use the application; Set the Second Page
$('#s0').click(function(){
  $('.intro').hide();
  $('#process').show();

  //Add geolocator
  var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
  });
  map.addControl(geolocate);

  var origin =[-75.163669,39.953432];
  geolocate.on('geolocate',function(e){
    origin[0]=e.coords.longitude;
    origin[1]=e.coords.latitude;
  });
  //console.log(origin);
});

//Get User Location
var location  = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": origin
        }
    }]
};
