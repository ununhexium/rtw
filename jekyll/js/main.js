var g = {};

$(document).ready(function() {
  addGoogleMapListeners();
  addGoogleMapModalListener();
  initTimelineHover();
});

function initTimelineHover(){
  $('.article-panel').mouseenter(function(){
    $(this).css("opacity", "0.5");
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
    $(this).css("opacity", "1.0");
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

function addGoogleMapListeners() {
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
  g.roadmap = new google.maps.Map(document.getElementById('roadmap_div'), mapOptions);
  
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

