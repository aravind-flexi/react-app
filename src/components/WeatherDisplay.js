import React from 'react';
import sunny from './sunny.jpg';  
import rainy from './rainy.jpg';
import cloudy from './cloudy.jpg';
import bgimage from './bgimage.jpg'

const WeatherDisplay = ({ weatherData, unit, onUnitToggle }) => {
  if (!weatherData) return null;

  const { main, weather, name } = weatherData;
  const temperature = unit === 'C' ? main.temp : (main.temp * 9 / 5) + 32;
  const description = weather[0].description;

  const getBackgroundImage = (tempCelsius) => {
    if (tempCelsius > 30) return sunny;
    if (tempCelsius > 20) return cloudy;
    if (tempCelsius > 10) return rainy;
    return bgimage;
  };
  const backgroundImage = getBackgroundImage(main.temp);

  return (
    <div className="weather-card"
    style={{backgroundImage: `url(${backgroundImage})`}}	>
      <h2 data-testid='cityname'>{name}</h2>
      <p data-testid='info'>{description}</p>
      <p data-testid='temp'>{temperature.toFixed(2)} °{unit}</p>
      <button data-testid='btn' onClick={onUnitToggle}>Toggle to °{unit === 'C' ? 'F' : 'C'}</button>
    </div>
  );
};
export default WeatherDisplay;