function Logo() {
  return (
    <div className='flex items-center gap-5'>
      <p className='text-3xl font-normal tracking-wider text-gray-600 flex items-center gap-1'>
        W
        <span className='pr-1'>
          <img src='./logo.png' alt='cloudy weather logo' className='w-10' />
        </span>
        ther Visualization
      </p>
    </div>
  );
}

export default Logo;
