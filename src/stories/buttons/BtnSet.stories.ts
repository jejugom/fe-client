import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BtnSet from '@/components/buttons/BtnSet.vue';

const meta: Meta<typeof BtnSet> = {
  title: 'btns/BtnSet',
  component: BtnSet,
  tags: ['autodocs'],
  argTypes: {
    label1: { control: 'text' },
    label2: { control: 'text' },
    type: {
      control: { type: 'radio' },
      options: ['type1', 'type2'],
      description: '버튼 스타일 유형',
      defaultValue: 'type1',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label1: '취소',
    label2: '완료',
    type: 'type1',
    onClick1: () => alert('취소'),
    onClick2: () => alert('완료'),
  },
};
