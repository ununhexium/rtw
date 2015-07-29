var g = {};

$(document).ready(function() {
  loadRecursive($(this));
  initTabs();
  addGoogleMapListeners();
  $('[data-toggle="tooltip"]').tooltip();
});

function initTabs() {
  $("a.tabs").click(function(e) {
    var target = $(this).data("target");
    var isTargetExpanded = $(target).hasClass('in');
    $(target).removeClass('collapse').addClass("in"); // expand clicked target
  });
}

// stackoverflow.com/questions/17908296/jquery-recursive-loading-nested-html
function loadRecursive(context) {
  // search matching elements that have 'place-holder' class
  $('.place-holder', context).each(function() {
    var self = $(this);
    $.get(self.attr('include-file'), function(data, textStatus) {
      self.html(data); // Load the data into the placeholder
      loadRecursive(self); // Fix sub placeholders
      self.replaceWith(self.get(0).childNodes); // Unwrap the content
    }, 'html');
  });
}

function resizeGoogleMap(map) {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
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
          /*TODO: close the modal window ? set it to north pole ?*/
        }
      });
    });
  }, 1000);
}

function initializeGoogleMaps() {
  var mapOptions = {
    center : {
      lat : 0,
      lng : 0
    },
    zoom : 11,
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
  
  $('#map_modal').on('show.bs.modal', function() {
    setTimeout(function() {
      resizeGoogleMap(g.modalmap);
    }, 500);
  });
}

google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
