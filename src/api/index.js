const API_KEY = '758349ecc63aa6bab3fdfcec8195ccc7';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = ({ latitude, longitude, city, isSearch }) => {
    let url = `${API_BASE_URL}/weather?appid=${API_KEY}&units=metric`;
    if (city) {
        url += `&q=${city}`
    } else {
        url += `&lat=${latitude}&lon=${longitude}`
    }
    return fetch(url)
      .then(res => res.json());
}