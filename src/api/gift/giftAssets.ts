export const api_data = {
  user_info: {
    user_name: '홍길동',

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
  category_summary: [
    {
      category_id: 1,
      category_name: '부동산',
      selected_count: 1,
      total_count: 3,
      asset_list: [
        {
          asset_id: '101',
          asset_name: '부동산 이름1',
          asset_amount: 1050000000,
          checked: false,
        },
        {
          asset_id: '102',
          asset_name: '부동산 이름2',
          asset_amount: 680000000,
          checked: false,
        },
        {
          asset_id: '103',
          asset_name: '부동산 이름3',
          asset_amount: 200000000,
          checked: false,
        },
        {
          asset_id: '104',
          asset_name: '부동산 이름4',
          asset_amount: 200000000,
          checked: false,
        },
      ],
    },
    {
      category_id: 2,
      category_name: '예·적금',
      selected_count: 2,
      total_count: 2,
      asset_list: [
        {
          asset_id: '201',
          asset_name: '적금 상품1',
          asset_amount: 1050000000,
          checked: false,
        },
        {
          asset_id: '202',
          asset_name: '적금 상품2',
          asset_amount: 90000000,
          checked: false,
        },
        {
          asset_id: '203',
          asset_name: '적금 상품3',
          asset_amount: 20000000,
          checked: false,
        },
        {
          asset_id: '204',
          asset_name: '적금 상품4',
          asset_amount: 2050000,
          checked: false,
        },
      ],
    },
    {
      category_id: 3,
      category_name: '현금',
      selected_count: 2,
      total_count: 2,
      asset_list: [
        {
          asset_id: '301',
          asset_name: '보유 현금',
          asset_amount: 10000000,
          checked: false,
        },
        {
          asset_id: '302',
          asset_name: 'C은행 보통예금',
          asset_amount: 5000000,
          checked: true,
        },
      ],
    },
    {
      category_id: 4,
      category_name: '주식·펀드',
      selected_count: 2,
      total_count: 2,
      asset_list: [
        {
          asset_id: '401',
          asset_name: '국내 주식 (A전자)',
          asset_amount: 200000000,
          checked: false,
        },
        {
          asset_id: '402',
          asset_name: '해외 펀드 (B펀드)',
          asset_amount: 100000000,
          checked: false,
        },
      ],
    },
    {
      category_id: 5,
      category_name: '사업체·지분',
      selected_count: 2,
      total_count: 2,
      asset_list: [
        {
          asset_id: '501',
          asset_name: '사업체 1',
          asset_amount: 200000000,
          checked: false,
        },
        {
          asset_id: '502',
          asset_name: '사업체 2',
          asset_amount: 100000000,
          checked: false,
        },
      ],
    },
    {
      category_id: 6,
      category_name: '기타',
      selected_count: 2,
      total_count: 2,
      asset_list: [
        {
          asset_id: '601',
          asset_name: '기타 자산 1',
          asset_amount: 200000000,
          checked: false,
        },
        {
          asset_id: '602',
          asset_name: '기타 자산 2',
          asset_amount: 100000000,
          checked: false,
        },
      ],
    },
  ],
};
