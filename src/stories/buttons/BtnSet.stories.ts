import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BtnSet from '@/components/buttons/BtnSet.vue';

const meta: Meta<typeof BtnSet> = {
  title: 'btns/BtnSet',
  component: BtnSet,
  tags: ['autodocs'],
  argTypes: {
    label1: { control: 'text' },
    label2: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label1: '취소',
    label2: '확인',
    onClick1: () => alert('취소 클릭됨'),
    onClick2: () => alert('확인 클릭됨'),
  },
};
