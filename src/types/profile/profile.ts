interface UserProfile {
  email: string;
  userName: string;
  userPhone: string;
  birth: string;
}

interface UpdateUserProfileRequest {
  userName?: string;
  userPhone?: string;
  birth?: string;
}

interface BookingItem {
  id: string;
  date: string;
  time: string;
  bank_name: string | number; // 지점명 또는 branchId
  prdt_name: string; // 상품명 또는 finPrdtCode
  branchId?: number; // 백엔드에서 오는 지점 ID (선택적)
  finPrdtCode?: string; // 백엔드에서 오는 상품 코드 (선택적)
}

interface ProfileData {
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

export type { UserProfile, UpdateUserProfileRequest, BookingItem, ProfileData };
