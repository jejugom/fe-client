import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputBox from '@/components/forms/InputBox.vue';

const meta: Meta<typeof InputBox> = {
  title: 'forms/InputBox',
  component: InputBox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'date', 'time'],
    },
  },
  args: {
    modelValue: '',
    placeholder: '텍스트를 입력하세요',
    size: 'medium',
    type: 'text',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
