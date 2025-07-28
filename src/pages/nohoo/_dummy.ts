export const retirement = {
  user_info: {
    user_name: '김',
    asset_info: {
      total: 565000000,
      real_estate: 1500000000,
      deposit: 350000000,
      cash: 15000000,
      stock_fund: 300000000,
      business_equity: 0,
      etc: 0,
    },
  },

  prod_top3: [
    {
      prod_id: 'KB001',
      prod_name: 'KB Star 정기예금',
      description: '6개월 예치, 안정적인 이자 수익',
      rate: 3.2,
    },
    {
      prod_id: 'KB002',
      prod_name: 'KB 골드 연금',
      description: '장기 투자 적합 연금 상품',
      rate: 4.0,
    },
    {
      product_id: 'KB003',
      prod_name: 'KB 투자형 펀드',
      description: '리스크 있지만 수익률 기대',
      rate: 5.5,
    },
  ],
  금리: [
    { month: '2024-08', rate: 3.1 },
    { month: '2024-09', rate: 3.05 },
    { month: '2024-10', rate: 3.0 },
    { month: '2024-11', rate: 2.95 },
    { month: '2024-12', rate: 2.9 },
    { month: '2025-01', rate: 2.85 },
    { month: '2025-02', rate: 2.8 },
    { month: '2025-03', rate: 2.75 },
    { month: '2025-04', rate: 2.8 },
    { month: '2025-05', rate: 2.9 },
    { month: '2025-06', rate: 3.0 },
    { month: '2025-07', rate: 3.1 },
  ],
  금시세: [
    { month: '2024-08', price: 142300 },
    { month: '2024-09', price: 143000 },
    { month: '2024-10', price: 144500 },
    { month: '2024-11', price: 145200 },
    { month: '2024-12', price: 146000 },
    { month: '2025-01', price: 147300 },
    { month: '2025-02', price: 148000 },
    { month: '2025-03', price: 148500 },
    { month: '2025-04', price: 148000 },
    { month: '2025-05', price: 147200 },
    { month: '2025-06', price: 147800 },
    { month: '2025-07', price: 148200 },
  ],
};

export const retirementRecommend = [
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

// 예상되는 Api 리턴 Body 참고하여 만든 더미데이터
export const productsApiData = {
  recommend: [
    {
      type: 'timeDeposit',
      data: {
        fin_prdt_cd: 'DP010300100336',
        fin_prdt_nm: 'KB 골드 정기예금',
        prdt_feature: '#고금리 특화, 장기투자 우대',
        optionList: [
          {
            save_trm: '12',
            intr_rate: 2.1,
            intr_rate2: 2.8,
          },
          {
            save_trm: '24',
            intr_rate: 2.3,
            intr_rate2: 3.0,
          },
          {
            save_trm: '36',
            intr_rate: 2.5,
            intr_rate2: 3.2,
          },
        ],
      }
    },
    {
      type: 'savingDeposit',
      data: {
        fin_prdt_cd: 'DP010200100052',
        fin_prdt_nm: 'KB 스마트 적금',
        prdt_feature: '#자유적립식, 모바일 전용, 금리 우대 가능',
        optionList: [
          {
            save_trm: '6',
            intr_rate: 2.0,
            intr_rate2: 2.7,
          },
          {
            save_trm: '12',
            intr_rate: 2.3,
            intr_rate2: 3.0,
          },
        ],
      }
    },
    {
      type: 'mortgageLoan',
      data: {
        fin_prdt_cd: 'LN200300000004',
        fin_prdt_nm: 'KB 청년 주택 담보 대출',
        prdt_feature: '청년층 특화 우대금리 주택담보대출',
        optionListList: [
          {
            mrtg_type_nm: '아파트',
            rpay_type_nm: '분할상환방식',
            lend_rate_type_nm: '변동금리',
            lend_rate_min: '3.8',
            lend_rate_max: '4.5',
          },
        ],
      }
    }
  ],
  timeDeposits: [
    {
      fin_prdt_cd: 'DP010300100335',
      fin_prdt_nm: 'KB Star 정기예금',
      prdt_feature: '#간편가입 디지털 전용, 편리한 온라인 예금',
      optionList: [
        {
          save_trm: '6',
          intr_rate: 1.5,
          intr_rate2: 2.2,
        },
        {
          save_trm: '12',
          intr_rate: 1.8,
          intr_rate2: 2.45,
        },
        {
          save_trm: '24',
          intr_rate: 2.0,
          intr_rate2: 2.65,
        },
      ],
    },
    {
      fin_prdt_cd: 'DP010300100336',
      fin_prdt_nm: 'KB 골드 정기예금',
      prdt_feature: '#고금리 특화, 장기투자 우대',
      optionList: [
        {
          save_trm: '12',
          intr_rate: 2.1,
          intr_rate2: 2.8,
        },
        {
          save_trm: '24',
          intr_rate: 2.3,
          intr_rate2: 3.0,
        },
        {
          save_trm: '36',
          intr_rate: 2.5,
          intr_rate2: 3.2,
        },
      ],
    },
    {
      fin_prdt_cd: 'DP010300100337',
      fin_prdt_nm: 'KB 안심 정기예금',
      prdt_feature: '#안정성 중심, 원금보장',
      optionList: [
        {
          save_trm: '3',
          intr_rate: 1.2,
          intr_rate2: 1.8,
        },
        {
          save_trm: '6',
          intr_rate: 1.4,
          intr_rate2: 2.0,
        },
      ],
    },
  ],
  savingDeposits: [
    {
      fin_prdt_cd: 'DP010200100051',
      fin_prdt_nm: 'KB 국민 프리미엄 적금 (정액)',
      prdt_feature: '#우대금리 단체/병역명문가 우대금리 제공하는 적립식 상품',
      optionList: [
        {
          save_trm: '12',
          intr_rate: 2.5,
          intr_rate2: 3.4,
        },
        {
          save_trm: '24',
          intr_rate: 2.8,
          intr_rate2: 3.7,
        },
        {
          save_trm: '36',
          intr_rate: 3.0,
          intr_rate2: 4.0,
        },
      ],
    },
    {
      fin_prdt_cd: 'DP010200100052',
      fin_prdt_nm: 'KB 스마트 적금',
      prdt_feature: '#자유적립식, 모바일 전용, 금리 우대 가능',
      optionList: [
        {
          save_trm: '6',
          intr_rate: 2.0,
          intr_rate2: 2.7,
        },
        {
          save_trm: '12',
          intr_rate: 2.3,
          intr_rate2: 3.0,
        },
      ],
    },
    {
      fin_prdt_cd: 'DP010200100053',
      fin_prdt_nm: 'KB 청년 희망 적금',
      prdt_feature: '#청년층 특화, 정부지원금 혜택',
      optionList: [
        {
          save_trm: '24',
          intr_rate: 2.7,
          intr_rate2: 3.5,
        },
        {
          save_trm: '36',
          intr_rate: 3.0,
          intr_rate2: 3.8,
        },
      ],
    },
  ],
  mortgageLoan: [
    {
      fin_prdt_cd: 'LN200300000002',
      fin_prdt_nm: 'KB 주택 담보 대출 변동 (일반자금)',
      prdt_feature: '혼합금리와 변동금리 중 선택이 가능한 주택담보대출',
      optionListList: [
        {
          mrtg_type_nm: '아파트',
          rpay_type_nm: '분할상환방식',
          lend_rate_type_nm: '변동금리',
          lend_rate_min: '4.17',
          lend_rate_max: '5.07',
        },
        {
          mrtg_type_nm: '연립주택',
          rpay_type_nm: '분할상환방식',
          lend_rate_type_nm: '변동금리',
          lend_rate_min: '4.27',
          lend_rate_max: '5.17',
        },
      ],
    },
    {
      fin_prdt_cd: 'LN200300000003',
      fin_prdt_nm: 'KB 주택 담보 대출 고정 (신용자금)',
      prdt_feature: '고정금리로 안정적인 상환 계획이 가능한 주택담보대출',
      optionListList: [
        {
          mrtg_type_nm: '아파트',
          rpay_type_nm: '분할상환방식',
          lend_rate_type_nm: '고정금리',
          lend_rate_min: '4.5',
          lend_rate_max: '5.8',
        },
        {
          mrtg_type_nm: '단독주택',
          rpay_type_nm: '분할상환방식',
          lend_rate_type_nm: '고정금리',
          lend_rate_min: '4.7',
          lend_rate_max: '6.0',
        },
      ],
    },
    {
      fin_prdt_cd: 'LN200300000004',
      fin_prdt_nm: 'KB 청년 주택 담보 대출',
      prdt_feature: '청년층 특화 우대금리 주택담보대출',
      optionListList: [
        {
          mrtg_type_nm: '아파트',
          rpay_type_nm: '분할상환방식',
          lend_rate_type_nm: '변동금리',
          lend_rate_min: '3.8',
          lend_rate_max: '4.5',
        },
      ],
    },
  ],
};

export const appointment = {
  bank_code: 'KB-SE-001',
  bank_name: 'KB 국민은행 세종대점',
  bank_tel: '02-425-1111',
  prod_code: 'PR-ETF-001',
  date: '2025-05-11',
  time: '12:30',
  doc_info: {
    required_documents: ['신분증', '가족관계증명서', '인감도장'],
  },
};
