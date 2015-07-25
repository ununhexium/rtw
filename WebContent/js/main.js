var g = {};

function afterLoading() {
  initTabs();
  addGoogleMapListeners();
};

$(document).ready(function() {
  loadRecursiveMain($(this), afterLoading());
});

function initTabs() {
  $("a.tabs").click(function(e) {
    var target = $(this).data("target");
    var isTargetExpanded = $(target).hasClass('in');
    $(target).removeClass('collapse').addClass("in"); // expand clicked target
  });
}

// stackoverflow.com/questions/17908296/jquery-recursive-loading-nested-html
function loadRecursiveMain(context, callback) {
  loadRecursive(context);
  callback();
}
function loadRecursive(context) {
  // search matching elements that have 'place-holder' class
  $('.place-holder', context).each(function() {
    var that = $(this);
    $.get(that.attr('include-file'), function(data, textStatus) {
      repl = $(data);
      that.replaceWith(repl);
      loadRecursive(repl);
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
          alert("Geocode was not successful for the following reason: " + status);
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
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  g.modalmap = new google.maps.Map(document.getElementById('map_div'), mapOptions);
  
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
