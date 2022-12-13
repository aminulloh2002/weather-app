import { useCallback, useEffect, useReducer } from "react"
import { getWeatherByCity, getWeatherByLatLong } from "../util/weather-api";
import { initialState as weatherInitialState, weatherReducer } from "../util/weatherReducer";

export default function useWeather() {
    const [state, dispatch] = useReducer(weatherReducer, weatherInitialState)

    const { weatherData, city, isLoading, isError } = state

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


    return {
        weatherData, city, isLoading, isError, dispatch
    }
}
