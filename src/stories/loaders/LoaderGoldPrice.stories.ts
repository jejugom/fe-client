import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LoaderGoldPrice from '@/components/loaders/LoaderGoldPrice.vue';

const meta = {
  title: 'loaders/LoaderGoldPrice',
  component: LoaderGoldPrice,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof LoaderGoldPrice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
