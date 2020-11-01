//Tested and linked

//Prevent Enter Key from doing default
$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
});

var myKey = hideKey.apiKey;
var cityName;
var lat, lon;


//URLs needed for API calls
var currentURL;
var fiveDayURL;



//Create button and show result = search button clicked
function addSearch(e) {
    e.preventDefault();

    let newCityButton = $('<button>');
    newCityButton.addClass('btn btn-primary mb-1');
    let cityButtonName = $('#search-city').val();
    newCityButton.attr('id', cityButtonName);
    newCityButton.html(cityButtonName);

    $('#city-buttons').prepend(newCityButton);

    $('#search-city').val('');

    cityButtonName = cityButtonName.toLowerCase().split(' ').join('+');
    cityWeatherInformation(cityButtonName);
    
    //need to save button to local storage

}


//When city button clicked
function searchHistoryCity(event){

    //Add City
    let cityWeatherData = '';
    cityWeatherData = event.target.id;
    cityWeatherData = cityWeatherData.toLowerCase().split(' ').join('+');
    cityWeatherInformation(cityWeatherData);

}

//Show results
function cityWeatherInformation(cityName){

    //Remove hidden
    $('.results').removeAttr('hidden');

    //Reset
    $('#current-weather').empty();
    for (i = 1; i < 6; i++){
        let resetFiveDay = '#day-' + i;
        $(resetFiveDay).empty();
    };

    currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + myKey;

    //Current Forecast
    $.ajax({
        url: currentURL,
        method: "GET"
    })
    .then(function(response1){

        //Set lat and lon for all data
        lat = response1.coord.lat;
        lon = response1.coord.lon;
        fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly,alerts&units=imperial&appid=" + myKey;

        //name of city and date called
        $('.name').text(response1.name);

        let unixTime = response1.dt;
        let dateData = new Date(unixTime * 1000);
        let month = dateData.getMonth() + 1;
        let date = dateData.getDate();
        let year = dateData.getFullYear();
        
        $('#current-weather').append($('<h2>').addClass("mb-3").text(`${response1.name} (${month}/${date}/${year})`));
        //Add icon to h2 based on current weather conditions
        let currentWeatherCondition = response1.weather[0].main;
        let currentWeatherConditionIcon = $('<img>')


        addWeatherIcon(currentWeatherCondition);
        $('h2').append($('<span>').html(currentWeatherConditionIcon));


        //Current and 5-Day Forecast
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        })
        .then(function(response2){
        
            // set current temperature
            $('#current-weather').append($('<p>').html(`Temperature: ${response2.current.temp} &#8457;`));

            // set humidity            
            $('#current-weather').append($('<p>').text(`Humidity: ${response2.current.humidity}%`));

            // set wind speed
            $('#current-weather').append($('<p>').text(`Wind Speed: ${response2.current.wind_speed} MPH`));

            // set uv index
            let uvIndexAdd = $('<p>');
            let uvIndexNumber = $('<span>');
            uvIndexNumber.addClass('p-2');
            let uvIndex = response2.current.uvi;
            $('#current-weather').append(uvIndexAdd.text(`UV Index: `));
            //if uvIndex number, make uvIndexNumber background-color change
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
     


            // get 5 day forecast
            for (i = 1; i < 6; i++){

                let day = response2.daily[i];
                
                //next date
                let newUnixTime = day.dt;
                let newDateData = new Date(newUnixTime * 1000);
                let dayMonth = newDateData.getMonth() + 1;
                let dayDate = newDateData.getDate();
                let dayYear = newDateData.getFullYear();



                //Append date
                let addTo = '#day-' + i;

                $(addTo).append($('<h6>').text(`${dayMonth}/${dayDate}/${dayYear}`));

                //update
                currentWeatherConditionIcon = $('<img>');
                let fiveDayWeatherCondition = day.weather[0].main;

                addWeatherIcon(fiveDayWeatherCondition);
                $(addTo).append(currentWeatherConditionIcon);


                $(addTo).append($('<p>').html(`Temp: ${day.temp.day} &#8457;`));

                $(addTo).append($('<p>').text(`Humidity: ${day.humidity}%`));


            };

        });
    
        function addWeatherIcon(weatherCondition){
            let iconURL; 
            switch(weatherCondition){
                case 'Clear':
                    iconURL = "http://openweathermap.org/img/wn/01d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Clouds':
                    iconURL = "http://openweathermap.org/img/wn/04d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;  
                case 'Drizzle':
                    iconURL = "http://openweathermap.org/img/wn/09d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Rain':
                    iconURL = "http://openweathermap.org/img/wn/10d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;      
                case 'Thunderstorm':
                    iconURL = "http://openweathermap.org/img/wn/11d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;
                case 'Snow':
                    iconURL = "http://openweathermap.org/img/wn/13d@2x.png";
                    currentWeatherConditionIcon.attr('src', iconURL)
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
                    currentWeatherConditionIcon.attr('src', iconURL)
                    break;
                default: 
                    console.log("Issue with the icons");
                    console.log(weatherCondition);
            };
        };
    
    });


};


//search button clicked, call function to create a button and show result
$('#search-button').click(addSearch);

//city button clicked
$('#city-buttons').click(searchHistoryCity);


//call local storage function once page opens



//to-do still
//add city buttons to local storage
//get city buttons from local storage