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


function init (){
    getRecGovApiUsingCity();
    getRecGovApiUsingLatLong();
    getRecGovApiUsingState();
}

// calls init on page load
init();