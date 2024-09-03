import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstInput: '',
  secondInput: '',
  thirdInput: '',
  citiesWeatherData: [{}, {}, {}],
};

export const compareWeatherSlice = createSlice({
  name: 'citiesWeather',
  initialState,
  reducers: {
    setFirstInput: (state, action) => {
      state.firstInput = action.payload;
    },

    setSecondInput: (state, action) => {
      state.secondInput = action.payload;
    },

    setThirdInput: (state, action) => {
      state.thirdInput = action.payload;
    },

    setCitiesData: (state, action) => {
      state.citiesWeatherData[action.payload.index] = action.payload.value;
    },
  },
});

export const { setFirstInput, setSecondInput, setThirdInput, setCitiesData } =
  compareWeatherSlice.actions;
export default compareWeatherSlice.reducer;
