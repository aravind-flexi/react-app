import axios from 'axios';

const API_KEY = 'c7be0ad81e30ed963b62774b7f44dc20';

  export const getWeatherData = async (query) => {
  const isCoords = query.includes(',');
  const endpoint = isCoords
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${query.split(',')[0]}&lon=${query.split(',')[1]}&appid=${API_KEY}&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch weather data');
  }
};


