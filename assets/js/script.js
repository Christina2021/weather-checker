//Tested and linked

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
//after creates button,, calls cityWeatherInformation
    //cityWeatherInformation();
//need to save button to local storage

    
}


//Show results = city button clicked
function cityWeatherInformation(event){

    //Remove hidden
    $('.results').removeAttr('hidden');

    //Reset
    $('#current-weather').empty();
    for (i = 1; i < 6; i++){
        let resetFiveDay = '#day-' + i;
        $(resetFiveDay).empty();
    };

    //Add City
    let cityWeatherData = '';
    cityWeatherData = event.target.id;
    cityWeatherData = cityWeatherData.toLowerCase().split(' ').join('+');
    cityName = cityWeatherData;


    currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + myKey;

    //Current Forecast
    $.ajax({
        url: currentURL,
        method: "GET"
    })
    .then(function(response1){
        console.log("currentURL object" + response1);
        //Set lat and lon for all data
        lat = response1.coord.lat;
        lon = response1.coord.lon;
        console.log(lat,lon);
        fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly,alerts&units=imperial&appid=" + myKey;

        //name of city and date called
        console.log(response1.name);
        $('.name').text(response1.name);

        let unixTime = response1.dt;
        let dateData = new Date(unixTime * 1000);
        console.log(dateData);
        let month = dateData.getMonth() + 1;
        let date = dateData.getDate();
        let year = dateData.getFullYear();
        console.log(month, date, year);
        
        $('#current-weather').append($('<h2>').addClass("mb-3").text(`${response1.name} (${month}/${date}/${year})`));


        //UV in and 5-Day Forecast
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        })
        .then(function(response2){
            console.log(fiveDayURL);
            console.log(response2);
        
            // set current temperature
            $('#current-weather').append($('<p>').html(`Temperature: ${response2.current.temp} &#8457;`));

            // set humidity            
            $('#current-weather').append($('<p>').text(`Humidity: ${response2.current.humidity}%`));

            // set wind speed
            $('#current-weather').append($('<p>').text(`Wind Speed: ${response2.current.wind_speed} MPH`));

            // set uv index
            $('#current-weather').append($('<p>').text(`UV Index: ${response2.current.uvi}`));

            // get 5 day forecast
            for (i = 1; i < 6; i++){

                let day = response2.daily[i];
                
                //next date
                let newUnixTime = day.dt;
                let newDateData = new Date(newUnixTime * 1000);
                let dayMonth = newDateData.getMonth() + 1;
                let dayDate = newDateData.getDate();
                let dayYear = newDateData.getFullYear();
                console.log(dayMonth, dayDate, dayYear);

                //next temp
                console.log((`Temp: ${day.temp.day} &#8457;`));

                //next Humidity
                console.log((`Humidity: ${day.humidity}%`));


                //Append date
                let addTo = '#day-' + i;
                console.log(addTo);

                $(addTo).append($('<h6>').text(`${dayMonth}/${dayDate}/${dayYear}`));

                $(addTo).append($('<p>').html(`Temp: ${day.temp.day} &#8457;`));

                $(addTo).append($('<p>').text(`Humidity: ${day.humidity}%`));



            };

        });
        
    });




};


//search button clicked, call function to create a button and show result
$('#search-button').click(addSearch);

//city button clicked
$('#city-buttons').click(cityWeatherInformation);


//call local storage function once page opens



//to-do still
//update city name from search feature
//add icons for UV index, conditions (cloudy/sunny/rainy/etc.)
//add city buttons to local storage
//get city buttons from local storage