import React from 'react';
import sunny from './sunny.jpg';  
import rainy from './rainy.jpg';
import cloudy from './cloudy.jpg';
import bgimage from './bgimage.jpg';

const WeatherDisplay = ({ weatherData, unit, onUnitToggle }) => {
  if (!weatherData) return null;

  const { main, weather, name } = weatherData;
  const temperature = unit === 'C' ? main.temp : (main.temp * 9/5) + 32;
  const description = weather[0].description

  const getBackgroundImage = (temp) => {
    if (temp > 30) return sunny;
    if (temp > 20) return rainy;
    if (temp > 10) return cloudy
    return bgimage;
  };
  const backgroundImage = getBackgroundImage();

  return (
    <div 
    className='weather-card'
    style={{ backgroundImage: `url(${backgroundImage})`}}
    >
      <h2>{name}</h2>
      <p>{description}</p>
      <p>{temperature.toFixed(2)} °{unit}</p>
      <button onClick={onUnitToggle}>Toggle to °{unit === 'C' ? 'F' : 'C'}</button>
    </div>
  );
};

export default WeatherDisplay;
