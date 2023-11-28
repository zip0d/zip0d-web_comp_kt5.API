class ВиджетПогоды extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.fetchWeatherData();
    }

    celsiusToFahrenheit(celsius) {
        return celsius * 9 / 5 + 32;
    }

    displayValue(value, unit = '') {
        return value !== undefined && value !== 'N/A' ? `${value} ${unit}` : 'Нет данных';
    }

    getShortDescription(description) {
        const descriptionsMap = {
            'clear sky': 'Ясно',
            'few clouds': 'Мало облаков',
            'scattered clouds': 'Разбросанные облака',
            'broken clouds': 'Облачно с прояснениями',
            'overcast clouds': 'Пасмурно',
            'light rain': 'Небольшой дождь',
            'moderate rain': 'Умеренный дождь',
            'heavy intensity rain': 'Сильный дождь',
            'light snow': 'Небольшой снег',
            'moderate snow': 'Умеренный снег',
            'heavy snow': 'Сильный снег',
            'mist': 'Туман',
            'fog': 'Густой туман',
        };

        return descriptionsMap[description.toLowerCase()] || description;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --цвет-фона-виджета: #ff6666;
                    --цвет-текста-виджета: #000;
                    --размер-шрифта-виджета: 16px;
                }

                #инфо-погоды {
                    background-color: var(--цвет-фона-виджета);
                    color: var(--цвет-текста-виджета);
                    font-size: var(--размер-шрифта-виджета);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                #инфо-погоды h1 {
                    color: #470a0a;
                }
            </style>
            <div id="инфо-погоды">
                <h1>Информация о погоде</h1>
                <p id="температура"></p>
                <p id="ощущается-как"></p>
                <p id="условия"></p>
                <p id="ветер"></p>
                <p id="давление"></p>
                <p id="влажность"></p>
                <p id="видимость"></p>
                <p id="облачность"></p>
                <p id="восход"></p>
                <p id="заход"></p>
                <p id="осадки"></p>
                <p id="дождь"></p>
                <p id="снег"></p>
                <p id="направление-ветра"></p>
            </div>
        `;
    }

    fetchWeatherData() {
        const apiKey = 'dd5f3a82b623c4a7d261ad991ba50c73';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${apiKey}`;

        const realApiUrl = apiUrl.replace('{lat}', '55.7522').replace('{lon}', '37.6156');

        fetch(realApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Сетевой ответ не был успешным');
                }
                return response.json();
            })
            .then(data => {
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const conditions = data.weather[0].description;
                const windSpeed = data.wind.speed;
                const pressure = data.main.pressure;
                const humidity = data.main.humidity;
                const visibility = data.visibility;
                const cloudiness = data.clouds.all;
                const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                const precipitation = data.weather[0].main === 'Rain' || data.weather[0].main === 'Snow' ? 'Да' : 'Нет';
                const rainVolume = data.rain && data.rain['1h'] !== undefined ? `${data.rain['1h']} мм` : 'N/A';
                const snowVolume = data.snow && data.snow['1h'] !== undefined ? `${data.snow['1h']} мм` : 'N/A';
                const uvIndex = data.uvi !== undefined ? data.uvi : 'Нет данных';
                const dewPoint = data.main.dew_point !== undefined ? `${data.main.dew_point}°C` : 'Нет данных';
                const windDirection = data.wind.deg;

                const temperatureFahrenheit = this.celsiusToFahrenheit(temperature);
                const feelsLikeFahrenheit = this.celsiusToFahrenheit(feelsLike);

                this.shadowRoot.getElementById('температура').innerText = `Температура: ${this.displayValue(temperatureFahrenheit.toFixed(2), '°F')}`;
this.shadowRoot.getElementById('ощущается-как').innerText = `Ощущается как: ${this.displayValue(feelsLikeFahrenheit.toFixed(2), '°F')}`;
this.shadowRoot.getElementById('условия').innerText = `Условия: ${this.getShortDescription(conditions)}`;
this.shadowRoot.getElementById('ветер').innerText = `Скорость ветра: ${this.displayValue(windSpeed)} м/с`;
this.shadowRoot.getElementById('давление').innerText = `Давление: ${this.displayValue(pressure)} гПа`;
this.shadowRoot.getElementById('влажность').innerText = `Влажность: ${this.displayValue(humidity)}%`;
this.shadowRoot.getElementById('видимость').innerText = `Видимость: ${this.displayValue(visibility)} метров`;
this.shadowRoot.getElementById('облачность').innerText = `Облачность: ${this.displayValue(cloudiness)}%`;
this.shadowRoot.getElementById('восход').innerText = `Восход солнца: ${sunrise}`;
this.shadowRoot.getElementById('заход').innerText = `Заход солнца: ${sunset}`;
this.shadowRoot.getElementById('осадки').innerText = `Осадки: ${precipitation}`;
this.shadowRoot.getElementById('дождь').innerText = `Дождь: ${this.displayValue(rainVolume)}`;
this.shadowRoot.getElementById('снег').innerText = `Снег: ${this.displayValue(snowVolume)}`;
this.shadowRoot.getElementById('направление-ветра').innerText = `Направление ветра: ${this.displayValue(windDirection)}°`;
this.shadowRoot.getElementById('уф-индекс').innerText = `УФ-индекс: ${this.displayValue(uvIndex)}`;
this.shadowRoot.getElementById('точка-росы').innerText = `Точка росы: ${this.displayValue(dewPoint)}°C`;

            })
            .catch(error => {
                console.error('Ошибка при получении данных о погоде:', error);
            });
    }
}

customElements.define('weather-widget', ВиджетПогоды);
