import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import  {getWeatherData}  from './components/WeatherService';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    try {
      const data = await getWeatherData(query);
      setWeatherData(data);
      console.log(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error">{error}</p>}
      <WeatherDisplay weatherData={weatherData} unit={unit} onUnitToggle={handleUnitToggle} />
    </div>
  );
};

export default App;


