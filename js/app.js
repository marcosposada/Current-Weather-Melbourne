$(document).foundation();

//  First variables

var fahrenheit = {};
var celsius = {};

//  API Key for Weather Service
//  Source: http://openweathermap.org/

var apiKey = '437b012d6b13e975f85e950f7b921b03';

//  Converts number to string and rounds value.

function rounder(value){
    var value = value;
    //  Convert value to string
    value = value.toString();
    // Split string by delimiter and return rounded result
    value = value.split('.')[0];

    return value;
}

//  Function to convert temperature from Kelvin to Celsius / Fahrenheit
//  Stores in array for later use

function tempConverter(temperatures) {

    var temperatures = temperatures;

    var current = temperatures[0];
    var min = temperatures[1];
    var max = temperatures[2];

    fahrenheit = {
        current:    rounder((( current - 273.15) * 9/5) + 32),
        min:        rounder((( min - 273.15) * 9/5) + 32),
        max:        rounder((( max - 273.15) * 9/5) + 32)
    };

    celsius = {
        current:    rounder(current - 273.15),
        min:        rounder(min - 273.15),
        max:        rounder(max - 273.15)
    };
    return celsius;
}

function timeConverter(time){
    var time = time;

    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(time*1000);
    // Hours part from the timestamp
        var hours = date.getHours();
    // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();

    // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var time = hours + ':' + minutes.substr(-2);
    return time;
}

// Get user location from load

$.getJSON('http://ipinfo.io',
    function(location){
        $.fn.delegateJSONResult(location);
    }
);

// Process data straight away from result

$.fn.delegateJSONResult = function(location){

    var currentCity = location.city + ',' + location.country;

    //  Establish API call to get current weather data based on location
    var apiRequest = 'http://api.openweathermap.org/data/2.5/weather?q='+ currentCity + '&appid=' + apiKey;

    $.getJSON(apiRequest,
        function(result){

            //  Fade In after successful request
            //  Display by default on Celsius

            $('.block-city').fadeIn();

            //  Current City and Temperature

            var temperatures = [
                result.main.temp,
                result.main.temp_min,
                result.main.temp_max
            ];

            tempConverter(temperatures);

            $('.current-city').html(result.name);
            $('.heading').fadeIn();

            $('.degree-value').html(celsius.current);
            $('.temperature').fadeIn();

            //  Weather

            $('.weather-value').html(result.weather[0].main);
            $('.min-temp span').html(celsius.min);
            $('.max-temp span').html(celsius.max);

            //  Humidity
            $('.humidity .detail-value').html(result.main.humidity);

            //  Wind
            $('.wind .detail-value').html(result.wind.speed + ' M/S');

            //  Sunrise
            $('.sunrise .detail-value').html(timeConverter(result.sys.sunrise));

            //  Sunset
            $('.sunset .detail-value').html(timeConverter(result.sys.sunset));

        }
    );
}

//  Toggle Functions

$('.fahrenheit').click(function(){
    $(this).addClass('active');
    $('.degree-value').html(fahrenheit.current);
    $('.min-temp span').html(fahrenheit.min);
    $('.max-temp span').html(fahrenheit.max);
    $('.celsius').removeClass('active');
});

$('.celsius').click(function(){
    $(this).addClass('active');
    $('.degree-value').html(celsius.current);
    $('.min-temp span').html(celsius.min);
    $('.max-temp span').html(celsius.max);
    $('.fahrenheit').removeClass('active');
});