interface AssetStatusItem {
  assetCategoryCode: string;
  amount: number;
}

interface MyPageUserInfo {
  email: string;
  userName: string;
  assetStatus: AssetStatusItem[];
}

interface BookingInfo {
  bookingId: string;
  branchId: number;
  finPrdtCode: string;
  date: number; // timestamp
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

interface MyPageResponse {
  userInfo: MyPageUserInfo;
  bookingInfo: BookingInfo[];
  assetPercentile: number;
}

interface BookingUpdateRequest {
  date: string;
  time: string;
}

export type {
  MyPageUserInfo,
  BookingInfo,
  MyPageResponse,
  BookingUpdateRequest,
};
