import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BtnCard from '@/components/cards/BtnCard.vue';

const meta: Meta<typeof BtnCard> = {
  title: 'cards/BtnCard',
  component: BtnCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    tags: { control: 'text' }, // 문자열로 입력받고 컴포넌트 내부에서 split
    btnText: { control: 'text' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'surface'],
    },
    onClick: { action: 'clicked' },
  },
  args: {
    title: '노후 준비 전략',
    content: '지금 시작해야 할 노후 자산 관리 방법',
    tags: '연금,세금,투자',
    btnText: '자세히 보기',
    color: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
