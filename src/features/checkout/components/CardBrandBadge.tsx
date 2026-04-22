import { MasterCard, Verve, Visa } from '@/assets';
import type { CardType } from '@/utils/cardDetection';

const BRAND_ASSETS: Partial<Record<CardType, string>> = {
  visa: Visa,
  mastercard: MasterCard,
  verve: Verve,
};

const BRAND_LABELS: Partial<Record<CardType, string>> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  verve: 'Verve',
  amex: 'Amex',
};

interface props {
  type: CardType;
}

const CardBrandBadge = ({ type }: props) => {
  if (type === 'unknown') return null;

  const src = BRAND_ASSETS[type];

  if (src) {
    return <img src={src} alt={BRAND_LABELS[type]} className='h-5 w-auto object-contain' />;
  }

  return (
    <span className='text-xs font-bold tracking-wide text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded'>
      {BRAND_LABELS[type]}
    </span>
  );
};

export default CardBrandBadge;
