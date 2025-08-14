import Estate from '@/assets/images/Estate.svg';
import Deposits from '@/assets/images/Deposits.svg';
import Cash from '@/assets/images/Cash.svg';
import Stocks from '@/assets/images/Stocks.svg';
import Business from '@/assets/images/Business.svg';
import Etc from '@/assets/images/Etc.svg';

const imageMap: { [key: string]: string } = {
  estate: Estate,
  deposits: Deposits,
  cash: Cash,
  stocks: Stocks,
  business: Business,
  etc: Etc,
};

export const getAssetImage = (categoryId: string): string => {
  return imageMap[categoryId] || Etc; // 일치하는 이미지가 없으면 '기타' 아이콘 반환
};
