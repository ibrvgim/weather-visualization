import BarChart from '../figures/BarChart';
import LineChart from '../figures/Linechart';
import WeatherDetailCard from './WeatherDetailCard';

function ResultContainer({ weather }) {
  const details = weather?.list?.[0].main;
  const wind = weather?.list?.[0].wind.gust;

  return (
    <section className='bg-stone-100 pt-16 px-20'>
      {weather?.city && (
        <>
          <p className='text-4xl tracking-wider text-gray-600 mb-14'>
            More information about the weather in {weather?.city?.name}
          </p>

          <div className='bg-stone-200 mt-5 mb-28 px-16 py-6 rounded-sm'>
            <WeatherDetailCard details={details} wind={wind} />
          </div>
        </>
      )}

      {weather && (
        <div>
          <p className='text-3xl font-light tracking-wider text-gray-600 mb-7'>
            Temperature linechart for 6 days
          </p>

          <LineChart weather={weather} />
        </div>
      )}

      {weather && (
        <div className='mb-20'>
          <p className='text-3xl font-light tracking-wider text-gray-600 mb-7'>
            Humidity percentage for 6 days
          </p>

          <div className='ml-16'>
            <BarChart weather={weather} />
          </div>
        </div>
      )}
    </section>
  );
}

export default ResultContainer;
