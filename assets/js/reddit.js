//Variables for dynamic HTML
//Don't need any yet

//Start of the reddit fetch, they still use the init function called at the bottom

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


function createAppendReddit () {
  // make variables of dataset items - currently placeholders
  var title = "Title";
  var 

  //create the elements for each dataset item

  //append the dataset elements to a container

  //attach a class to the container

  //attach the container to the anchor point "reddit"

}

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