import { IoSearchOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

function SearchInput({ input, setInput }) {
  const dispatch = useDispatch();

  return (
    <div className='flex items-center relative'>
      <span className='text-gray-600 text-lg absolute left-3'>
        <IoSearchOutline />
      </span>

      <input
        type='text'
        placeholder='Search by City'
        className='pl-10 h-9 w-80 rounded-[4px] tracking-wide placeholder:tracking-wider bg-transparent border-[1px] border-gray-500 text-gray-700'
        value={input}
        onChange={(e) => dispatch(setInput(e.target.value))}
      />
    </div>
  );
}

export default SearchInput;
