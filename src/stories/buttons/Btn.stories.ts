import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Btn from '@/components/buttons/Btn.vue';
import { fn } from 'storybook/internal/test';

const meta = {
  title: 'btns/Btn',
  component: Btn,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'secondary-stroke', 'surface'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'square'],
    },
  },
  args: {
    label: 'Button',
    color: 'primary',
    size: 'medium',
    onClick: fn(),
  },
} satisfies Meta<typeof Btn>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
