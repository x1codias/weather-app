import axios from 'axios'

const API_KEY = 'e5fd580db81e924f5ccc9c9c57b8d3b6' // Substitua pela sua chave da API do OpenWeather
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt`)
  return response.data
}
