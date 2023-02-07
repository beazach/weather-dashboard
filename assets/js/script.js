//Setting up the API key
const APIURL = "https://api.openweathermap.org";
const APIKey = "aef5ffbba81df0d918fb7c776222cdb5";

//Setting up variables to pick relevant html elements
let searchInput = $("#search-input");
let searchForm = $("#search-form");

//Setting up a variable to store history searches
let searchHistory = [];
let searchHistoryStorage = $("#history");

//Setting up a variable to store today weather value
let todayContainer = $("#today");

//Setting up a variable to store forecast weather values
let forecastStorage = $("#forecast");

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

//Extracting relevant data from the data set
function getCurrentWeather(city, data) {
   let date = moment().format("D/M/YYYY");
   let temp = data["main"]["temp"];
   let wind = data["wind"]["speed"];
   let humidity = data["main"]["humidity"];
   let iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`; //generating weather icon
   let iconDescription = data.weather[0].description || data[0].main;
//Creating cards
   let card = $("<div>")
   let cardBody = $("<div>")
   let icon = $("<img>")
   let heading = $("<h2>")
   let tempEl = $("<p>")
   let windEl = $("<p>")
   let humidityEl = $("<p>")
   card.attr("class", "card");
   cardBody.attr("class", "card-body bg-tertiary");
   card.append(cardBody);
   heading.attr("class", "h2 card-title");
   tempEl.attr("class", "card-text");
   windEl.attr("class", "card-text");
   humidityEl.attr("class", "card-text");
   heading.text(`${city} ${date}`);
   icon.attr("src", iconURL);
   icon.attr("alt", iconDescription);
   heading.append(icon);
   tempEl.text(`Temp ${temp} C`);
   windEl.text(`Wind ${wind} KpH`);
   humidityEl.text(`Humidity ${humidity} %`);
   cardBody.append(heading, tempEl, windEl, humidityEl);
   todayContainer.html("");
   todayContainer.append(card);
}

function getForecast(data){
   let headingCol = $("<div>");
   let heading = $("<h4>");
   headingCol.attr("class", "col-12");
   heading.text("5-day Forecast");
   headingCol.append(heading);
   forecastStorage.html("");
   forecastStorage.append(headingCol);

   let futureForecast = data.filter(function(forecast){
       return forecast.dt_txt.includes("5")
   })
   for(let i = 0; i < futureForecast.length; i++){
       let iconURL = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`
       let iconDescription = futureForecast[i].weather[0]. description;
       let temp = futureForecast[i].main.temp;
       let humidity = futureForecast[i].main.humidity;
       let wind = futureForecast[i].wind.speed;
       let col = $("<div>");
       let card = $("<div>");
       let cardTitle = $("<h5>");
       let cardBody = $("<div>");
       let icon = $("<img>");
       let heading = $("<h2>");
       let tempEl = $("<p>");
       let windEl = $("<p>");
       let humidityEl = $("<p>");
       col.append(card);
       card.append(cardBody);
       cardBody.append(cardTitle, icon, tempEl, windEl, humidityEl);
       col.attr("class", "col-md");
       card.attr("class", "card bg-secondary h-200 text-white");
       cardTitle.attr("class", "card-title");
       tempEl.attr("class", "card-text");
       windEl.attr("class", "card-text");
       humidityEl.attr("class", "card-text");
       cardTitle.text(moment(futureForecast[i].dt_txt).format("D/M/YYYY"));
       icon.attr("src", iconURL);
       icon.attr("alt", iconDescription);
       tempEl.text(`Temp ${temp} C`);
       windEl.text(`Wind ${wind} KpH`);
       humidityEl.text(`Humidity ${humidity} %`);
       forecastStorage.append(col);
   }
}

function getWeather(location){
   let latitude = location.lat;
   let longitude = location.lon;
   let city = location.name;
   let queryWeatherURL = `${APIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`
   console.log(queryWeatherURL);
   $.ajax({
       url: queryWeatherURL,
       method: "GET"
   }).then(function(response){
       getCurrentWeather(city, response.list[0])
       getForecast(response.list);
   });
}

//Setting up a function to fetch coordinates & pushing search history in local storage)
function getCoordinates(search) {
   let queryURL = `${APIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${APIKey}`;
   fetch(queryURL, { method: "GET"})
   .then(function(data){
       return data.json()
   }).then(function(response){
       if(!response[0]) {
           alert("No location in the database")
       } else {
           appendSearchHistory(search);
           getWeather(response[0]);
       }
   })
}

function startHistory(){
   let storedHistory = localStorage.getItem("search-history");
   if(storedHistory) {
       searchHistory = JSON.parse(storedHistory);
   }
   getSearchHistory()
}

//Setting up a function for search form submission
function submitSearchForm(event){
   event.preventDefault();
   let search = searchInput.val().trim();
   getCoordinates(search);
   searchInput.val("");
}

function getSearchHistoryClicks(event){
   if(!$(event.target).hasClass("history-btn btn-history")){
       return
   }
   let search = $(event.target).attr("data-search");
   getCoordinates(search);
   searchInput.val("")
}

startHistory()
searchForm.on("submit", submitSearchForm);
searchHistoryStorage.on("click", getSearchHistoryClicks)