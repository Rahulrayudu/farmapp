import React, { useState } from 'react';
import axios from 'axios';
import './DistrictSelectionForm.css'; // Import the CSS file for styling
import Navbar from '../components/Navbar';
import SimpleForm from './Chat';
import agr3 from "../assets/agr4.jpg"

const DistrictSelectionForm = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamilnadu', label: 'Tamil Nadu' },
    // Add more state options here
  ];

  const cityOptions = {
    maharashtra: [
      { value: 'mumbai', label: 'Mumbai' },
      { value: 'pune', label: 'Pune' },
      { value: 'nagpur', label: 'Nagpur' },
      // Add more city options for Maharashtra here
    ],
    karnataka: [
      { value: 'bangalore', label: 'Bangalore' },
      { value: 'mysore', label: 'Mysore' },
      { value: 'hubli', label: 'Hubli' },
      // Add more city options for Karnataka here
    ],
    tamilnadu: [
      { value: 'chennai', label: 'Chennai' },
      { value: 'coimbatore', label: 'Coimbatore' },
      { value: 'madurai', label: 'Madurai' },
      // Add more city options for Tamil Nadu here
    ],
    // Add more state-city mappings here
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setWeatherData(null);
    setFetchError(false);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    fetchWeatherData(e.target.value);
  };

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      const data = response.data;
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setFetchError(true);
    }
  };

  return (
    <>
    <Navbar/>
    <SimpleForm/>
    <div className="weather-forecast">
      <h1>Weather Forecast</h1>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="state" className="label">
            Select State:
          </label>
          <select id="state" value={selectedState} onChange={handleStateChange} className="select">
            <option value="">-- Select State --</option>
            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div className="form-group">
            <label htmlFor="city" className="label">
              Select City:
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
              className="select"
              disabled={!selectedState}
            >
              <option value="">-- Select City --</option>
              {cityOptions[selectedState].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedCity && (
        <div className="forecast-container">
          {weatherData ? (
            <>
              <h2>3-Day Weather Forecast for {selectedCity}, {selectedState}</h2>
              {weatherData.forecast.slice(0, 3).map((day) => (
                <div key={day.date} className="forecast-card">
                  <h3>{day.date}</h3>
                  <p>Temperature: {day.temperature}°C</p>
                  <p>Description: {day.description}</p>
                  <p>Chance of Rain: {day.chance_of_rain}%</p>
                  <p>Sunrise: {day.sunrise}</p>
                  <p>Sunset: {day.sunset}</p>
                </div>
              ))}
            </>
          ) : fetchError ? (
            <div>Error fetching weather data. Please try again.</div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default DistrictSelectionForm;
