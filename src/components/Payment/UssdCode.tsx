import { useState } from 'react';
import { Select } from '../ui';
import { Copy, Landmark } from 'lucide-react';

interface prop {
  amount: number;
}
const Banks = [
  {
    label: 'Access Bank',
    value: '1',
  },
  {
    label: 'Zenith Bank',
    value: '2',
  },
];
const UssdCode = ({ amount }: prop) => {
  const [bank, setbank] = useState('1');

  const bankChanged = (val: string) => {
    setbank(val);
  };

  return (
    <div className='mt-10'>
      <Select
        label='Bank'
        name='Bank'
        value={bank}
        onChange={(value) => bankChanged(value)}
        options={Banks}
        placeholder='-- Please select --'
        icon={Landmark}
      />
      <div className='flex mt-8  justify-center items-center border-b border-b-gray-light bg-off-white px-5 py-4'>
        <span className='text-dark text-sm font-semibold'>*123*456789*{amount}#</span>
        <button className='ml-3'>
          <Copy className='text-gray' />
        </button>
      </div>
    </div>
  );
};

export default UssdCode;
