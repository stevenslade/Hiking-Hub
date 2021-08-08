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

//calls initial functions
function init (){
  getRedditApi ();
}

// calls init on page load
init();



