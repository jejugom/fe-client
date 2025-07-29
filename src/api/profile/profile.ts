export interface BookingItem {
  id: string;
  date: string;
  time: string;
  bank_name: string;
  prdt_name: string;
}

export interface ProfileData {
  user_info: {
    name: string;
    asset: number;
  };
  booking: {
    gift_booking: BookingItem;
    prdt_booking: BookingItem;
  };
  asset_info: {
    total: number;
    real_estate: number;
    deposit: number;
    cash: number;
    stock_fund: number;
    business_equity: number;
    etc: number;
  };
}

export const api_data: ProfileData = {
  user_info: {
    name: '홍길동',
    asset: 194940000,
  },
  booking: {
    gift_booking: {
      id: 'G202507170001',
      date: '2025-07-16',
      time: '13:00',
      bank_name: '국민은행 세종대점',
      prdt_name: '증여/상속 상담',
    },
    prdt_booking: {
      id: 'P202507170001',
      date: '2025-07-16',
      time: '13:00',
      bank_name: '국민은행 세종대점',
      prdt_name: '적금 상품1',
    },
  },
  asset_info: {
    total: 565000000,
    real_estate: 1500000000,
    deposit: 350000000,
    cash: 15000000,
    stock_fund: 300000000,
    business_equity: 0,
    etc: 0,
  },
};
