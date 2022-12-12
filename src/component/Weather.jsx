import { useCallback, useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input"
import { SyncLoader } from "react-spinners";
import { getWeatherByCity, getWeatherByLatLong } from "../util/weather-api";

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const currentPosition = useCallback(async position => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        try {
            setIsLoading(true)
            const weather = await getWeatherByLatLong(lat, long)
            console.log(weather)
            setWeatherData(weather)
        } catch (err) {
            setIsError(true)
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(currentPosition)
        }
    }, [currentPosition])

    const fetchWeatherByCity = async city => {
        setIsLoading(true)
        setIsError(false)
        try {
            const weather = await getWeatherByCity(city)
            setWeatherData(weather)
        } catch (err) {
            setIsError(true)
        }
        setIsLoading(false)
    }

    const cityChangeHandler = (value) => {
        setCity(value)
        fetchWeatherByCity(value)
    }

    let result;

    if (isLoading) {
        result = <div className="result-box">
            <SyncLoader
                className="loader"
                color='#fff'
                loading={isLoading}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    }

    if (isError) {
        result = <div className="result-box">
            <p className="weather-error">Weather not found...</p>
        </div>
    }

    if (weatherData && !isLoading && !isError) {
        const { name } = weatherData;
        const { icon, description } = weatherData.weather[0];
        const { temp, humidity } = weatherData.main;
        const { speed } = weatherData.wind;

        result = <div className="result-box">
            <h2 className='weather-location'>Weather in {name}</h2>
            <h1 className='weather-temprature'>{temp}°C</h1>
            <div className='cloud-condition'> <img src={`https://openweathermap.org/img/wn/${icon}.png`} /> <span> {description} </span></div>
            <p className='humidity'>Humidity: {humidity}%</p>
            <p className='wind-speed'>Wind Speed: {speed} km/h</p>
        </div>
    }

    return <>
        <div className="input-box">
            <h1 className="title">Type A City...</h1>
            <DebounceInput
                className="input-control"
                value={city}
                debounceTimeout={2000}
                onChange={event => cityChangeHandler(event.target.value)}
            />
        </div>
        {result}
    </>
}

export default Weather