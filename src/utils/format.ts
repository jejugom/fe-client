export const formatCurrency = (value: number | string): string => {
  const num = Number(value);

  // null/undefined/NaN 처리 (0은 허용)
  if (value === null || value === undefined || isNaN(num)) return '';

  // 0 처리
  if (num === 0) return '0원';

  const eok = Math.floor(num / 100000000);
  const man = Math.floor((num % 100000000) / 10000);
  const won = num % 10000;

  let result = '';
  if (eok > 0) result += `${eok.toLocaleString()}억 `;
  if (man > 0) result += `${man.toLocaleString()}만 `;
  if (won > 0) result += `${won.toLocaleString()}원`;

  // 단위가 없는 경우 '원' 붙이기
  if (
    result.trim().endsWith('억') ||
    result.trim().endsWith('만') ||
    result.trim() === ''
  ) {
    result = result.trim() + '원';
  }

  return result.trim();
};
