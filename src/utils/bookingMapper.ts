import { branchList } from '@/data/branchList';
import { getProductNameByCode } from '@/data/productList';

/**
 * 지점 ID를 실제 지점명으로 변환하는 함수
 * @param branchId 지점 ID (숫자 또는 문자열)
 * @returns 지점명 또는 원본 ID (매칭되지 않는 경우)
 */
export const getBranchNameById = (branchId: number | string): string => {
  const id = typeof branchId === 'string' ? parseInt(branchId) : branchId;
  const branch = branchList.find(b => b.id === id);
  return branch ? branch.name : `지점 ID: ${branchId}`;
};

/**
 * 상품 코드를 실제 상품명으로 변환하는 함수
 * @param productCode 상품 코드
 * @returns 상품명 또는 원본 코드 (매칭되지 않는 경우)
 */
export const getProductNameByCodeWrapper = (productCode: string): string => {
  const productName = getProductNameByCode(productCode);
  // 매칭되지 않는 경우 (원본 코드가 그대로 반환된 경우)
  return productName === productCode ? `상품 코드: ${productCode}` : productName;
};

/**
 * BookingItem의 bank_name과 prdt_name을 실제 이름으로 변환하는 함수
 * 백엔드에서 branchId와 finPrdtCode로 오는 데이터를 변환
 */
export const transformBookingData = (bookingData: any) => {
  return {
    ...bookingData,
    bank_name: getBranchNameById(bookingData.branchId || bookingData.bank_name),
    prdt_name: getProductNameByCodeWrapper(bookingData.finPrdtCode || bookingData.prdt_name),
  };
};