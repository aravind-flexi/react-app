import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './components/WeatherService';

jest.mock('./components/WeatherService.js');

describe('Weather App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders input and buttons', () => {
        render(<App />);
        expect(screen.getByPlaceholderText(/Enter city or zip code/i)).toBeInTheDocument();
        expect(screen.getByText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Use My Location/i)).toBeInTheDocument();
    });

    test('handles city search and displays weather data', async () => {
        api.default = jest.fn().mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'London' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText((content, element) => element.textContent.includes('London'))).toBeInTheDocument());
        expect(screen.getByText((content, element) => element.textContent.includes('15°C'))).toBeInTheDocument();
        expect(screen.getByText((content, element) => element.textContent.includes('clear sky'))).toBeInTheDocument();
    });

    test('handles geo-location search and displays weather data', async () => {
        api.default = jest.fn().mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        global.navigator.geolocation = {
            getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
                success({ coords: { latitude: 51.5074, longitude: -0.1278 } })
            ),
        };

        render(<App />);
        fireEvent.click(screen.getByText(/Use My Location/i));

        await waitFor(() => expect(screen.getByText((content, element) => element.textContent.includes('London'))).toBeInTheDocument());
        expect(screen.getByText((content, element) => element.textContent.includes('15°C'))).toBeInTheDocument();
        expect(screen.getByText((content, element) => element.textContent.includes('clear sky'))).toBeInTheDocument();
    });

    test('toggles temperature unit', async () => {
        api.default.mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'London' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText((content, element) => element.textContent.includes('15°C'))).toBeInTheDocument());
        fireEvent.click(screen.getByText(/Toggle to °F/i));
        expect(screen.getByText((content, element) => element.textContent.includes('59°F'))).toBeInTheDocument();
    });

    test('handles errors', async () => {
        api.default.mockRejectedValueOnce(new Error('Unable to fetch weather data'));

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'InvalidCity' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText(/Unable to fetch weather data. Please try again./i)).toBeInTheDocument());
    });
});


