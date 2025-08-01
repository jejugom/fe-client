export const dummyRecipients = [
  {
    name: '홍길동',
    relationship: '자녀',
    birth: '2001-04-18',
    maritalStatus: '미혼',
    giftedBefore: true, // 최근 10년 내 증여 여부
    giftedAmount: 5000000, // 증여한 금액
    whoPaysTax: '본인', // 증여세 납부자 (예: 본인, 수증자)
  },
  {
    name: '최두식',
    relationship: '배우자',
    birth: '2001-04-18',
    maritalStatus: '결혼',
    giftedBefore: false,
    giftedAmount: 0,
    whoPaysTax: '수증자',
  },
];

export const emptyRecipient = {
  name: '',
  relationship: '',
  birth: '',
  maritalStatus: '',
  giftedBefore: false,
  giftedAmount: 0,
  whoPaysTax: '',
};
