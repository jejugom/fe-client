import axios from 'axios';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

export async function fetchExchangeRate(): Promise<number> {
  const res = await axios.get(
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KRW&apikey=${API_KEY}`
  );

  return parseFloat(
    res.data['Realtime Currency Exchange Rate']['5. Exchange Rate']
  );
}
