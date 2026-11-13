const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const mainIcon = document.querySelector("#weather-icon");

async function getWeather(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const location = data.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        console.log(location);
        console.log(latitude);
        console.log(longitude);

        const weatherURL = new URL("https://api.open-meteo.com/v1/forecast")

        weatherURL.searchParams.set("latitude", latitude);
        weatherURL.searchParams.set("longitude", longitude);
        weatherURL.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code");
        weatherURL.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
        weatherURL.searchParams.set("timezone", "auto");
        weatherURL.searchParams.set("forecast_days", 8);
        console.log(weatherURL.toString());

        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();
        const current_temp = weatherData.current.temperature_2m;
        const current_humidity = weatherData.current.relative_humidity_2m;
        const feels_like_temp = weatherData.current.apparent_temperature;
        const rain = weatherData.current.precipitation;
        const wind_speed = weatherData.current.wind_speed_10m;
        const weather_code = weatherData.daily.weather_code;
        const max_temp = weatherData.daily.temperature_2m_max;
        const min_temp = weatherData.daily.temperature_2m_min;
        const daily_dates = weatherData.daily.time;
        const current_weather_code = weatherData.current.weather_code

        console.log(weatherData)

        return {
            city: location.name,
            country: location.country,
            current_temp,
            current_humidity,
            feels_like_temp,
            rain,
            wind_speed,
            weather_code,
            max_temp,
            min_temp,
            daily_dates,
            current_weather_code
        };
    } else {
        console.log("City not found");
        return null;
    }
}

async function weatherDetails() {
    if (cityInput.value.trim() === "") {
        return;
    } else {
        const weather = await getWeather(cityInput.value);
        if (!weather) return;
        mainIcon.src = getWeatherIcon(weather.current_weather_code);
        const cityName = document.querySelector("#city-name")
        const currentTemp = document.querySelector("#current-temp");
        const currentDate = document.querySelector("#date");
        const feelsLike = document.querySelector("#feels-like-temp");
        const currentHumidity = document.querySelector("#humidity");
        const windSpeed = document.querySelector("#wind");
        const ppt = document.querySelector("#rain");
        const today = new Date();

        const formattedDate = today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        })

        const forecastCards = document.querySelectorAll(".forecast-card");

        for (let i = 0; i < forecastCards.length; i++) {
            const dayElement = forecastCards[i].querySelector(".day");
            const maxTempElement = forecastCards[i].querySelector(".max-temp");
            const minTempElement = forecastCards[i].querySelector(".min-temp");

            const [year, month, date] = weather.daily_dates[i + 1].split("-").map(Number);
            const maxTemp = weather.max_temp[i + 1];
            const minTemp = weather.min_temp[i + 1];
            const weatherCode = weather.weather_code[i + 1];
            const day = new Date(year, month - 1, date).toLocaleDateString("en-IN", {
                weekday: "short"
            })
            const forecastIcon = forecastCards[i].querySelector(".forecast-icon");

            dayElement.textContent = day;
            maxTempElement.textContent = `${maxTemp}°C`;
            minTempElement.textContent = `${minTemp}°C`;
            
            forecastIcon.src = getWeatherIcon(weatherCode);
        }

            cityName.textContent = `${weather.city}, ${weather.country}`;
            currentTemp.textContent = `${weather.current_temp}°C`;
            currentDate.textContent = formattedDate
            feelsLike.textContent = `${weather.feels_like_temp}°C`;
            currentHumidity.textContent = `${weather.current_humidity}%`
            windSpeed.textContent = `${weather.wind_speed}km/h`;
            ppt.textContent = `${weather.rain}mm`;

            
    }
}

function getWeatherIcon(code) {
    if (code === 0 || code === 1) {
        return "sun.png"
    }

    if (code === 2) {
        return "partly cloudy.png"
    }

    if (code === 3 || code === 45 || code === 48) {
        return "cloudy.png"
    }

    if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
        return "rainy.png";
    }

    if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
        return "heavy-rain.png"
    }

    if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
        return "snow.png";
    }

    if (code === 95 || code === 96 || code === 99) {
        return "thunderstorm.png";
    }
}
searchBtn.addEventListener("click", () => {
    weatherDetails();
})

cityInput.addEventListener('keydown', (event => {
    if (event.key !== "Enter") {
        return;
    } else {
        weatherDetails();
    }
}))