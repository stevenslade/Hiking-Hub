var today = moment();
$("#currentDay").text(today.format("MMM Do, YYYY"));


// sourced following from https://github.com/RyanEllingson/Weather-Dashboard/blob/master/assets/js/script.js at 8/26 PM 8/5/2021
const inputEl = document.getElementById("city-input");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const historyEl = document.getElementById("history");
const placesEl = document.getElementById("places");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
//console.log(searchHistory);

searchEl.addEventListener("click",function() {

    const searchTerm = inputEl.value;
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
        })
        historyEl.append(historyItem);
    }
}


clearEl.onclick = ()=>{
    placesEl.innerHTML = "";
}

searchEl.onclick = ()=>{
    //placesEl.add("places"); //hide info box
}

renderSearchHistory();
if (searchHistory.length > 0) {
    (searchHistory[searchHistory.length - 1]);
}
