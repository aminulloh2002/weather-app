var apiKey = "1d364d37c5070c8bb9a5b1d0177554c8"

export async function getWeatherByCity(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    if (!res.ok) {
        throw { message: 'Failed to fetch!', status: 400 }
    }
    return res.json()
}

export async function getWeatherByLatLong(lat, long) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`)
    if (!res.ok) {
        throw { message: 'Failed to fetch!', status: 400 }
    }
    return res.json()
}