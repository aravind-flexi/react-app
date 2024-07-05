import React from 'react';

const WeatherDisplay = ({ weatherData, unit, onUnitToggle }) => {
  if (!weatherData) return null;

  const { main, weather, name , description} = weatherData;
  const temperature = unit === 'C' ? main.temp : (main.temp * 9/5) + 32;

  return (
    <div className={`App ${weatherData && weatherData.temp > 25 ? 'sunny' : 'App'}`}>
      <h2>{name}</h2>
      <p>{weather[0].description}</p>
      <p>{temperature.toFixed(2)} °{unit}</p>
      <button onClick={onUnitToggle}>Toggle to °{unit === 'C' ? 'F' : 'C'}</button>
    </div>
  );
};

export default WeatherDisplay;
