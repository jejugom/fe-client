import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TextBtn from '@/components/buttons/TextBtn.vue';
import { fn } from 'storybook/internal/test';

const meta = {
  title: 'btns/TextBtn',
  component: TextBtn,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    color: {
      control: 'select',
      options: ['primary', 'surface'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  args: {
    label: 'Button',
    color: 'primary',
    size: 'medium',
    onClick: fn(),
  },
} satisfies Meta<typeof TextBtn>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
