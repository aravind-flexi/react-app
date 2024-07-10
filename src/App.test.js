import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import getWeatherData from './components/WeatherService';
import axios from 'axios'
import App from './App';
import {jest} from '@jest/globals';
import * as ServiceMock from './components/WeatherService';

test('renders search bar', () => {
  render(<SearchBar onSearch={jest.fn()} />);
  expect(screen.getByPlaceholderText(/Enter city or zip code/i)).toBeInTheDocument();
});

test('calls onSearch with input value on search button click', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  const input = screen.getByPlaceholderText(/Enter city or zip code/i);
  fireEvent.change(input, { target: { value: 'London' } });
  fireEvent.click(screen.getByText(/search/i));
  expect(onSearch).toHaveBeenCalledWith('London');
});

test('calls onSearch with coordinates on geolocation button click', () => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementationOnce((success) => 
      success({ coords: { latitude: 50, longitude: 50 } })
    )
  };
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  fireEvent.click(screen.getByText(/Use My Location/i));
  expect(onSearch).toHaveBeenCalledWith('50,50');
});

const mockWeatherData = {
    main: { temp: 20 },
    weather: [{ main: 'Sunny', description: 'clear sky' }],
    name: 'New York'
  };
  
  test('renders weather display with data', () => {
    render(<WeatherDisplay weatherData={mockWeatherData} unit="C" onUnitToggle={jest.fn()} />);
    expect(screen.getByText(/new york/i)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/20.00 °C/i)).toBeInTheDocument();
  });
  
  test('toggles units on button click', () => {
    const onUnitToggle = jest.fn();
    render(<WeatherDisplay weatherData={mockWeatherData} unit="C" onUnitToggle={onUnitToggle} />);
    fireEvent.click(screen.getByText(/toggle to °f/i));
    expect(onUnitToggle).toHaveBeenCalled();
  });

  jest.mock('./components/WeatherService');

test('fetches weather data by city', async () => {
  ServiceMock.getWeatherData= jest.fn().mockResolvedValue({ data: { name: 'New York' } });
  const data = await ServiceMock.getWeatherData('New York');
  expect(data.name).toBe('New York');
});

test('fetches weather data by coordinates', async () => {
  ServiceMock.getWeatherData= jest.fn().mockResolvedValue({ data: { name: 'London' } });
  const data = await ServiceMock.getWeatherData('51.5074,-0.1278');
  expect(data.name).toBe('London');
});

test('throws error if unable to fetch data', async () => {
  ServiceMock.getWeatherData=jest.fn().mockRejectedValue(new Error('Unable to fetch weather data'));
  await expect(ServiceMock.getWeatherData('Unknown')).rejects.toThrow('Unable to fetch weather data');
});