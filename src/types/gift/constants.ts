import type { Category } from '@/types/gift/inheritance';

export const categories: Category[] = [
  { id: 'estate', name: '부동산' },
  { id: 'deposits', name: '예금/적금' },
  { id: 'cash', name: '현금' },
  { id: 'stocks', name: '주식/펀드' },
  { id: 'business', name: '사업체/지분' },
  { id: 'etc', name: '기타' },
];

export const categoryCodeMap: { [key: string]: string } = {
  '1': 'estate',
  '2': 'deposits',
  '3': 'cash',
  '4': 'stocks',
  '5': 'business',
  '6': 'etc',
};