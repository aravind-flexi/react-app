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
        expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter city or zip code/i)).toBeInTheDocument();
        expect(screen.getByText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Use My Location/i)).toBeInTheDocument();
    });

    test('handles city search and displays weather data', async () => {
        api.getWeatherData.mockResolvedValueOnce({
            name: 'London',
            main: { temp: 15 },
            weather: [{ description: 'clear sky' }]
        });

        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'London' } });
        fireEvent.click(screen.getByText(/Search/i));

        await waitFor(() => {
            expect(screen.getByTestId('cityname')).toBeInTheDocument();
            expect(screen.getByTestId('info')).toBeInTheDocument();
            expect(screen.getByTestId('temp')).toBeInTheDocument();
            expect(screen.getByTestId('btn')).toBeInTheDocument();
        });
    });
});

test('handles geo-location search and displays weather data', async () => {
    api.getWeatherData.mockResolvedValueOnce({
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
 
    await waitFor(() => {
        expect(screen.getByTestId('cityname')).toBeInTheDocument();
        expect(screen.getByTestId('info')).toBeInTheDocument();
        expect(screen.getByTestId('temp')).toBeInTheDocument();
        expect(screen.getByTestId('btn')).toBeInTheDocument();
    });
    
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
    
    await waitFor(() => {
        expect(screen.getByTestId('cityname')).toBeInTheDocument();
        expect(screen.getByTestId('info')).toBeInTheDocument();
        expect(screen.getByTestId('temp')).toBeInTheDocument();
        expect(screen.getByTestId('btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn'));
    expect(screen.getByTestId('temp')).toBeInTheDocument();
});

test('throws error if unable to fetch data', async () => {
    api.getWeatherData.mockRejectedValueOnce(new Error('Unable to fetch weather data'));

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter city or zip code/i), { target: { value: 'UnKnown' } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(async () => {
        const errorMessage = await screen.findByText('Unable to fetch weather data');
        expect(errorMessage).toHaveTextContent('Unable to fetch weather data');
    });
});

