document.addEventListener("DOMContentLoaded", function () {

    class WeatherApp {
        constructor(apiKey, resultsBlockSelector) {
            this.apiKey = apiKey;
            this.resultsBlock = document.querySelector(resultsBlockSelector);
        }
        getCurrentWeather(query, callback) {
            const q = encodeURIComponent(query);
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
                q + "&appid=" + this.apiKey + "&units=metric&lang=pl";

            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.onload = function () {
                const data = JSON.parse(xhr.responseText);
                console.log("Current weather:", data);
                callback(data);
            };

            xhr.send();
        }
        getForecast(query, callback) {
            const q = encodeURIComponent(query);
            const url = "https://api.openweathermap.org/data/2.5/forecast?q=" +
                q + "&appid=" + this.apiKey + "&units=metric&lang=pl";
            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log("Forecast:", data);
                    callback(data);
                });
        }
        getWeather(query) {
            this.resultsBlock.innerHTML = `<div style="padding:10px">Ładowanie danych…</div>`;

            const self = this;

            this.getCurrentWeather(query, function (currentData) {
                self.getForecast(query, function (forecastData) {

                    self.currentWeather = currentData;
                    self.forecast = Array.isArray(forecastData.list) ? forecastData.list : [];

                    self.drawWeather();
                });
            });
        }
        drawWeather() {
            this.resultsBlock.innerHTML = "";

            const w = this.currentWeather;
            const date = new Date(w.dt * 1000);

            const icon = w.weather[0] ? w.weather[0].icon : "";
            const desc = w.weather[0] ? w.weather[0].description : "";

            this.resultsBlock.appendChild(
                this.createWeatherBlock(
                    date.toLocaleDateString("pl-PL") + " " + date.toLocaleTimeString("pl-PL"),
                    w.main.temp,
                    w.main.feels_like,
                    icon,
                    desc
                )
            );

            const header = document.createElement("div");
            header.style.margin = "8px 0";
            header.innerHTML = "<strong>Prognoza (co ~24h):</strong>";
            this.resultsBlock.appendChild(header);

            for (let i = 0; i < this.forecast.length; i += 8) {
                const f = this.forecast[i];
                const dateF = new Date(f.dt * 1000);

                const iconF = f.weather[0] ? f.weather[0].icon : "";
                const descF = f.weather[0] ? f.weather[0].description : "";

                this.resultsBlock.appendChild(
                    this.createWeatherBlock(
                        dateF.toLocaleDateString("pl-PL") + " " + dateF.toLocaleTimeString("pl-PL"),
                        f.main.temp,
                        f.main.feels_like,
                        iconF,
                        descF
                    )
                );
            }
        }
        createWeatherBlock(dateString, temp, feel, iconName, description) {
            const div = document.createElement("div");
            div.className = "day-weather";

            let iconHtml = "";
            if (iconName) {
                iconHtml = '<img class="weather-icon" src="https://openweathermap.org/img/wn/' +
                    iconName + '@2x.png">';
            }

            div.innerHTML = `
                <div class="date-header"><div class="date">${dateString}</div></div>
                <div class="weather-details">
                    <div class="icon-cont">${iconHtml}</div>
                    <div class="weather-info">
                        <p class="temp">${roundOrNA(temp)} °C</p>
                        <p class="temp-feel">Odczuwalna: <span class="feel">${roundOrNA(feel)} °C</span></p>
                        <p class="description">${description}</p>
                    </div>
                </div>
            `;
            return div;
        }
    }
    function roundOrNA(v) {
        if (v === undefined || v === null) return "n/d";
        return Math.round(v);
    }

    const weatherApp = new WeatherApp("89565e1faa6eb76283cb63a8113588e3", "#weather-cont");

    const btn = document.querySelector("#search-button");
    const input = document.querySelector("#city-input");

    btn.addEventListener("click", function () {
        const q = input.value.trim();
        if (q) weatherApp.getWeather(q);
    });

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") btn.click();
    });
});
