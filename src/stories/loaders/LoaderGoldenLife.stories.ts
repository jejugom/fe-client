import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LoaderGoldenLife from '@/components/loaders/LoaderGoldenLife.vue';

const meta = {
  title: 'loaders/LoaderGoldenLife',
  component: LoaderGoldenLife,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof LoaderGoldenLife>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
