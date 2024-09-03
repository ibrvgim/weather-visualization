import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import compareWeatherReducer from './slices/compareWeatherSlice';

export default configureStore({
  reducer: {
    weather: weatherReducer,
    citiesWeather: compareWeatherReducer,
  },
});
