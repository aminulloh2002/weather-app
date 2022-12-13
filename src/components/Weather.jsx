import { useCallback, useEffect, useReducer } from "react";
import { SyncLoader } from "react-spinners";
import { getWeatherByCity, getWeatherByLatLong } from "../util/weather-api";

const initialState = {
    weatherData: null,
    city: "",
    isLoading: false,
    isError: false,
}

const weatherReducer = (state, action) => {
    switch (action.type) {
        case 'setCity':
            return { ...state, city: action.value }
        case 'setLoading':
            return { ...state, isLoading: action.value }
        case 'setError':
            return { ...state, isError: action.value }
        case 'setWeatherData':
            return { ...state, weatherData: action.value }
        case 'reset':
            return initialState
        default:
            return { ...state }
    }

}

const Weather = () => {
    const [state, dispatch] = useReducer(weatherReducer, initialState)

    const {weatherData, city, isLoading, isError} = state

    const currentPosition = useCallback(async position => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        try {
            dispatch({ type: "setLoading", value: true })
            const weather = await getWeatherByLatLong(lat, long)
            dispatch({ type: "setWeatherData", value: weather })
        } catch (err) {
            dispatch({ type: "setError", value: true })
        }
        dispatch({ type: "setLoading", value: false })
    }, [])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(currentPosition)
        }
    }, [currentPosition])

    useEffect(() => {
        if (city) {
            dispatch({ type: "setLoading", value: true })
            dispatch({ type: "setError", value: false })
            const fetchWeatherByCity = setTimeout(async () => {
                try {
                    const weather = await getWeatherByCity(city)
                    dispatch({ type: "setWeatherData", value: weather })
                } catch (err) {
                    dispatch({ type: "setError", value: true })
                }
                dispatch({ type: "setLoading", value: false })
            }, 1000)

            return () => clearTimeout(fetchWeatherByCity)
        } else {
            dispatch({ type: "reset" })
        }
    }, [city])

    const cityChangeHandler = (value) => {
        dispatch({ type: "setCity", value })
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
            <input
                className="input-control"
                value={city}
                onChange={event => cityChangeHandler(event.target.value)}
            />
        </div>
        {result}
    </>
}

export default Weather