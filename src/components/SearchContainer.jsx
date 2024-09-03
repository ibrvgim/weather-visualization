import Logo from './Logo';
import SearchInput from './SearchInput';
import { BsSunrise, BsSunset } from 'react-icons/bs';
import { getTimeFromDate } from '../utilities/getTimeFromDate';
import { IoIosGitCompare } from 'react-icons/io';
import { useSelector } from 'react-redux';
import MiniLoader from './MiniLoader';
import { Link } from 'react-router-dom';
import { setInput } from '../slices/weatherSlice';

function SearchContainer({ input, weather }) {
  const cityInfo = weather?.city;
  const loading = useSelector((state) => state?.weather.loading);
  const sunrise = new Date(
    Number(cityInfo?.sunrise.toString().padEnd(13, '0'))
  );
  const sunset = new Date(Number(cityInfo?.sunset.toString().padEnd(13, '0')));
  const degree = Math.ceil(weather?.list?.[0].main.temp - 273.15);

  return (
    <section className='bg-stone-200 flex flex-col items-center'>
      <Link
        to='/compare'
        className='mt-8 mr-8 self-end text-gray-500 hover:text-gray-800 transition-all'
      >
        <IoIosGitCompare className='text-2xl' />
      </Link>

      <div className='mt-8'>
        <Logo />
      </div>

      <div className='mt-8'>
        <SearchInput input={input} setInput={setInput} />
      </div>

      {loading ? (
        <MiniLoader />
      ) : (
        <div className='flex flex-col items-center mt-24 gap-1'>
          {cityInfo && (
            <p className='text-7xl text-gray-600 tracking-wide mb-3'>
              {degree}°C
            </p>
          )}

          <p className='text-3xl text-gray-600 tracking-wider'>
            {cityInfo?.name}
          </p>

          <div className='flex gap-9 mt-6'>
            {cityInfo?.sunrise && (
              <p className='flex items-center text-gray-500 gap-1 tracking-wide'>
                <span className='text-3xl text-yellow-500 mr-1'>
                  <BsSunrise />
                </span>
                {getTimeFromDate(sunrise)}
              </p>
            )}

            {cityInfo?.sunset && (
              <p className='flex items-center text-gray-500 gap-1 tracking-wide'>
                <span className='text-3xl text-yellow-500 mr-1'>
                  <BsSunset />
                </span>
                {getTimeFromDate(sunset)}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default SearchContainer;
