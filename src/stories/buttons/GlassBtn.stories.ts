import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GlassBtn from '@/components/buttons/GlassBtn.vue';
import { fn } from 'storybook/internal/test';

const meta = {
  title: 'btns/GlassBtn',
  component: GlassBtn,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'surface'],
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
} satisfies Meta<typeof GlassBtn>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
