import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckBox from '@/components/forms/CheckBox.vue';

const meta: Meta<typeof CheckBox> = {
  title: 'forms/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    amount: { control: 'text' },
  },
  args: {
    modelValue: false,
    label: '이름',
    amount: '금액',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
