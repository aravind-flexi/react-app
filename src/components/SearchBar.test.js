import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders search bar', () => {
  render(<SearchBar onSearch={jest.fn()} />);
  expect(screen.getByPlaceholderText(/Enter city or zip code/i)).toBeInTheDocument();
});

test('calls onSearch with input value on search button click', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  const input = screen.getByPlaceholderText(/Enter city or zip code/i);
  fireEvent.change(input, { target: { value: 'New York' } });
  fireEvent.click(screen.getByText(/search/i));
  expect(onSearch).toHaveBeenCalledWith('New York');
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
