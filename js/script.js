'use strict';

const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
const apiKey = '4a9b81a231ba483f93b029be3544efcb';
const weekdays = {
	0: 'Dom',
	1: 'Seg',
	2: 'Ter',
	3: 'Qua',
	4: 'Qui',
	5: 'Sex',
	6: 'Sáb'
}
	// starting city.
	getForecast('São Paulo');

// button getting the weather forecast.
$('#search').click(function(event) {
//prevents the page from acting as if you were submitting a form.
	event.preventDefault();
	const newCity = $('#city').val();

	getForecast(newCity);
});

//get information from the city using the input from the text box
function getForecast(city) {
	$('#loader').css('display', '');
	$('#forecast').css('display', 'none');
	clearFields();

	$.ajax({
		url: baseURL,
		data: {

			key: apiKey,
			city: city,
			lang: 'pt'

		},
		success: function(result) {
			$('#loader').css('display', 'none');
			$('#forecast').css('display', '');
			
			$('#city-name').text(result.city_name);

			const forecast = result.data;

			const today = forecast[0];
			displayToday(today);

			const nextDays = forecast.slice(1);
			displayNextDays(nextDays);
		},
		error: function(error) {
			console.log(error.responseText);
		}
	});
}

// it goes into the nest-days element and cleans everything inside it.
function clearFields() {
	$('#next-days').empty();
}

//uses Api's information to show today's forecast
//also sets the icon for each time.
function displayToday(today) {
	const temperature = Math.round(today.temp);
	const windSpeed = today.wind_spd;
	const humidity = today.rh;
	const weather = today.weather.description;
	const icon = today.weather.icon;
	const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
	
	$('#current-temperature').text(temperature);
	$('#current-wind').text(windSpeed);
	$('#current-humidity').text(humidity);
	$('#current-weather').text(weather);

	$('#weather-icon').attr('src', iconURL);
}

//Shows the forecast of the next days
//Showing also the date, the maximum and minimum of each day  
function displayNextDays(nextDays) {
	for(let i = 0; i < nextDays.length; i = i + 1) {
	const day = nextDays[i];
	const min = Math.round(day.min_temp);
	const max = Math.round(day.max_temp);
	const date = new Date(day.valid_date);
	const weekday = weekdays[date.getUTCDay()];

	const card = $(`<div class="day-card">
		          <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
		          <div class="weekday">${weekday}</div>
		          <div class="temperatures">
		            <span class="max">${max}°</span>
		            <span class="min">${min}°</span>
		          </div>
		        </div>`);
	card.appendTo('#next-days');
	}
}