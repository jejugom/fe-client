export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === 0) return '0원';

  const num = Number(amount);
  const eok = Math.floor(num / 100000000);
  const man = Math.floor((num % 100000000) / 10000);
  const won = num % 10000;

  let result = '';
  if (eok > 0) result += `${eok.toLocaleString()}억 `;
  if (man > 0) result += `${man.toLocaleString()}만 `;
  if (won > 0) result += `${won.toLocaleString()}원`;

  // '억'이나 '만'으로 끝나는 경우 '원'을 추가
  if (result.trim().endsWith('억') || result.trim().endsWith('만')) {
    result += '원';
  }

  return result.trim();
};

// 자산 카테고리 코드를 카테고리 이름으로 변환
export function getAssetCategoryName(assetCategoryCode: string): string {
  const categoryMap: Record<string, string> = {
    '1': '부동산',
    '2': '예금/적금',
    '3': '현금',
    '4': '주식/펀드',
    '5': '사업체/지분',
    '6': '기타',
  };

  return categoryMap[assetCategoryCode];
}
