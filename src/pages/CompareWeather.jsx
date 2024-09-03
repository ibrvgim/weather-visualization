import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useSelector } from 'react-redux';
import FirstCityCard from '../components/FIrstCityCard';
import SecondCityCard from '../components/SecondCityCard';
import ThirdCityCard from '../components/ThirdCityCard';
import ScatterPlot from '../figures/ScatterPlot';

function CompareWeather() {
  const firstInput = useSelector((state) => state?.citiesWeather.firstInput);
  const secondInput = useSelector((state) => state?.citiesWeather.secondInput);
  const thirdInput = useSelector((state) => state?.citiesWeather.thirdInput);
  const citiesWeatherData = useSelector(
    (state) => state?.citiesWeather.citiesWeatherData
  );

  return (
    <div className='p-12 min-h-screen'>
      <div className='px-12 py-7 bg-stone-200 flex rounded-sm'>
        <Link to='/'>
          <Logo />
        </Link>
      </div>

      <p className='text-4xl font-light tracking-widest text-gray-600 my-8 text-center'>
        Weather in Several Cities
      </p>

      <div className='grid grid-cols-3 h-[28rem] mt-8 mb-28'>
        <FirstCityCard
          firstInput={firstInput}
          citiesWeatherData={citiesWeatherData}
        />

        <SecondCityCard
          secondInput={secondInput}
          citiesWeatherData={citiesWeatherData}
        />

        <ThirdCityCard
          thirdInput={thirdInput}
          citiesWeatherData={citiesWeatherData}
        />
      </div>

      <div className='flex flex-col items-center'>
        <p className='text-4xl font-light tracking-wider text-gray-600 mb-12'>
          Scatterplot of Temperature x Humidity for 6 days
        </p>
        <ScatterPlot citiesWeather={citiesWeatherData} />
      </div>
    </div>
  );
}

export default CompareWeather;
