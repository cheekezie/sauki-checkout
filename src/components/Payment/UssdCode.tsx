import { useState } from 'react';
import { ComponentLoading, Select } from '../ui';
import { Copy, Landmark } from 'lucide-react';
import { useGetBankList, useInitiatePayment, useInitiateUssdPayment } from '@/features/checkout/query';
import { notify } from '@/utils/alert-bridge';

interface prop {
  amount: number;
  transactionId: string;
}

const UssdCode = ({ amount, transactionId }: prop) => {
  const [bank, setbank] = useState('');
  const { data, isPending: isLoadingBanks } = useGetBankList();
  const { mutateAsync: mutateUssd, isPending: initiating } = useInitiateUssdPayment();

  const bankChanged = async (val: string) => {
    const selected = data?.find((d) => d.code === val);
    const res = await mutateUssd({
      bankCode: val,
      bank: selected?.name ?? '',
      transID: transactionId,
    });
    console.log(res.data);
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
