class WeatherApp {
    constructor() {
        this.API_KEY = '2b333ed048599a86837b74f51ba1d9fc' ; // 🔑 Substitua pela sua chave da OpenWeatherMap
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
        
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherInfo = document.getElementById('weatherInfo');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        
        if (!city) {
            this.showError('Por favor, digite o nome de uma cidade.');
            return;
        }

        if (!this.API_KEY || this.API_KEY === 'YOUR_API_KEY_HERE') {
            this.showError('Configure sua chave da API OpenWeatherMap no arquivo script.js');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(
                `${this.BASE_URL}?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric&lang=pt_br`
            );

            if (!response.ok) {
                throw new Error('Cidade não encontrada');
            }

            const data = await response.json();
            this.displayWeatherData(data);

        } catch (error) {
            console.error('Erro ao buscar dados do clima:', error);
            this.showError();
        }
    }

    displayWeatherData(data) {
        // Oculta loading e error
        this.hideAll();

        // Preenche os dados
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('countryName').textContent = data.sys.country;
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity + '%';
        document.getElementById('windSpeed').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
        document.getElementById('pressure').textContent = data.main.pressure + ' hPa';

        // Define o ícone do clima
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        document.getElementById('weatherIcon').alt = data.weather[0].description;

        // Mostra os dados com animação
        this.weatherInfo.classList.remove('hidden');
        setTimeout(() => {
            this.weatherInfo.classList.add('show');
        }, 50);
    }

    showLoading() {
        this.hideAll();
        this.loading.classList.remove('hidden');
    }

    showError(message = null) {
        this.hideAll();
        if (message) {
            this.errorMessage.querySelector('p').textContent = message;
        }
        this.errorMessage.classList.remove('hidden');
    }

    hideAll() {
        this.loading.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.weatherInfo.classList.add('hidden');
        this.weatherInfo.classList.remove('show');
    }
}

// Inicializa o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();

});
