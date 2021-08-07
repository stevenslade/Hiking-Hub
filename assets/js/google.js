var buttonEl = document.querySelector("#search-button")
var apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
const appId = "AIzaSyB4mnJeTWSHxIamtQ3v_Cf2zo9kvadCLs0";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// let map;
// let service;
// let infowindow;
// var cityInput = document.getElementById('city-input')

// function initMap() {
//     var location = cityInput.value;
//     const atlanta = new google.maps.LatLng(33.749, -84.388);
//   infowindow = new google.maps.InfoWindow();
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: atlanta,
//     zoom: 12,
//   });
//   const request = {
//     query: location,
//     fields: ["name", "geometry"],
//   };
//   service = new google.maps.places.PlacesService(map);
//   service.findPlaceFromQuery(request, (results, status) => {
//     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }
//       map.setCenter(results[0].geometry.location);
//       addPlaces(results, map)
//     }
//   });
// }

// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;
//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });
//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name || "");
//     infowindow.open(map);
//   });
// }

  
// function addPlaces(places, map) {
// const placesList = document.getElementById("places");

// for (const place of places) {
//     if (place.geometry && place.geometry.location) {
//     const image = {
//         url: place.icon,
//         size: new google.maps.Size(71, 71),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(17, 34),
//         scaledSize: new google.maps.Size(25, 25),
//     };
//     new google.maps.Marker({
//         map,
//         icon: image,
//         title: place.name,
//         position: place.geometry.location,
//     });
//     const li = document.createElement("li");
//     li.textContent = place.name;
//     placesList.appendChild(li);
//     li.addEventListener("click", () => {
//         map.setCenter(place.geometry.location);
//     });
//     }
// }
// }


///// BELOW IS NEARBSEARCH


let map;
let service;
let infowindow;
var cityInput = document.getElementById('city-input')
//can add event listener to search input


function getLatLong(event) {
    event.preventDefault();
    var location = cityInput.value;
    if (!location) {
        window.alert('Please enter a location.');
        return;
    }
    var apiUrl = "https://api.openweathermap.org";
    const appId = "971216a37d6d8963b0824cde5c5d2a68";
    var url = `${apiUrl}/data/2.5/weather?q=${location}&units=imperial&appid=${appId}`;
    fetch(url).then(function (response) {
            if (!response.ok) {
                console.log(response.status);
            }
            return response.json();
        })
        .then(function (data) {            
            if (data.count === 0) {

                window.alert("this is not a valid location");
            }
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            console.log(latitude)
            console.log(longitude)
        })
        .catch(function () {
            window.alert('Something went wrong');
        })
        return location;
}


function initMap() {
    console.log("initMap")
    var location = cityInput.value;

    // Create the map.
    const atlanta = new google.maps.LatLng(33.749, -84.388);
    const map = new google.maps.Map(document.getElementById("map"), {
      center: atlanta,
      zoom: 12,
    });
    console.log("map: ", map);

    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");
  
    moreButton.onclick = function () {
      moreButton.disabled = true;
  
      if (getNextPage) {
        getNextPage();
      }
    };
    // Perform a nearby search.
    service.nearbySearch(
      { location: atlanta, radius: 2500, type: "park" },
      (results, status, pagination) => {
        if (status !== "OK" || !results) return;
        for (let i = 0; i < results.length == 5; i++) {
            createMarker(results[i]);
          }
        map.setCenter(results[0].geometry.location);
        addPlaces(results, map);
        moreButton.disabled = !pagination || !pagination.hasNextPage;
  
        if (pagination && pagination.hasNextPage) {
          getNextPage = () => {
            // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
          };
        }
      }
    );

    function createMarker(place) {
        if (!place.geometry || !place.geometry.location) return;
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
        });
        google.maps.event.addListener(marker, "click", () => {
          infowindow.setContent(place.name || "");
          infowindow.open(map);
        });
      }
  }
  
  function addPlaces(places, map) {
    const placesList = document.getElementById("places");
  
    for (const place of places) {
      if (place.geometry && place.geometry.location) {
        const image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
        });
        const li = document.createElement("li");
        li.textContent = place.name;
        placesList.appendChild(li);
        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
      }
    }
  }


function setEventListeners() {
    buttonEl.addEventListener('click', initMap);
}

function init() {
    setEventListeners();
    // initMap();
}

init();