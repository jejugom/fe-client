import api from '@/api';
import type {
  ProductDetailApiResponse,
  FundDailyReturn,
} from '@/types/products/productDetail';

export async function fetchProductDetail(
  id: string
): Promise<ProductDetailApiResponse> {
  const res = await api.get(`/api/retirement/${id}`);
  console.log('Product detail fetched:', res.data);
  return res.data;
}

export async function fetchFundReturn(
  id: string,
  range = '3m'
): Promise<FundDailyReturn[]> {
  const res = await api.get<FundDailyReturn[]>(
    `/api/retirement/${id}/returns`,
    { params: { range } }
  );
  console.log('Fund return fetched:', res.data);
  return res.data ?? [];
}
