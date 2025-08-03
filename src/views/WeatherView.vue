<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
        />
        <button @click="searchByCity" class="search-button" :disabled="loading">
          <span v-if="loading">Searching...</span>
          <span v-else>Search</span>
        </button>
        <br>
        <br>
        
        <!-- Error Display -->
        <div v-if="error" class="error-message">
          <strong>❌ Error:</strong> {{ error }}
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-message">
          <div class="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
        
        <!-- Weather Data Display -->
        <div v-if="weatherData && !loading" class="weather-display">
          <div class="weather-card">
            <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
            <div class="weather-main">
              <img 
                :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
                :alt="weatherData.weather[0].description"
                class="weather-icon"
              >
              <div class="temperature">{{ Math.round(weatherData.main.temp) }}°C</div>
            </div>
            <div class="weather-description">{{ weatherData.weather[0].description }}</div>
            <div class="weather-details">
              <div class="detail-item">
                <span>Feels like:</span>
                <span>{{ Math.round(weatherData.main.feels_like) }}°C</span>
              </div>
              <div class="detail-item">
                <span>Humidity:</span>
                <span>{{ weatherData.main.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span>Wind Speed:</span>
                <span>{{ weatherData.wind.speed }} m/s</span>
              </div>
              <div class="detail-item">
                <span>Pressure:</span>
                <span>{{ weatherData.main.pressure }} hPa</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!weatherData && !loading && !error">
          Please implement "Search Weather by City".
        </div>
        
        <!--The <main> tag in HTML is used to specify the main content of a document 
        More info about main, check https://www.w3schools.com/tags/tag_main.asp-->  
        <main>
          <!--If there are no data returned, then skip rendering the information-->  
          <div v-if="weatherData">
            <!--Display the weather data attribute returned from API
            Example of API data: https://openweathermap.org/current-->  
            <h2>
                {{ weatherData.name }}, {{ weatherData.sys.country }}
            </h2>
            <div>
              <!--The image source of of the weather icon will be coming from a function called iconUrl
                  which will be shared in script later-->  
              <img :src="iconUrl" alt="Weather Icon" />
              <p>{{ temperature }} °C</p>
            </div>
            <!-- weather[0] means the current weather, the way we need to obtain data depends on how
            the API JSON data looks-->
            <span>{{ weatherData.weather[0].description }}</span>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
// The info section in 10.1.1 provided detailed information about this package 
import axios from "axios";

const apikey = "48db9b2747f8a950ca7705c7f0e49062"; // Follow 10.1.2 to obtain your API key

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      loading: false,
      error: "",
      hourlyForecast: [],
      dailyForecast: [],
    };
  },

  computed: {

    temperature() {
      return this.weatherData
        ? Math.round(this.weatherData.main.temp)
        : null;
    },
    //Get the current weather icon using the API link
    iconUrl() {
      return this.weatherData
        ? `http://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },

  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {

    async fetchCurrentLocationWeather() {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;

        });
      }
    },
    

    async searchByCity() {
      if (!this.city.trim()) {
        this.error = 'Please enter a city name';
        return;
      }

      this.loading = true;
      this.error = '';
      this.weatherData = null;

      try {
        console.log('Searching for weather in:', this.city);
        
        // API URL for searching by city name
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.city)}&appid=${apikey}&units=metric`;
        
        // Fetch weather data
        await this.fetchWeatherData(url);
        
      } catch (err) {
        console.error('Weather API error:', err);
        
        // Handle different types of errors
        if (err.response && err.response.status === 401) {
          this.error = 'Invalid API key. Please check your configuration.';
        } else if (err.response && err.response.status === 404) {
          this.error = 'City not found. Please check the city name.';
        } else if (err.message.includes('Network Error')) {
          this.error = 'Network error. Please check your internet connection.';
        } else {
          this.error = err.message || 'Failed to fetch weather data';
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        //Returned data from API is stored as JSON file in weatherData
        this.weatherData = response.data;
        console.log('Weather data received:', this.weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error; // Re-throw error to be handled by calling method
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.search-input {
  padding: 10px 15px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  width: 300px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
}

.search-button {
  padding: 10px 30px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #0056b3;
}

.search-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Error Message Styles */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin: 10px 0;
  max-width: 400px;
}

/* Loading Styles */
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Weather Display Styles */
.weather-display {
  margin-top: 30px;
  max-width: 500px;
}

.weather-card {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  text-align: center;
}

.weather-card h2 {
  margin: 0 0 20px 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.weather-description {
  font-size: 1.2rem;
  text-transform: capitalize;
  margin: 15px 0;
  font-weight: 500;
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.detail-item span:first-child {
  font-weight: 500;
  opacity: 0.9;
}

.detail-item span:last-child {
  font-weight: bold;
}

/* Main section styles */
main {
  margin-top: 30px;
  padding: 20px;
}

main div {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

main h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

main div > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 15px 0;
  background: transparent;
  padding: 0;
  box-shadow: none;
}

main img {
  width: 64px;
  height: 64px;
}

main p {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 0;
}

main span {
  font-size: 1.2rem;
  color: #666;
  text-transform: capitalize;
  font-weight: 500;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .search-input {
    width: 250px;
  }
  
  .weather-display {
    max-width: 100%;
  }
  
  .weather-card {
    padding: 20px;
  }
  
  .weather-card h2 {
    font-size: 1.5rem;
  }
  
  .weather-main {
    flex-direction: column;
    gap: 10px;
  }
  
  .temperature {
    font-size: 2.5rem;
  }
  
  .weather-details {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .error-message {
    max-width: 100%;
  }
}
</style>
