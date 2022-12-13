export const initialState = {
    weatherData: null,
    city: "",
    isLoading: false,
    isError: false,
}

export const weatherReducer = (state, action) => {
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