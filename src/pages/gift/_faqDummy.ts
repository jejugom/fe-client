export interface FaqItem {
  id: number;
  category: 'gift' | 'inheritance';
  question: string;
  answer: string;
}

export const faqDummyData: FaqItem[] = [
  {
    id: 1,
    category: 'gift',
    question: '손주에게 돈을 줄 때 세금이 나오나요?',
    answer: `
        <p>네, 손주에게 돈을 주는 것도 '증여'로 보고 세금이 날 수 있습니다.</p>
  
        <p>다만, 일정 금액까지는 세금 없이 줄 수 있는 한도가 정해져 있습니다.</p>
  
        <p>예를 들어,</p>
  
        <ul class="ml-6 list-disc space-y-1 text-sm">
          <li>손주가 미성년자일 경우: 10년 동안 2,000만 원까지</li>
          <li>손주가 성인일 경우: 10년 동안 5,000만 원까지</li>
        </ul>
  
        <p>
          이 범위 안에서 주시면 세금이 없습니다.<br />
          하지만 이 금액을 넘으면, 초과한 부분에 대해 증여세를 내야 합니다.
        </p>
  
        <p>
          또한 손주가 아닌 자녀를 통해 간접적으로 주는 경우에도 세금이 생길 수 있으니<br />
          10년 단위로 얼마를 주었는지 기록해두는 것이 중요합니다.
        </p>
      `,
  },
  {
    id: 2,
    category: 'gift',
    question: '몇 년마다 나눠서 세금을 줄일 수 있나요?',
    answer:
      '10년마다 증여세 공제가 가능하므로 분산해서 증여하면 절세 효과가 있습니다.',
  },
  {
    id: 3,
    category: 'gift',
    question: '집이나 땅을 자녀에게 줄 때 어떤 절차가 필요하나요?',
    answer:
      '공증, 등기이전, 감정평가 등의 절차가 필요하며 증여세 신고도 필수입니다.',
  },
  {
    id: 4,
    category: 'inheritance',
    question: '상속세는 언제 내야 하나요?',
    answer: '상속 개시일로부터 6개월 이내에 상속세를 신고하고 납부해야 합니다.',
  },
  {
    id: 5,
    category: 'inheritance',
    question: '배우자와 자녀가 상속을 받을 때 비율이 어떻게 되나요?',
    answer: '법정상속비율에 따라 배우자와 자녀가 1.5:1의 비율로 상속받습니다.',
  },
  {
    id: 6,
    category: 'inheritance',
    question: '미리 상속 계획을 세우면 어떤 점이 좋은가요?',
    answer: '세금 부담을 줄이고 가족 간 분쟁을 예방할 수 있는 장점이 있습니다.',
  },
];
