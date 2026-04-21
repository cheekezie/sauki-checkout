import { useState } from 'react';
import { ComponentLoading, Select } from '../ui';
import { Check, Copy, Info, Landmark } from 'lucide-react';
import { useGetBankList, useInitiatePayment, useInitiateUssdPayment } from '@/features/checkout/query';
import { notify } from '@/utils/alert-bridge';

interface prop {
  amount: number;
  transactionId: string;
}

const UssdCode = ({ amount, transactionId }: prop) => {
  const [code, setCode] = useState('');
  const [bank, setBank] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { data, isPending: isLoadingBanks } = useGetBankList();
  const { mutateAsync: mutateUssd, isPending: initiating } = useInitiateUssdPayment();

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankChanged = async (val: string) => {
    setBank(val);
    const selected = data?.find((d) => d.code === val);
    const res = await mutateUssd({
      bankCode: val,
      bank: selected?.name ?? '',
      transID: transactionId,
    });

    if (res.data.status) {
      setCode(res.data.ussdCode);
      setMessage(res.data.supportMessage);
    }
  };

  if (isLoadingBanks || initiating) {
    return (
      <div className='flex justify-center py-8 items-center'>
        <ComponentLoading className='min-h-8!' />
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <Select
        label='Bank'
        name='Bank'
        labelKey='name'
        valueKey='code'
        value={bank}
        onChange={(value) => bankChanged(value)}
        options={data ?? []}
        placeholder='-- Please select --'
        icon={Landmark}
        disabled={initiating}
      />
      {code && (
        <div className='flex mt-8 justify-center items-center border-b border-b-gray-light bg-off-white px-5 py-4'>
          <span className='text-dark text-sm font-semibold'>{code}</span>
          <button onClick={copyCode} className='ml-3'>
            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Copy className='w-4 h-4 text-gray' />}
          </button>
        </div>
      )}
      {message && (
        <div className='flex items-start gap-3 mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3'>
          <Info className='w-4 h-4 text-blue-500 shrink-0 mt-0.5' />
          <p className='text-blue-700 text-sm'>{message}</p>
        </div>
      )}
    </div>
  );
};

export default UssdCode;
