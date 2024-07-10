// src/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './components/WeatherService';

jest.mock('./components/WeatherService');

describe('Weather App', () => {
    test('renders input and buttons', () => {
        render(<App />);
        expect(screen.getByPlaceholderText(/Enter city or zip code/i)).toBeInTheDocument();
        expect(screen.getByText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Use My Location/i)).toBeInTheDocument();
    });

    test('handles city search', async () => {
        api.getWeatherData=jest.fn().mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'London' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText(/London/i)).toBeInTheDocument());
        expect(screen.getByText(/15 °C/i)).toBeInTheDocument();
    });

    test('handles geo-location search', async () => {
        api.getCurrentPosition.mockResolvedValueOnce({
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

        await waitFor(() => expect(screen.getByText(/London/i)).toBeInTheDocument());
        expect(screen.getByText(/15 °C/i)).toBeInTheDocument();
    });

    test('toggles temperature unit', async () => {
        api.getWeatherData.mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'London' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText(/London/i)).toBeInTheDocument());
        expect(screen.getByText(/15 °C/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Toggle to °F/i));
        expect(screen.getByText(/temperature: 59 °F/i)).toBeInTheDocument();
    });

    test('handles errors', async () => {
        api.getWeatherData.mockRejectedValueOnce(new Error('Unable to fetch weather data'));

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'InvalidCity' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => expect(screen.getByText(/Unable to fetch weather data/i)).toBeInTheDocument());
    });
});
