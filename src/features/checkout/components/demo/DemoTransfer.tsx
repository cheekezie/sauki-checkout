import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import DemoPanel from './DemoPanel';

const DEMO_ACCOUNT = {
  bankName: 'Demo Bank',
  accountNumber: '0123456789',
  accountName: 'SAUKI DEMO ACCOUNT',
};

interface props {
  amount: number;
  transactionId: string;
  merchant?: string;
  customer?: string;
}

const DemoTransfer = ({ amount, transactionId, merchant, customer }: props) => {
  const [accCopied, setAccCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);

  const copy = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className='grid grid-cols-[100px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Bank</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>{DEMO_ACCOUNT.bankName}</span>
      </div>
      <div className='grid grid-cols-[120px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Number</span>
        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          {DEMO_ACCOUNT.accountNumber}
          <button className='ml-3' onClick={() => copy(DEMO_ACCOUNT.accountNumber, setAccCopied)}>
            {accCopied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </span>
      </div>
      <div className='grid grid-cols-[130px_1fr] border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Account Name</span>
        <span className='text-dark text-sm font-semibold truncate text-right'>{DEMO_ACCOUNT.accountName}</span>
      </div>
      <div className='grid grid-cols-[100px_1fr] items-center border-b border-b-gray-light bg-off-white px-5 py-3'>
        <span className='text-gray text-sm'>Amount</span>
        <span className='text-dark text-sm font-semibold truncate text-right flex items-center justify-end'>
          {formatCurrency(amount)}
          <button className='ml-3' onClick={() => copy(amount.toString(), setAmountCopied)}>
            {amountCopied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </span>
      </div>

      <DemoPanel
        channel='BANK_TRANSFER'
        transactionId={transactionId}
        amount={amount}
        merchant={merchant}
        customer={customer}
      />
    </div>
  );
};

export default DemoTransfer;
