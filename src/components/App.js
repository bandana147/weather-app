import React, { useEffect, useState, useMemo } from 'react';
import { getWeather } from '../api';
import _debounce from 'lodash/debounce';
import _get from 'lodash/get';
import moment from 'moment';
import weatherIcon from '../assets/cloud-weather.svg';
import loader from '../assets/loader.svg'

import './App.css';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [weatherData, setWeatherData] = useState('loading');
  const [error, setError] = useState('');

  const debounceSearch = useMemo(() => _debounce((city) => {
    getWeather({ city, latitude, longitude })
      .then(data => {
        if (data.cod === 200) {
          setError('');
          setWeatherData(data);
        } else {
          setError(data.message)
        }
      });
  }, 800), [latitude, longitude]);

  useEffect(() => {
    function fetchWeatherData() {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        getWeather({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          .then(data => {
            setWeatherData(data);
          });
      });
    }
    fetchWeatherData();
  }, []);

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);
  
  function searchByCity(e) {
    const city = e.currentTarget.value;
    setError('');
    setSearchKey(city);
    debounceSearch(city);
  };

  const date = moment();
  const mainData = _get(weatherData, 'main', {})
  return (
    <div className="app">
      <div className='body-wrapper'>
        {weatherData === 'loading' ? (<div className='loader-wrapper'><img src={loader} alt="loader" className='loader-icon' /></div>) :
          (<div className='info'>
            <div className='flex-center'>
              <div className=''>{_get(weatherData, 'name')}</div>
              <img alt="weather" className="weather-icon" src={weatherIcon} />
              <div className='weather-title'>{parseInt(mainData.temp)}&deg;C</div>
              <div className="sub-title"><span>High: {parseInt(mainData.temp_max)}&deg;</span><span className='ml-8'>Low: {parseInt(mainData.temp_min)}&deg;</span></div>
              <div className="sub-title">Feels like: {_get(weatherData, 'main.feels_like')} &deg;</div> 
              <input className="search-input" value={searchKey} placeholder='Search city' onChange={searchByCity} />
              {error && <div className="sub-title">{error}</div>}
            </div>
            <div>
              <div>{date.format("hh:mm A")}</div>
              <div>{date.format("dddd, D MMM yyyy")}</div>
            </div>
          </div>)}
      </div>
    </div>
  );
}

export default App;
