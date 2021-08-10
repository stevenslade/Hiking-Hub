var buttonEl = document.querySelector("#search-button")
var apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
var lat = 33.749;
var lon = -84.388;

var today = moment();
$("#currentDay").text(today.format("MMM Do, YYYY"));

const inputEl = document.getElementById("city-input");
// we appear to have this search button grabbed as a variable twice, its also above as buttonEl
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const historyEl = document.getElementById("history");
const placesEl = document.getElementById("places");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

searchEl.addEventListener("click",function() {
    clearRedditContainer();
    const searchTerm = inputEl.value;
    if (!searchTerm) {
      inputEl.setAttribute("placeholder", "PLEASE ENTER A LOCATION");
      return;
    }
    //Add a conditional so that if the term is already in the history it will not push again
    if (!searchHistory.includes(searchTerm)){ 
        searchHistory.push(searchTerm);
    }
    localStorage.setItem("search",JSON.stringify(searchHistory));
    renderSearchHistory();
})

clearEl.addEventListener("click",function() {
    searchHistory = [];
    renderSearchHistory();
    //Need to clear the reddit results as well
    clearRedditContainer();
})

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i=0; i<searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "card green lighten-2");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
            (historyItem.value);
        var historicalLocation = (searchHistory[i]);
        //call the main function to run with the historicalLocation - had to make a different function to pass in the city name
        getLatLongWithHistoryButton(historicalLocation);
        clearRedditContainer();
        })
        historyEl.append(historyItem);
    }
}

clearEl.onclick = ()=>{
    placesEl.innerHTML = "";
}


renderSearchHistory();
if (searchHistory.length > 0) {
    (searchHistory[searchHistory.length - 1]);
}





///// BELOW IS NEARBYSEARCH


let map;
let service;
let infowindow;
var cityInput = document.getElementById('city-input')
//can add event listener to search input


function getLatLongWithHistoryButton(location) {

  if (!location) {
      //window.alert('Please enter a location.');
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

          initMap();
          
      });
}


function getLatLong(event) {
    // event.preventDefault();

    //this value is being inside the function
    var location = cityInput.value;
    if (!location) {
        //window.alert('Please enter a location.');
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

            initMap();
            
        });
}


function initMap() {
    //console.log("initMap")

    // Create the map.
    const atlanta = new google.maps.LatLng(lat, lon);
    //console.log(atlanta);
    const map = new google.maps.Map(document.getElementById("map"), {
        center: atlanta,
        zoom: 9,
    });
    //console.log("map: ", map);

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
        li.textContent = " ";  //The name of the trail is place.name, removed here and just added a space
        placesList.appendChild(li);
        li.setAttribute("style", "color:white");
        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
        var btn = document.createElement("BUTTON");   // Create a <button> element
        var content = `<button data-location = "${place.name}">${place.name}</button>`;
        btn.innerHTML = content;
        btn.setAttribute("style", "border:2px solid white");                  // Insert text
        btn.setAttribute("style", "background: orange");               // Insert text
        btn.addEventListener("click", updateRedditLocation);
        li.appendChild(btn);
      }
    }
}

//This function is called when the reddit Button is clicked it sends the chosen location to the redditfetchquery
function updateRedditLocation(evt){
  var buttonClicked = evt.target;
  //redditSearchLocation is globally scoped, needed for the redditSearchAPI
  redditSearchLocation = buttonClicked.getAttribute("data-location");
  getRedditApi();
}

function setEventListeners() {
    buttonEl.addEventListener('click', getLatLong);
}

function init() {
    setEventListeners();
}

init();


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
  
  //Allows use of keyword, this would be user input on html - we have not enabled this feature
  //var redditKeyWord = "Hiking";
  
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

      //if there is no return from Reddit for the search item
      if (data.data.children.length === 0) {
        emptyRedditReturn();
        return;
      }

      //before we enter the loop to create and append elements to the redditList
      //we need to clean it of any previously attached elements
      clearRedditContainer();

      for(var i =0; i < data.data.children.length; i++) {
        var title = data.data.children[i].data.title;
        //More amazingness, some reddit urls are links to posts, some are links to images, its not reliable we need to use the permalink data
        //So permalink should give an address fragment to which we can attach the prefix https://www.reddit.com and then get a useable link for each item
        var permalinkHttp = "https://www.reddit.com" + data.data.children[i].data.permalink
        //some descriptions are very long on reddit and we need to reduce them for our post
        var description = data.data.children[i].data.selftext;
        // make an array of the description string, split on spaces between words
        var descriptionArray = description.split(" ");
        // reduce the length to 50 words
        descriptionArray.length = 50;
        //set the description to the new shortened descriptionArray
        description = descriptionArray.join(" ");
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

  function clearRedditContainer(){
    while (reddit.firstChild) {
      reddit.removeChild(reddit.firstChild);
    }
  }

  function emptyRedditReturn () {

    clearRedditContainer();

    //create the container and card elements
    var redditContainer = document.createElement("div");
    var redditCard = document.createElement("div")
    var redditImageCard = document.createElement("div");
    var redditDescCard = document.createElement("div"); 
    //create the elements for each dataset item
    var redditCardTitle = document.createElement("h4");
    var redditImage = document.createElement("img");
  
    //append the redditCard to the container
    redditContainer.append(redditCard);
  
    //append the img and description cards to the redditCard
    redditCard.append(redditImageCard);
    redditCard.append(redditDescCard);
    
    //append the image element to the image card
    redditImageCard.append(redditImage);
  
    //append the Title, Description, Hyperlink
    redditDescCard.append(redditCardTitle);
  
    //assign content to the html elements
    //text stuff can be set with textContent
    redditCardTitle.textContent = "Very sorry, was not able to find relavent content on Reddit";
    //assign content to the img and a tags requires setting attributes
    redditImage.setAttribute('src', "https://static.techspot.com/images2/downloads/topdownload/2014/05/reddit.png");
  
    //attach classes to the elements
    redditContainer.setAttribute('class', "max-w-2xl mx-auto bg-blue-300 bg-opacity-60 rounded-xl shadow-md overflow-hidden m-10 border-2 border-green-500");//max-w-md
    redditCard.setAttribute('class', "md:flex");
    redditImageCard.setAttribute('class', "md:flex-shrink-0");
    redditImage.setAttribute('class', "h-36 w-36 object-cover"); //md:h-full md:w-48 removed this responsive content, also was h-full w-48
    redditDescCard.setAttribute('class', "mx-4")
    redditCardTitle.setAttribute('class', "uppercase tracking-wide text-lg text-black font-bold");
  
    //attach the container to the HTML anchor point "reddit"
    reddit.append(redditContainer);
  }