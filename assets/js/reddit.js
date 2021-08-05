//Variables for dynamic HTML
//All HTML variables are currentlymade in functions

//The reddit portion does have four globally scoped variables declared below
//searchLocation
//searchLimit
//keyWord
//sortBy

//Content to display time - Need a moment library link and an anchor point
//var datetime = document.querySelector('#currentDay');

//var date = moment(new Date())
//datetime.textContent = (date.format('dddd, MMMM Do YYYY'));

//This is a sample of tailwind css for pretty much what I am trying to do, I will copy this formatting
{/* <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"></div>  //This is my redditContainer
  <div class="md:flex">  //This is my redditCard
    <div class="md:flex-shrink-0">  //This is my redditImageCard
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Man looking at item at a store">
    </div>
    <div class="p-8">  //This is my redditDescCard
      <h4 class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</h4>  //This is my title
      <p class="mt-2 text-gray-500">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
    </div>
  </div>
</div> */}

function createAppendReddit () {
  // make variables of dataset items - currently hardcoded placeholders
  var image = "https://cdn.vox-cdn.com/thumbor/SfU1irp-V79tbpVNmeW1N6PwWpI=/0x0:640x427/1200x800/filters:focal(0x0:640x427)/cdn.vox-cdn.com/uploads/chorus_image/image/45970810/reddit_logo_640.0.jpg";
  var title = "This will be a Title";
  var description = "People are going to be talking about how great the title above is";
  var link = "https://www.reddit.com/r/whatsthissnake/comments/o76zo7/2_snakes_seen_on_a_trail_on_cochran_shoals/";

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
  redditLink.textContent = "Click here to read the Post";
  //assign content to the img and a tags requires setting attributes
  redditLink.setAttribute('href', link);
  redditImage.setAttribute('src', image);

  //attach classes to the elements -ALL THESE CSS CLASSES ARE FOR USE WITH TAILWIND
  //need to attach all the tailwind classes for formatting
  //setAttribute will set the class and over right any existing class
  //element.classList.add("someclass") will add a new class to the existing 
  //redditContainer.setAttribute('class', "redditContainer");

  //attach the container to the HTML anchor point "reddit"
  reddit.append(redditContainer);

}

//Start of the reddit fetch, it uses the init function called at the bottom

//Location for which to search Reddit, this will need to be collected from the
//user choosing an item returned by google 
var searchLocation = "Cochran Shoals";

//Limits search return to specified number of items, can be 5, 10, 25
var searchLimit = 5;

//Allows use of keyword, this would be user input on html
var keyWord = "";

//REMOVE FOR PRODUCTION
//permalink prefix - https://www.reddit.com

//not yet using the sort by feature, have the option to use one of  (relevance, hot, top, new, comments)
//var sortBy = 
//If we choose to use the sort by option, it would look like this
//var redditQueryUrl = "https://www.reddit.com/search.json?q=" + searchLocation + "&sort=" + sortBy + "&limit=" +searchLimit;


function getRedditApi () {

  //Takes a keyword (if existing and greater than a length of one) and adds it to the searchLocation, the reddit query allows for 250 chracters in the q= parameter
  if(keyWord && keyWord.length >1) {
    searchLocation = searchLocation + " " + keyWord;
    console.log("searchLocationAfterConcat: ", searchLocation);
  }

  //THIS PATH HAS AN S ALTHOUGH REDDIT CLAIMED IT DIDN'T WANT IT BUT I ADDED IT ANYWAY
  var redditQueryUrl = "https://www.reddit.com/search.json?q=" + searchLocation + "&limit=" +searchLimit;


fetch(redditQueryUrl)
  .then(function(res) {
    return res.json();   // Convert the data into JSON
  })
  .then(function(data) {
    console.log(data.data.children);   // Logs the data to the console already cutting it down with the .data.children parameters
    console.log("title: ",data.data.children[0].data.title);
    //More amazingness, some reddit urls are links to posts, some are links to images, its not reliable we need to use the permalink data
    console.log("url: ", data.data.children[0].data.url);
    //So permalink should give an address fragment to which we can attach the prefix https://www.reddit.com and then get a useable link for each item
    var permalinkHttp = "https://www.reddit.com" + data.data.children[0].data.permalink
    console.log("permalink: ", permalinkHttp);
    console.log("Description: ", data.data.children[0].data.selftext);
    //Thumbnail can be an image or a self reference it depends on how the user posted, it's not reliable enough for image population
    console.log("Thumbnail: " + data.data.children[0].data.thumbnail);

    //Some posts do not have an image which leaves the preview parameter empty so we only get the thumbnail image if it exists
    if(data.data.children[0].data.preview) {
    //And of course it has to be encoded because reddit so we can't use it unless we decoded it.  If we try to follow it we get a 403 error.
    var imageUrlEncoded = data.data.children[0].data.preview.images[0].source.url;
    console.log("imageUrlEncoded: ", imageUrlEncoded);
    //in order to decode we need to replace "amp;s" with "s"
    var imageUrlDecoded = imageUrlEncoded.replace("amp;s", "s");
    //This url can now be used as a link to display an image
    console.log("imageUrlDecoded: ", imageUrlDecoded);
    } else {
      
      console.log("reddit image: ", "https://cdn.vox-cdn.com/thumbor/SfU1irp-V79tbpVNmeW1N6PwWpI=/0x0:640x427/1200x800/filters:focal(0x0:640x427)/cdn.vox-cdn.com/uploads/chorus_image/image/45970810/reddit_logo_640.0.jpg");
    
    }
  })
  .catch(function(err) {
    console.log(err);   // Log error if any
  });

  //After fetching from the api endpoints, run the function to create and append the data
  createAppendReddit ()
}

// In the event something wants a no-cors whatever, try this
// header parameters
// fetch(url, {
//   mode: 'no-cors'
// }).then


//This is the start of the gov rec fetches

//city and activity variables
var city = "Atlanta";
var activity = "Hiking";

//Lat, Long and radius are being used as variables in the using Lat Long fetch
//Lat and long for an alternate site - Mount Rushmore
//var lat = 43.88037021;
//var long = -103.4525186;

//Atlanta
var lat = 33.7490;
var long = -84.38798;

//25 is max value for radius
var radius = 25;

//This variable is for the state search
var state = "GA";

//APIkey for RecGovApi
var recGovApiKey = "0b1a638d-0a4a-4846-a876-168ebb3de233"

function getRecGovApiUsingCity() {

    //need a requestion url
    var recGovQueryUrl = "https://ridb.recreation.gov/api/v1/recareas?query=" + city + "&limit=10&offset=0&full=true&activity=" + activity + "&radius=" + radius + "&lastupdated=10-01-2018&apikey=" + recGovApiKey;
    
    //send request to recreation gov api
    fetch(recGovQueryUrl)
      .then(function (response) {
         //start of code to redirect in the event of of 404 event
        //  if (response.status !== 200) {
        //    document.location.replace('./404.html')
        //  } else - NEED TO INCLUDE THE LINE BELOW IN THE ELSE STATEMENT
          return response.json();
        })
        .then(function (data) {
            console.log("DataFromCityActivityPull: ", data);    
        });
}


//This API fetch, inputs only an activity, the state is hardcoded but can be made a variable
function getRecGovApiUsingState() {

    //need a requestion url
    //This search is for the state of georgia with a hiking activity variable, it does not use Lat Long
    var recGovQueryUrl = "https://ridb.recreation.gov/api/v1/recareas?limit=50&offset=0&full=true&state=" + state + "&activity=" + activity + "&radius=25&lastupdated=10-01-2018&apikey=" + recGovApiKey;
    
    //send request to recreation gov api
    fetch(recGovQueryUrl)
      .then(function (response) {
         //start of code to redirect in the event of of 404 event
        //  if (response.status !== 200) {
        //    document.location.replace('./404.html')
        //  } else - NEED TO INCLUDE THE LINE BELOW IN THE ELSE STATEMENT
          return response.json();
        })
        .then(function (data) {
            //console.log of the returned data
            console.log("DataFromStateandActivity: ", data);    
        });
 }



//the function fetchs to the Government Recreation Endpoints
//this function INPUTS LAT AND LONG, A SEARCH RADIUS and the activity as variables
function getRecGovApiUsingLatLong() {

//need a requestion url
//This search uses the keyword hiking in the query field and as an activity
//var recGovQueryUrl = "https://ridb.recreation.gov/api/v1/recareas?query=hiking&limit=10&offset=0&full=true&activity=" + activity + "&latitude=" + lat + "&longitude=" + long + "&radius=" + radius + "&lastupdated=10-01-2018&apikey=" + recGovApiKey;

//Only use one of the variables above and below - the above line uses a query field hiking, the below line uses the activity filter hiking
var recGovQueryUrl = "https://ridb.recreation.gov/api/v1/recareas?limit=50&offset=0&full=true&activity=" + activity + "&latitude=" + lat + "&longitude=" + long + "&radius=" + radius + "&lastupdated=10-01-2018&apikey=" + recGovApiKey;

//send request to recreation gov api
fetch(recGovQueryUrl)
  .then(function (response) {
     //start of code to redirect in the event of of 404 event
    //  if (response.status !== 200) {
    //    document.location.replace('./404.html')
    //  } else - NEED TO INCLUDE THE LINE BELOW IN THE ELSE STATEMENT
      return response.json();
    })
    .then(function (data) {
        //console.log of the returned data
        console.log("DataFromLatLongDataPull: ", data);    
    });
 }


 //THE CODE BELOW IS NEEDED EVEN IF GOV REC FETCH IS NOT USED

 //calls initial functions
function init (){
  getRedditApi ();

  //The three fetches below are for govrec data, turned off while I focus on reddit
   // getRecGovApiUsingCity();
   // getRecGovApiUsingLatLong();
   // getRecGovApiUsingState();
}

// calls init on page load
init();