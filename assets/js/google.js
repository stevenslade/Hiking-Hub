var buttonEl = document.querySelector("#search-button")
var apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
var lat = 33.749;
var lon = -84.388;

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
    // event.preventDefault();
    var location = cityInput.value;
    console.log(location);
    if (!location) {
        window.alert('Please enter a location.');
        return;
    }
    var apiUrl = "https://api.openweathermap.org";
    const appId = "971216a37d6d8963b0824cde5c5d2a68";
    var url = `${apiUrl}/data/2.5/weather?q=${location}&units=imperial&appid=${appId}`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //THESE VARIABLE PULLS FROM THE FETCH DATA
            lat = data.coord.lat;
            lon = data.coord.lon;

            console.log(lat);
            console.log(lon);
            //setLatLong(lat, lon);
            initMap();
            
        });
}
// function setLatLong(lat, lon){
//     var locationInput = new google.maps.LatLng(lat, lon);
//     console.log(locationInput);
//     return locationInput;
// }

function initMap() {
    console.log("initMap")

    // Create the map.
    const atlanta = new google.maps.LatLng(lat, lon);
    console.log(atlanta);
    const map = new google.maps.Map(document.getElementById("map"), {
        center: atlanta,
        zoom: 9,
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
    service.nearbySearch({
            location: atlanta, //locationInput,
            radius: 25000,
            keyword: "hiking"
        },
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
    while (placesList.firstChild) {
        placesList.removeChild(placesList.firstChild);
    }
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
        li.setAttribute("style", "color:white");
        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
        var btn = document.createElement("BUTTON");   // Create a <button> element
        btn.innerHTML = place.name; 
        btn.setAttribute("style", "border:2px solid white");                  // Insert text
        btn.setAttribute("style", "background: orange");               // Insert text
        btn.addEventListener('click', checkButton());
        li.appendChild(btn);
      }
    }
}

function setEventListeners() {
    buttonEl.addEventListener('click', getLatLong);
}

function init() {
    setEventListeners();
    getRedditApi();
    // initMap();
}

init();

function checkButton(){
    console.log("Button Working");
}


















//Start Merge of reddit code
function createAppendReddit (image, title, description, link) {

    //create the container and card elements
    var redditContainer = document.createElement("div");
    var redditCard = document.createElement("div")
    var redditImageCard = document.createElement("div");
    var redditDescCard = document.createElement("div"); 
    //create the elements for each dataset item
    var redditCardTitle = document.createElement("h4");
    var redditDescription = document.createElement("p");
    var redditLink = document.createElement("a");
    var redditImage = document.createElement("img");
  
    //append the redditCard to the container
    redditContainer.append(redditCard);
  
    //append the img and description cards to the redditCard
    redditCard.append(redditImageCard);
    redditCard.append(redditDescCard);
    
    //append the image element to the image card
    redditImageCard.append(redditImage);
  
    //append the Title, Description, Hyperlink
    redditDescCard.append(redditCardTitle, redditDescription, redditLink);
  
    //assign content to the html elements
    //text stuff can be set with textContent
    redditCardTitle.textContent = title;
    redditDescription.textContent = description;
    redditLink.textContent = "Click here to see the Post";
    //assign content to the img and a tags requires setting attributes
    redditLink.setAttribute('href', link);
    redditImage.setAttribute('src', image);
  
    //attach classes to the elements
    //need to attach all the tailwind classes for formatting
    //setAttribute will set the class and over right any existing class
    //element.classList.add("someclass - defined in your css") will add a new class to the existing 
    //redditContainer.setAttribute('class', "someclass - defined in css or your library");
    //This formatting is currently all done in Tailwind
    redditContainer.setAttribute('class', "max-w-2xl mx-auto bg-blue-300 bg-opacity-60 rounded-xl shadow-md overflow-hidden m-10 border-2 border-green-500");//max-w-md
    redditCard.setAttribute('class', "md:flex");
    redditImageCard.setAttribute('class', "md:flex-shrink-0");
    redditImage.setAttribute('class', "h-36 w-36 object-cover"); //md:h-full md:w-48 removed this responsive content, also was h-full w-48
    redditDescCard.setAttribute('class', "mx-4")
    redditCardTitle.setAttribute('class', "uppercase tracking-wide text-lg text-black font-bold");
    redditDescription.setAttribute('class', "mt-2 text-md text-black font-medium my-2");
    redditLink.setAttribute('class',"block mt-1 text-lg leading-tight font-bold text-black hover:underline");
  
    //attach the container to the HTML anchor point "reddit"
    reddit.append(redditContainer);
  }
  
  //Start of the reddit fetch, it uses the init function called at the bottom
  
  //Location for which to search Reddit, this will need to be collected from the
  //user choosing an item returned by google 
  var redditSearchLocation = "Cochran Shoals";
  
  //Limits search return to specified number of items, can be 5, 10, 25
  var redditSearchLimit = 5;
  
  //Allows use of keyword, this would be user input on html
  var redditKeyWord = "";
  
  //not yet using the sort by feature, have the option to use one of  (relevance, hot, top, new, comments)
  //var sortBy = 
  //If we choose to use the sort by option, the query Url would look like this
  //var redditQueryUrl = "https://www.reddit.com/search.json?q=" + searchLocation + "&sort=" + sortBy + "&limit=" +searchLimit;
  
  function getRedditApi () {
    //Takes a keyword (if existing and greater than a length of one) and adds it to the searchLocation, the reddit query allows for 250 chracters in the q= parameter
    if(redditKeyWord && redditKeyWord.length >1) {
      redditSearchLocation = redditSearchLocation + " " + redditKeyWord;
    }
  
    //THIS PATH HAS AN S ALTHOUGH REDDIT CLAIMED IT DIDN'T WANT IT BUT I ADDED IT ANYWAY
    var redditQueryUrl = "https://www.reddit.com/search.json?q=" + redditSearchLocation + "&limit=" + redditSearchLimit;
  
  fetch(redditQueryUrl)
    .then(function(res) {
      return res.json();   // Convert the data into JSON
    })
    .then(function(data) {
      for(var i =0; i < data.data.children.length; i++) {
        var title = data.data.children[i].data.title;
        //More amazingness, some reddit urls are links to posts, some are links to images, its not reliable we need to use the permalink data
        //So permalink should give an address fragment to which we can attach the prefix https://www.reddit.com and then get a useable link for each item
        var permalinkHttp = "https://www.reddit.com" + data.data.children[i].data.permalink
        var description = data.data.children[i].data.selftext; 
        //Thumbnail can be an image or a self reference it depends on how the user posted, it's not reliable enough for image population
        //Some posts do not have an image which leaves the preview parameter empty so we only get the thumbnail image if it exists
        if(data.data.children[i].data.preview) {
          //And of course it has to be encoded because reddit so we can't use it unless we decoded it.  If we try to follow it we get a 403 error.
          var imageUrlEncoded = data.data.children[i].data.preview.images[0].source.url;
          //in order to decode we need to replace "amp;s" with "s"
          var imageUrlDecoded = imageUrlEncoded.replace("amp;s", "s");
          //This url can now be used as a link to display an image
        } else {
          var imageUrlDecoded = "https://static.techspot.com/images2/downloads/topdownload/2014/05/reddit.png";
       }
       //After fetching from the api endpoints, run the function to create and append the data
       createAppendReddit (imageUrlDecoded, title, description, permalinkHttp);
      }
    })
    .catch(function(err) {
      console.log(err);   // Log error if any
    });
  }