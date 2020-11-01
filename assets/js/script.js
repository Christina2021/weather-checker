//Tested and linked

var myKey = hideKey.apiKey;
var cityName = "san+diego";
var lat, lon;

//console.log(myKey); //logs key

var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + myKey;
var fiveDayURL;



console.log(currentURL);


//Create button and show result = search button clicked
/*

//after creates button,, calls cityWeatherInformation

//need to save button to local storage
*/

//Show results = city button clicked
function cityWeatherInformation(){
    //Remove hidden
    $('#current-weather').removeAttr('hidden');

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
        
        $('#name-and-date').text(`${response1.name} (${month}/${date}/${year})`);


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

                /*
                //create card and card body
                //append new date, new temp, new humidity
                let newCard = $('<div>').addClass("card");
                let newCardBody = $('div').addClass("card-body");

                newCardBody.append($('<p>').text(dayMonth, dayDate, dayYear));
                newCardBody.append($('<p>').text(`Temp: ${day.temp.day} &#8457;`));   
                newCardBody.append($('<p>').text(`Humidity: ${day.humidity}%`));


                //append new card body
                newCard.append(newCardBody);

                let addTo = '#day-' + i;
                console.log(addTo);

                //append card to correct div
                $(addTo).append(newCard);
                */

            };

        });
        
    });




};

cityWeatherInformation();

//search button clicked, call function to create a button and show result

//city button clicked

//call local storage function once page opens