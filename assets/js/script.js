//API key taken from config.js file
let myKey = hideKey.apiKey;

//If new button needs to be created
let createNewButton;

//Prevent Enter Key from doing default in input field
$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
});


//When search button is clicked: sets createNewButton to true (see cityWeatherInformation function), passes 2 city names: one that will show as entered in localStorage/button, and one that will be formatted for the api call.
function addSearch(e) {
    e.preventDefault();

    createNewButton = true;

    //Stores city name entered as-is, then clears field
    let citySearchName = $('#search-city').val();
    $('#search-city').val('');

    //Formats and stores city name for api call
    let cityButtonRevised = citySearchName.trim().toLowerCase().split(' ').join('+');

    //Runs function for results section
    cityWeatherInformation(cityButtonRevised, citySearchName);
};


//When city button clicked, 
function searchHistoryCity(event){

    //Ensures another button isn't created
    createNewButton = false;

    //Formats city name then runs function for results section
    let cityButtonClicked = '';
    cityButtonClicked = event.target.id;
    cityButtonClicked = cityButtonClicked.trim().toLowerCase().split(' ').join('+');
    cityWeatherInformation(cityButtonClicked);

};


//Function for results section to populate.  Runs API calls and adds data to html.
function cityWeatherInformation(cityAPIName,cityButtonName){

    //Resets results section fields
    $('#current-weather').empty();
    for (i = 1; i < 6; i++){
        let resetFiveDay = '#day-' + i;
        $(resetFiveDay).empty();
    };

    //URL for first API call
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityAPIName + "&units=imperial&appid=" + myKey;


    //First API call for lat/lon of city to use for second API call
    $.ajax({
        url: currentURL,
        method: "GET",
        //If city is not valid, will give an error message
        error: function() {
            $('.results').attr('hidden', true);
            alert("City name entered is not valid.  Please enter in a valid city name.");
            createNewButton = false;
            return;
        }
    })
    .then(function(response1){

        //If a new button needs to be created (city was entered in search field); also adds to localStorage
        if(createNewButton){
            //Checks to make sure a button has not already been created for the city name
            let checkCityButton = cityButtonName.trim().toLowerCase().split(' ').join('-');
            //If the button does not exist, create a new button
            if(!$("#" + checkCityButton).length){
                //Create a new button and add classes
                let newCityButton = $('<button>');
                newCityButton.addClass('btn btn-primary mb-1');
                //Creates ID based on city name; adds city name to the new button
                let cityButtonID = cityButtonName.trim().toLowerCase().split(' ').join('-');
                newCityButton.attr('id', cityButtonID);
                newCityButton.html(cityButtonName);
                //Adds new button to the site
                $('#city-buttons').prepend(newCityButton);

                //For localStorage
                //Variables for search history (allSearchHistory for all objects into an array; addSearchHistory for each object)
                let allSearchHistory = [];
                let addSearchHistory = {city: cityButtonName};
                //Gets current search history from localStorage; parse data
                allSearchHistory = JSON.parse(localStorage.getItem("citySearchHistory"));
                //If nothing currently in local storage
                if(!allSearchHistory){
                    //Search history should be an empty array
                    allSearchHistory = [];
                    //Adds first object to allSearchHistory
                    allSearchHistory[0] = addSearchHistory;
                } else {
                    //Adds new object to allSearchHistory
                    allSearchHistory.push(addSearchHistory);
                }
                //Convert object into a string to store
                localStorage.setItem("citySearchHistory",JSON.stringify(allSearchHistory));
                createNewButton = false;
            };
        };

        //Remove hidden attribute from results html
        $('.results').removeAttr('hidden');

        //Set latitude and longitude for second URL
        let lat = response1.coord.lat;
        let lon = response1.coord.lon;

        //Sets url for second API call for all data
        let fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly,alerts&units=imperial&appid=" + myKey;

        //Name and Date for current conditions
        //Assigns data to variables
        $('.name').text(response1.name);
        let unixTime = response1.dt;
        let dateData = new Date(unixTime * 1000);
        let month = dateData.getMonth() + 1;
        let date = dateData.getDate();
        let year = dateData.getFullYear();
        //Appends data to html
        $('#current-weather').append($('<h2>').addClass("mb-3").text(`${response1.name} (${month}/${date}/${year})`));
        //Add icon to h2 based on current weather conditions
        let currentWeatherCondition = response1.weather[0].main;
        let weatherConditionIcon = $('<img>');
        //Calls Function that appends weather icon
        addWeatherIcon(currentWeatherCondition);
        $('h2').append($('<span>').html(weatherConditionIcon));


        //Second API call for all weather data
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        })
        .then(function(response2){
            console.log(response2);

            //Sets and appends current temperature
            $('#current-weather').append($('<p>').html(`Temperature: ${response2.current.temp} &#8457;`));

            //Sets and appends current humidity
            $('#current-weather').append($('<p>').text(`Humidity: ${response2.current.humidity}%`));

            //Sets and appends current wind speed
            $('#current-weather').append($('<p>').text(`Wind Speed: ${response2.current.wind_speed} MPH`));

            //Sets and appends current uv index
            let uvIndexAdd = $('<p>');
            let uvIndexNumber = $('<span>');
            uvIndexNumber.addClass('p-2');
            let uvIndex = response2.current.uvi;
            $('#current-weather').append(uvIndexAdd.text(`UV Index: `));
            //Adds style based on uv index number (by adding a specific ID)
            if(uvIndex < 3){
                uvIndexNumber.attr('id', 'uv-index-low')
            } else if(uvIndex < 6){
                uvIndexNumber.attr('id', 'uv-index-moderate')
            } else if(uvIndex < 8){
                uvIndexNumber.attr('id', 'uv-index-high')
            } else if(uvIndex >= 8){
                uvIndexNumber.attr('id', 'uv-index-severe')
            } else {
                console.log("issue with uv index")
            };
            uvIndexAdd.append(uvIndexNumber.text(uvIndex));
     
            //Sets 5 day forecast
            for (i = 1; i < 6; i++){
                //For specific day
                let day = response2.daily[i];
                //Assigns data to variables
                let newUnixTime = day.dt;
                let newDateData = new Date(newUnixTime * 1000);
                let dayMonth = newDateData.getMonth() + 1;
                let dayDate = newDateData.getDate();
                let dayYear = newDateData.getFullYear();

                //Appends date
                let addTo = '#day-' + i;
                $(addTo).append($('<h6>').text(`${dayMonth}/${dayDate}/${dayYear}`));

                //Calls function to append weather icon
                weatherConditionIcon = $('<img>');
                let fiveDayWeatherCondition = day.weather[0].main;
                addWeatherIcon(fiveDayWeatherCondition);
                $(addTo).append(weatherConditionIcon);

                //Appends temperature
                $(addTo).append($('<p>').html(`Temp: ${day.temp.day} &#8457;`));

                //Appends Humidity
                $(addTo).append($('<p>').text(`Humidity: ${day.humidity}%`));
            };
        });
    

        //Function created to add weather icon
        function addWeatherIcon(setWeatherCondition){
            let iconURL; 
            switch(setWeatherCondition){
                case 'Clear':
                    iconURL = "http://openweathermap.org/img/wn/01d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Clouds':
                    iconURL = "http://openweathermap.org/img/wn/04d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;  
                case 'Drizzle':
                    iconURL = "http://openweathermap.org/img/wn/09d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Rain':
                    iconURL = "http://openweathermap.org/img/wn/10d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;      
                case 'Thunderstorm':
                    iconURL = "http://openweathermap.org/img/wn/11d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Snow':
                    iconURL = "http://openweathermap.org/img/wn/13d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Mist':
                case 'Smoke':
                case 'Haze':
                case 'Dust':
                case 'Fog':
                case 'sand':
                case 'Ash':
                case 'Squall':
                case 'Tornado':
                    iconURL = "http://openweathermap.org/img/wn/50d@2x.png";
                    weatherConditionIcon.attr('src', iconURL)
                    break;
                default: 
                    console.log("Issue with the icons");
                    console.log(setWeatherCondition);
            };
        };
    });
};


//Function that runs when page is opened; Adds buttons for cities stored in localStorage
function dispalySearchHistory() {
    //Retrieve objects from localStorage
    let searchHistory = JSON.parse(localStorage.getItem("citySearchHistory"));
    //If there are not any objects in localStorage, don't do anything else
    if(!searchHistory){
        return;
    };
    //Adds buttons for each object
    for(i = 0; i < searchHistory.length; i++){
        newCityButton = $('<button>');
        newCityButton.addClass('btn btn-primary mb-1');
        cityButtonName = searchHistory[i].city;
        cityButtonID = cityButtonName.trim().toLowerCase().split(' ').join('-');
        newCityButton.attr('id', cityButtonID);
        newCityButton.html(cityButtonName);
        //Prepends the buttons to the html
        $('#city-buttons').prepend(newCityButton);
    };
};

//When the search button is clicked:
$('#search-button').click(addSearch);

//When one of the city buttons are clicked:
$('#city-buttons').click(searchHistoryCity);

//When the page opens:
dispalySearchHistory();
