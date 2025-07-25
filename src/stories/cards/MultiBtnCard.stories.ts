import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MultiBtnCard from '@/components/cards/MultiBtnCard.vue';

const meta: Meta<typeof MultiBtnCard> = {
  title: 'cards/MultiBtnCard',
  component: MultiBtnCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    tags: { control: 'text' },
    btnText1: { control: 'text' },
    btnText2: { control: 'text' },
    'onClick:edit': { action: 'edit clicked' },
    'onClick:delete': { action: 'delete clicked' },
  },
  args: {
    title: '적금통장',
    content: '예금/현금',
    tags: '3,000만원',
    btnText1: '수정',
    btnText2: '삭제',
    'onClick:edit': () => console.log('edit clicked'),
    'onClick:delete': () => console.log('delete clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
