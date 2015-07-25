var g = {};

$(function() {
  loadRecursive($(this));
  addGoogleMapListeners();
  initTabs();
});

/*
 * function initTabs() { $("a.tabs").click(function(e) { var target =
 * $(this).data("target"); var isTargetExpanded = $(target).hasClass('in');
 * $(target).removeClass('collapse').addClass("in"); // expand clicked target
 * }); }
 */
// stackoverflow.com/questions/17908296/jquery-recursive-loading-nested-html
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

function addGoogleMapListeners() {
  $('#map_modal').on('shown.bs.modal', function() {
    setTimeout(function() {
      google.maps.event.trigger(window.googleMap, "resize");
    }, 500);
  })

  $('button').click(function() {
    var clicked = $(this);
    console.log(getDomPath(clicked).join(' > '));
    alert(clicked);
    
    geocoder = new google.maps.Geocoder();
    var address = clicked.attr('address');
    // input box value
    alert(address);
    geocoder.geocode({
      'address' : address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        window.googleMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map : window.googleMap,
          position : results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful  for the following reason: " + status);
      }
    });
  })
}

function initialize() {
  var mapOptions = {
    center : {
      lat : 0,
      lng : 0
    },
    zoom : 11,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  g.googleMap = new google.maps.Map(document.getElementById('map_div'), mapOptions);
  
  mapOptions.zoom = 1;
  g.roadmap = new google.maps.Map(document.getElementById('roadmap_div'), mapOptions);
  
  $('#tabs_div').click(function() {
    setTimeout(function() {
      if (!g.roadmap_resized) {
        var center = g.roadmap.getCenter();
        google.maps.event.trigger(g.roadmap, "resize");
        g.roadmap.setCenter(center);
        g.roadmap_resized = true;
      }
    }, 1000);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
