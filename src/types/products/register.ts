interface BookingRequest {
  branchId: number;
  finPrdtCode: string;
  date: string;
  time: string;
}

interface SmsData {
  phoneNumber: string;
  productName: string;
  branchName: string;
  reservationDate: string;
  reservationTime: string;
}

export type { BookingRequest, SmsData };
