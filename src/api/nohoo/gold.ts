import axios from 'axios';
import type { GoldPrice } from '@/types/nohoo/gold';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchGoldPrice = async (): Promise<GoldPrice[]> => {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=XAUUSD&apikey=${API_KEY}`;
  const res = await axios.get(url);
  const rawData = res.data['Time Series (Daily)'];

  if (!rawData) throw new Error("API response missing 'Time Series (Daily)'");

  const prices: GoldPrice[] = Object.entries(rawData)
    .map(([date, data]: [string, any]) => ({
      date,
      price: parseFloat(data['4. close']),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // 날짜 오름차순 정렬

  return prices;
};
