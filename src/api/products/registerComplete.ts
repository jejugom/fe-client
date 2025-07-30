export interface Register {
  bookingId: string;
  branchName: string;
  prodName: string;
  date: string;
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

export const api_data: Register = {
  bookingId: '01K1A7XCJM25W39786MVRMN49Z',
  branchName: 'KB골든라이프센터 서초지점',
  prodName: 'KB주택담보대출변동(일반자금)',
  date: '2025-07-29',
  time: '14:00',
  docInfo: {
    requiredDocuments: [
      '신분증',
      '주민등록등본',
      '가족관계증명서',
      '인감증명서 및 인감도장',
      '소득증빙서류 (재직/사업자 유형에 따라 상이)',
      '부동산 등기권리증 또는 매매계약서',
      '건축물대장',
    ],
  },
};
