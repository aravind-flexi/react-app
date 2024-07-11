import { render, screen, fireEvent } from '@testing-library/react';
import WeatherDisplay from './WeatherDisplay';

const mockWeatherData = {
  main: { temp: 20 },
  weather: [{ main: 'Sunny', description: 'clear sky' }],
  name: 'New York'
};

test('renders weather display with data', () => {
  render(<WeatherDisplay weatherData={mockWeatherData} unit="C" onUnitToggle={jest.fn()} />);
  expect(screen.getByText(/New york/i)).toBeInTheDocument();
  expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
  expect(screen.getByText(/20.00 °C/i)).toBeInTheDocument();
});

test('toggles units on button click', () => {
  const onUnitToggle = jest.fn();
  render(<WeatherDisplay weatherData={mockWeatherData} unit="C" onUnitToggle={onUnitToggle} />);
  fireEvent.click(screen.getByText(/toggle to °f/i));
  expect(onUnitToggle).toHaveBeenCalled();
});
