//Setting up the API key
const APIURL = "https://api.openweathermap.org";
const APIKey = "aef5ffbba81df0d918fb7c776222cdb5";

//Setting up variables to pick relevant html elements
let searchInput = $("#search-input");
let searchForm = $("#search-form");

//Setting up a variable to store history searches
let searchHistory = [];
let searchHistoryStorage = $("#history");

//Setting up a function to render search history
function getSearchHistory() {
    searchHistoryStorage.html("");
    for(let i = 0; i < searchHistory.length; i++){
        let btn =$("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history");
        btn.attr("data-search", searchHistory[i]);
        btn.text(searchHistory[i]);
        searchHistoryStorage.append(btn);
    }
}

function appendSearchHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    getSearchHistory()
}


function startHistory(){
    let storedHistory = localStorage.getItem("search-history");
    if(storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    getSearchHistory()
}

startHistory()


