import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LoaderDetailImg from '@/components/loaders/LoaderDetailImg.vue';

const meta = {
  title: 'loaders/LoaderDetailImg',
  component: LoaderDetailImg,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof LoaderDetailImg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
