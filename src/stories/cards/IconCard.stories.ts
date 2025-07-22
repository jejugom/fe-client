import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconCard from '@/components/cards/IconCard.vue';
import IconCheck from '@/assets/icons/Check.svg'; // 실제 아이콘 경로에 맞게 수정하세요

const meta: Meta<typeof IconCard> = {
  title: 'cards/IconCard',
  component: IconCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    content1: { control: 'text' },
    content2: { control: 'text' },
    color: { control: 'select', options: ['primary', 'secondary'] },
    onClick: { action: 'clicked' },
  },
  args: {
    title: '카드 제목',
    content1: '상단 설명 텍스트',
    content2: '하단 설명 텍스트',
    color: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { IconCard },
    setup() {
      return { args, IconCheck };
    },
    template: `
      <IconCard v-bind="args">
        <template #icon>
          <img :src="IconCheck" />
        </template>
      </IconCard>
    `,
  }),
};
