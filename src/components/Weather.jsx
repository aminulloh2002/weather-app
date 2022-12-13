import { SyncLoader } from "react-spinners";
import useWeather from "../hooks/useWeather";

const Weather = () => {
    const { weatherData, city, isLoading, isError, dispatch } = useWeather()
   
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
            <h3 className="weather-error">Weather not found...</h3>
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