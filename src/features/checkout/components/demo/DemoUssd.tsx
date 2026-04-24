import { useState } from 'react';
import { Select } from '../../../../components/ui';
import { Check, Copy, Info, Landmark } from 'lucide-react';
import DemoPanel from './DemoPanel';

const DEMO_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'First Bank', code: '011' },
  { name: 'GTBank', code: '058' },
  { name: 'UBA', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Stanbic IBTC', code: '221' },
  { name: 'Fidelity Bank', code: '070' },
];

const DEMO_CODES: Record<string, string> = {
  '044': '*901*000#',
  '011': '*894*000#',
  '058': '*737*000#',
  '033': '*919*000#',
  '057': '*966*000#',
  '221': '*909*000#',
  '070': '*770*000#',
};

interface props {
  amount: number;
  transactionId: string;
  merchant?: string;
  customer?: string;
}

const DemoUssd = ({ amount, transactionId, merchant, customer }: props) => {
  const [bank, setBank] = useState('044');
  const [copied, setCopied] = useState(false);

  const code = bank ? DEMO_CODES[bank] : '';

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='mt-10'>
      <Select
        label='Bank'
        name='Bank'
        labelKey='name'
        valueKey='code'
        value={bank}
        onChange={setBank}
        options={DEMO_BANKS}
        placeholder='-- Please select --'
        icon={Landmark}
      />

      {code && (
        <div className='flex mt-4 justify-center items-center border-b border-b-gray-light bg-off-white px-5 py-4'>
          <span className='text-dark text-sm font-semibold'>{code}</span>
          <button onClick={copyCode} className='ml-3'>
            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </div>
      )}

      <DemoPanel channel='USSD' transactionId={transactionId} amount={amount} merchant={merchant} customer={customer} />
    </div>
  );
};

export default DemoUssd;
