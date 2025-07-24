export const productsAll = [
  {
    productId: 'KB002',
    productName: 'KB 골드 연금',
    description: '연 4.0% 복리, 장기 투자에 적합한 연금 상품',
    prft_year: '4.0',
    endDate: '20300101',
    productSegmentId: 'A',
    customerSegmentId: 'A',
  },
  {
    productId: 'KB004',
    productName: 'KB Star 정기예금 (고객맞춤형)',
    description: '안정적인 고금리, 만기 조절 가능',
    prft_year: '3.8',
    endDate: '20260722',
    productSegmentId: 'S',
    customerSegmentId: 'A',
  },
  {
    productId: 'KB005',
    productName: 'KB 글로벌 채권 펀드',
    description: '선진국 우량 채권에 분산 투자',
    prft_year: '5.1',
    endDate: null,
    productSegmentId: 'G',
    customerSegmentId: 'A',
  },
  {
    productId: 'KB006',
    productName: 'KB 내일로 저축보험',
    description: '비과세 혜택과 안정적인 노후 준비',
    prft_year: '3.2',
    endDate: '20351231',
    productSegmentId: 'S',
    customerSegmentId: 'A',
  },
  {
    productId: 'KB007',
    productName: 'KB 미국 대표주식 ETF',
    description: 'S&P 500 지수를 추종하는 ETF',
    prft_year: '9.5',
    endDate: null,
    productSegmentId: 'G',
    customerSegmentId: 'A',
  },
];

export const productDetail = {
  productId: 'KB002',
  productType: '3', // 연금저축
  productName: 'KB 골드 연금',
  description: '연 4.0% 복리 연금 상품',
  enddate: '2025-05-12',
  segmentId: 'AH',
  recommendReason: '투자 성향이 안정형이며, 현금자산 비중 높음',
  requiredDocuments: ['신분증', '가입 신청서'],
  iconInfo: {
    연금저축유형: '펀드형',
    저축금리: '4%',
    가입방법: '모바일',
    금리: undefined,
    담보인정비율: undefined,
    대출금리: undefined,
  },
};

export const reservationData = {
  branch_code: '0004',
  reserved_slots: {
    '2025-07-27': ['10:00', '11:00', '14:00'],
    '2025-07-29': ['09:30'],
    '2025-07-30': ['10:00', '11:30', '15:00'],
  } as Record<string, string[]>,
};
