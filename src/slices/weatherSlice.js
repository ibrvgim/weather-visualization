import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  input: '',
  weatherData: {},
  loading: false,
};

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },

    setWeatherData: (state, action) => {
      state.weatherData = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setInput, setWeatherData, setLoading } = weatherSlice.actions;
export default weatherSlice.reducer;
