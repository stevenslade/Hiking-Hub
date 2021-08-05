var googleResults = document.getElementById("google");

var locationQuery = "Atlanta";
var apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
const appId = "AIzaSyB4mnJeTWSHxIamtQ3v_Cf2zo9kvadCLs0"

function getNearbyTrails(event) {
    // event.preventDefault();
    if (!location) {
        window.alert("Please enter a location.");
    }
    var url = `${apiUrl}query=${locationQuery}&type=park&key=${appId}`
    fetch(url, {
        mode: 'no-cors'
    }).then(function(response) {
        if (!response.ok) {
            console.log(response.status);
        }
        return response.json();
    })
    .then(function(data) {
        console.log("data", data);
        if (data.count === 0) {
            window.alert("This is not a valid location.");
        }
    })
    .catch(function() {
        window.alert("Something went wrong.")
    })
}

// getNearbyTrails();

// var map;
// var service;
// var infowindow;

// function initMap() {
//   var Atlanta = new google.maps.places.findPlaceFromQuery(request);

//   map = new google.maps.Map(document.getElementById('map'), {
//       center: pyrmont,
//       zoom: 15
//     });

//   var request = {
//     location: pyrmont,
//     radius: '500',
//     query: 'restaurant'
//   };

//   service = new google.maps.places.PlacesService(map);
//   service.textSearch(request, callback);
// }

// function callback(results, status) {
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       var place = results[i];
//       createMarker(results[i]);
//       console.log(place)
    

//     }
//     console.log(Object.keys(place))
//   }
// }

// function createMarker(place) {

//     new google.maps.Marker({
//         position: place.geometry.location,
//         map: map
//     });
// }


function findLocationFromPlaces() {
    let placesService = new google.maps.places.PlacesService(document.getElementById("map")); // i.e. <div id="map"></div>

    const request = {
        query: 'San Francisco',
        fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
    };

    placesService.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results[0].formatted_address) // San Francisco, CA, USA
        }
        else {
            console.log("doesn't work");
        }
    });
}