function WeatherDetailCard({ details, wind }) {
  return (
    <ul className='flex flex-col gap-4 text-lg text-gray-600 tracking-wide'>
      <li className='border-b-[1px] border-b-gray-400 pb-4 flex justify-between items-center'>
        Humidity <span>{details?.humidity}%</span>
      </li>

      <li className='border-b-[1px] border-b-gray-400 pb-4 flex justify-between items-center'>
        Wind gusts
        <span>{Math.ceil(wind)} km/h</span>
      </li>

      <li className='border-b-[1px] border-b-gray-400 pb-4 flex justify-between items-center'>
        Pressure <span>{details?.pressure} mb</span>
      </li>

      <li className='border-b-[1px] border-b-gray-400 pb-4 flex justify-between items-center'>
        Ground level <span>{details?.grnd_level} ft</span>
      </li>

      <li className='border-b-[1px] border-b-gray-400 pb-4 flex justify-between items-center'>
        Minimum temperature
        <span>{Math.floor(details?.temp_min - 273.15)}°C</span>
      </li>

      <li className='flex justify-between items-center'>
        Maximum temperature
        <span>{Math.floor(details?.temp_max - 273.15)}°C</span>
      </li>
    </ul>
  );
}

export default WeatherDetailCard;
