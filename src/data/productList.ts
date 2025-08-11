// 금융 상품 코드와 상품명 매칭 데이터 (실제 DB 데이터 기반)
export const productList = [
  // 펀드 상품
  { code: '1A81', name: 'KB국민참여정책형뉴딜' },
  { code: '2A43', name: 'KBESG성장리더스' },
  { code: '2F33', name: 'KB중소형주포커스' },
  { code: '2H62', name: 'KB스타코리아레버리지2.0' },
  { code: '2K24', name: 'KB가치배당소득공제' },
  { code: '2M72', name: 'KB가치배당20' },
  { code: '2N73', name: 'KB차이나H주식인덱스' },
  { code: '2S01', name: 'KB광개토' },
  { code: '32G1', name: 'KB글로벌대표지수분산' },
  { code: '33R2', name: 'KB코리아밸류업액티브' },

  // 특수 투자 상품
  { code: 'C016622', name: 'KB골드투자통장' },

  // 예금 상품 (국민은행)
  { code: 'DP01000014', name: '일반정기예금' },
  { code: 'DP01000029', name: '국민수퍼정기예금(개인)' },
  { code: 'DP01000214', name: '국민수퍼정기예금(CD금리연동형)' },
  { code: 'DP01000780', name: 'KB골든라이프연금우대통장' },
  {
    code: 'DP01001624',
    name: 'KB Star 지수연동예금 25-3호(KOSPI200 상승추구형(최저이율보장형))',
  },
  {
    code: 'DP01001625',
    name: 'KB Star 지수연동예금 25-3호(KOSPI200 상승낙아웃형(최저이율보장형))',
  },
  {
    code: 'DP01001626',
    name: 'KB Star 지수연동예금 25-3호(KOSPI200 상승낙아웃형(고수익목표형))',
  },
  { code: 'DP010300100335', name: 'KB Star 정기예금' },

  // 적금 상품 (국민은행)
  { code: 'DP01000228', name: '직장인우대적금' },
  { code: 'DP01001495', name: 'KB두근두근여행적금' },
  { code: 'DP01001596', name: 'KB스타 건강적금' },
  { code: 'DP01001614', name: 'KB스타적금Ⅲ' },
  { code: 'DP010200100051', name: 'KB국민프리미엄적금(정액)' },
  { code: 'DP010200100070', name: 'KB내맘대로적금' },
  { code: 'DP010200100084', name: 'KB맑은하늘적금' },
  { code: 'DP010200100104', name: 'KB 특★한 적금' },

  // 예금 상품 (KB저축은행)
  { code: 'DP240000', name: '정기예금' },
  { code: 'DP240001', name: 'KB e-plus 정기예금' },
  { code: 'DP240004', name: '플러스회전식정기예금(대면)' },
  { code: 'DP240005', name: '플러스회전식정기예금' },

  // 적금 상품 (KB저축은행)
  { code: 'DP310002', name: 'KB착한정기적금' },
  { code: 'DP310003', name: 'KB착한e-Plus정기적금' },
  { code: 'DP310004', name: 'KB일반정기적금' },
  { code: 'DP310005', name: 'KB일반e-Plus정기적금' },
  { code: 'DP310006', name: 'KB착한누리적금' },

  // 대출 상품
  { code: 'LN013032', name: '부동산담보(KB손보희망모기지론)' },
  { code: 'LN013037', name: '부동산담보(KB손보희망모기지론MI)' },
  { code: 'LN20000011', name: 'KB골든라이프 공사주택연금론' },
  { code: 'LN20000115', name: 'KB골든라이프 주택연금론' },
  { code: 'LN200300000002', name: 'KB주택담보대출변동(일반자금)' },
  { code: 'LN200331100045', name: 'KB스타 아파트담보대출 혼합금리(주택자금)' },

  // 특수 상품
  { code: 'gift', name: '증여 상담' },
  { code: 'inheritance', name: '상속 상담' },

  // 기존 예시 상품 (하위 호환성)
  { code: 'FIN123456', name: 'KB 종합금융상품' },
];

// 상품 코드로 상품명을 찾는 함수
export const getProductNameByCode = (code: string): string => {
  const product = productList.find((p) => p.code === code);
  return product ? product.name : code; // 매칭되지 않으면 원본 코드 반환
};

// 상품 코드로 상품 타입을 구분하는 함수
export const getProductTypeByCode = (code: string): string => {
  // 특정 패턴별로 구분
  if (
    code.startsWith('DP01') ||
    code.startsWith('DP24') ||
    code.startsWith('DP03')
  ) {
    return '예금';
  } else if (
    code.startsWith('DP31') ||
    (code.startsWith('DP01') && code.includes('적금'))
  ) {
    return '적금';
  } else if (code.startsWith('LN')) {
    return '대출';
  } else if (
    /^[0-9A-Z]{4}$/.test(code) &&
    !code.startsWith('DP') &&
    !code.startsWith('LN')
  ) {
    return '펀드';
  } else if (code.startsWith('C')) {
    return '투자상품';
  } else if (code === 'gift') {
    return '기프트';
  } else if (code === 'inheritance') {
    return '상속';
  } else {
    return '금융상품';
  }
};
