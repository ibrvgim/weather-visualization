import { BsSunrise, BsSunset } from 'react-icons/bs';
import { getTimeFromDate } from '../utilities/getTimeFromDate';
import SearchInput from './SearchInput';
import { setCitiesData, setFirstInput } from '../slices/compareWeatherSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { API } from '../utilities/constants';

function FirstCityCard({ firstInput, citiesWeatherData }) {
  const dispatch = useDispatch();
  const sunrise = new Date(
    Number(citiesWeatherData?.[0]?.city?.sunrise.toString().padEnd(13, '0'))
  );
  const sunset = new Date(
    Number(citiesWeatherData?.[0]?.city?.sunset.toString().padEnd(13, '0'))
  );

  useEffect(() => {
    const controller = new AbortController();
    const city = firstInput || 'berlin';

    async function fetchData() {
      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API}`;

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Response Status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(setCitiesData({ index: 0, value: data }));
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetching data was aborted!');
        } else {
          console.error(error);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [dispatch, firstInput]);

  if (!citiesWeatherData?.[0].city) return;

  return (
    <div className='bg-stone-200 flex flex-col items-center justify-start pt-16'>
      <SearchInput input={firstInput} setInput={setFirstInput} />

      <p className='text-6xl text-gray-600 tracking-wide mt-20 mb-4'>
        {Math.ceil(citiesWeatherData?.[0]?.list?.[0]?.main.temp - 273.15)}°C
      </p>

      <p className='text-2xl text-gray-600 tracking-wider'>
        {citiesWeatherData?.[0]?.city?.name}
      </p>

      <div className='flex gap-9 mt-10'>
        <p className='flex items-center text-gray-500 gap-1 tracking-wide'>
          <span className='text-3xl text-yellow-500 mr-1'>
            <BsSunrise />
          </span>
          {getTimeFromDate(sunrise)}
        </p>

        <p className='flex items-center text-gray-500 gap-1 tracking-wide'>
          <span className='text-3xl text-yellow-500 mr-1'>
            <BsSunset />
          </span>
          {getTimeFromDate(sunset)}
        </p>
      </div>
    </div>
  );
}

export default FirstCityCard;
