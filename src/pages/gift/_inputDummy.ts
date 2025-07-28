export const dummyAssets = {
  부동산: [
    { name: '부동산 이름1', amount: '10억 5천만', selected: true },
    { name: '부동산 이름2', amount: '6억 8천만', selected: true },
    { name: '부동산 이름3', amount: '2억', selected: true },
  ],
  예ㆍ적금: [
    { name: '예ㆍ적금1', amount: '5천만', selected: true },
    { name: '예ㆍ적금2', amount: '3천만', selected: true },
  ],
  현금: [
    { name: '현금 자산1', amount: '1억', selected: true },
    { name: '현금 자산2', amount: '3천만', selected: true },
  ],
  주식ㆍ펀드: [
    { name: '삼성전자 주식', amount: '2천만', selected: true },
    { name: '펀드 상품1', amount: '1천만', selected: true },
  ],
  사업체ㆍ지분: [],
  기타: [
    { name: '기타 자산1', amount: '5백만', selected: true },
    { name: '기타 자산2', amount: '1백만', selected: true },
  ],
};

export const dummyRecipients = [
  {
    name: '홍길동',
    relationship: '자녀',
    birth: '2001-04-18',
    maritalStatus: '미혼',
    incomeStatus: '소득 있음',
  },
  {
    name: '최두식',
    relationship: '배우자',
    birth: '2001-04-18',
    maritalStatus: '결혼',
    incomeStatus: '소득 모름',
  },
];

export const emptyRecipient = {
  name: '',
  relationship: '',
  birth: '',
  maritalStatus: '',
  incomeStatus: '',
};
