import { useEffect } from 'react';
import ResultContainer from '../components/ResultContainer';
import SearchContainer from '../components/SearchContainer';
import { API } from '../utilities/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setWeatherData } from '../slices/weatherSlice';

function HomePage() {
  const dispatch = useDispatch();
  const input = useSelector((state) => state?.weather.input);
  const weather = useSelector((state) => state?.weather.weatherData);

  console.log(weather);

  useEffect(() => {
    const controller = new AbortController();
    const city = input || 'weimar';

    async function fetchData() {
      dispatch(setLoading(true));
      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API}`;

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Response Status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(setWeatherData(data));
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetching data was aborted!');
        } else {
          console.error(error);
        }
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [dispatch, input]);

  return (
    <main className='grid grid-cols-[450px_1fr] p-8 min-h-screen'>
      <SearchContainer input={input} weather={weather} />
      <ResultContainer weather={weather} />
    </main>
  );
}

export default HomePage;
