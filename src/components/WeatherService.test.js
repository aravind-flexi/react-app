import  getWeatherData  from './WeatherService';
import axios from 'axios';

jest.mock('axios');

test('fetches weather data by city', async () => {
  axios.get.mockResolvedValue({ data: { name: 'New York' } });
  const data = await getWeatherData('New York');
  expect(data.name).toBe('New York');
});

test('fetches weather data by coordinates', async () => {
  axios.get.mockResolvedValue({ data: { name: 'London' } });
  const data = await getWeatherData('51.5074,-0.1278');
  expect(data.name).toBe('London');
});

test('throws error if unable to fetch data', async () => {
  axios.get.mockRejectedValue(new Error('Unable to fetch weather data'));
  await expect(getWeatherData('Unknown')).rejects.toThrow('Unable to fetch weather data');
});
