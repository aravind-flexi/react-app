import  {getWeatherData}  from './WeatherService';
import axios from 'axios';

jest.mock('./WeatherService.js');
describe('Weather App', () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });

  test('fetches weather data by city', async () => {
    getWeatherData.mockResolvedValue({ name: 'New York' });
    const data = await getWeatherData('New York');
    expect(data.name).toBe('New York');
  });
  

test('fetches weather data by coordinates', async () => {
  getWeatherData.mockResolvedValue({ name: 'London' });
  const data = await getWeatherData('51.5074,-0.1278');
  expect(data.name).toBe('London');
});

test('throws error if unable to fetch data', async () => {
  getWeatherData.mockRejectedValue(new Error('Unable to fetch weather data'));
  await expect(getWeatherData('Unknown')).rejects.toThrow('Unable to fetch weather data');
});
});
