import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui';

interface props {
  amount: number;
}

const TransferInstructions = ({ amount }: props) => {
  const [isLoading, setisLoading] = useState(false);

  const checkStatus = () => {
    setisLoading(true);

    setTimeout(() => {
      setisLoading(false);
    }, 2000);
  };
  return (
    <div>
      <div className='grid grid-cols-[100px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Bank</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>Access Bank Plc</span>
      </div>
      <div className='grid grid-cols-[120px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Number</span>
        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          2345678901
          <button className='ml-3'>
            <Copy className='text-gray' />
          </button>
        </span>
      </div>
      <div className='grid grid-cols-[130px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Name</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>Sauki MFBank Checkout</span>
      </div>
      <div className='grid grid-cols-[100px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Amount</span>

        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          {amount}
          <button className='ml-3'>
            <Copy className='text-gray' />
          </button>
        </span>
      </div>

      <div className='text-center mt-8 text-gray text-xsm px-3'>
        This is only valid for one transaction and will expire in 30:00. Please make payment to the account details
        below.
      </div>

      <Button type='submit' disabled={isLoading} className='w-full py-4 text-base mt-4' onClick={checkStatus}>
        {isLoading ? 'Processing...' : 'I have sent the money'}
      </Button>
    </div>
  );
};

export default TransferInstructions;
