import api from '@/api';
import type {
  ProductDetailApiResponse,
  FundDailyReturn,
} from '@/types/products/productDetail';

// 금융 상품 상세 조회
export async function fetchProductDetail(
  id: string
): Promise<ProductDetailApiResponse> {
  const res = await api.get(`/api/retirement/${id}`);
  // console.log('Product detail fetched:', res.data);
  return res.data;
}

// 펀드 일일 수익률 조회
export async function fetchFundReturn(
  id: string,
  range = '3m'
): Promise<FundDailyReturn[]> {
  const res = await api.get<FundDailyReturn[]>(
    `/api/retirement/${id}/returns`,
    { params: { range } }
  );
  // console.log('Fund return fetched:', res.data);
  return res.data ?? [];
}
