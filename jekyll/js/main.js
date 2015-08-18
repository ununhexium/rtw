---
---

var g = {};


$(document).ready(function() {
  addGoogleMapListener();
  addGoogleMapModalListener();
  initTimelineHover();
});

function initTimelineHover(){
  
  /* The style we will apply to the article's elements */

  hoverTxtStyle={
    "opacity": "0.5",
    "-webkit-filter": "blur(5px)",
    "-moz-filter": "blur(5px)",
    "--filter": "blur(5px)",
    "-o-filter": "blur(5px)",
    "-ms-filter": "blur(5px)",
    "filter": "blur(5px)",
    "transition": "filter 1s",
    "-webkit-transition": "-webkit-filter 1s",
    "-moz-transition": "-moz-filter 1s",
    "--transition": "--filter 1s",
    "-o-transition": "-o-filter 1s",
    "-ms-transition": "-ms-filter 1s"
  }

  txtStyle={
    "opacity": "1.0",
    "-webkit-filter": "blur(0px)",
    "-moz-filter": "blur(0px)",
    "--filter": "blur(0px)",
    "-o-filter": "blur(0px)",
    "-ms-filter": "blur(0px)",
    "filter": "blur(0px)"
  }

  avoidButtons={
    "opacity": "0.25",
    "transition": "all 1s"
  }

  replaceButtons={
    "opacity": "1.0",
  }

  $('.article-panel').mouseenter(function(){
    $(this).children(".article-abstract").css(hoverTxtStyle);
    $(this).children(".article-heading").css(hoverTxtStyle);
    $(this).children(".article-buttons").css(avoidButtons);

    
    $(this).prev(".article-background").css({
      "opacity": "1.0",
      "-webkit-filter": "blur(0px)",
      "-moz-filter": "blur(0px)",
      "--filter": "blur(0px)",
      "-o-filter": "blur(0px)",
      "-ms-filter": "blur(0px)",
      "filter": "blur(0px)"
    });
  }).mouseleave(function(){
    $(this).children(".article-abstract").css(txtStyle);
    $(this).children(".article-heading").css(txtStyle);
    $(this).children(".article-buttons").css(replaceButtons);

    $(this).prev(".article-background").css({
      "opacity": "0.5",
      "-webkit-filter": "blur(5px)",
      "-moz-filter": "blur(5px)",
      "--filter": "blur(5px)",
      "-o-filter": "blur(5px)",
      "-ms-filter": "blur(5px)",
      "filter": "blur(5px)"
    });
  });
}

function resizeGoogleMap(map) {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
}

function drawTripPath() {
  if ('drewTripPath' in g) {
    return;
  }
  
  var addrList = $('.article-map > button').map(function() {
    return $(this).attr('address');
  }).get();
  
  g.drewTripPath = true;
}

function addGoogleMapListener() {
  setTimeout(function() {
    $('button.googlemapbutton').click(function() {
      var clicked = $(this);
      geocoder = new google.maps.Geocoder();
      var address = clicked.attr('address');
      geocoder.geocode({
        'address' : address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          g.modalmap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map : g.modalmap,
            position : results[0].geometry.location
          });
        } else {
          /* TODO: close the modal window ? set it to north pole ? */
        }
      });
    });
  }, 1000);
}

function addGoogleMapModalListener(){
  $('#map_modal').on('shown.bs.modal', function () {
    resizeGoogleMap(g.modalmap);
  });
}

function initializeGoogleMaps() {
  var mapOptions = {
    center : {
      lat : 0,
      lng : 0
    },
    zoom : 15,
    mapTypeId : google.maps.MapTypeId.SATELLITE
  };
  g.modalmap = new google.maps.Map(document.getElementById('map_div'), mapOptions);
  
  mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP
  mapOptions.zoom = 1;
  g.roadmap = new google.maps.Map(document.getElementById('roadmap_canevas'), mapOptions);

  /*
   * The road
   * TODO: geocode instead of manual input:
   * http://gis.stackexchange.com/questions/22108/how-to-geocode-300-000-addresses-on-the-fly
   */

  var roadmap_data = new Array();
  {% for road in site.posts %}
    {% if road.lat and road.lng %}
      roadmap_data.push(new google.maps.LatLng({{ road.lat }}, {{ road.lng }}));
    {% endif %}
  {% endfor %}

  // Define a symbol using SVG path notation, with an opacity of 1.
  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
  };


  var path = new google.maps.Polyline({
    path: roadmap_data,
    geodesic: true,
    strokeColor: '#009999',
    strokeOpacity: 0.0,
    strokeWeight: 2,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }]
  });

  path.setMap(g.roadmap);

  
  /*
   * Refresh the roadmap on the first click on it.
   */
  $('#tabs_div').click(function() {
    setTimeout(function() {
      resizeGoogleMap(g.roadmap);
    }, 500);
  });
  addGoogleMapListener();
}

google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);

