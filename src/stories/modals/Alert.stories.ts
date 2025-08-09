import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Alert from '@/components/modals/Alert.vue';

const meta: Meta<typeof Alert> = {
  title: 'modals/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    onClick: { action: 'click' },
  },
  args: {
    title: '모달 제목',
    leftLabel: '취소',
    rightLabel: '확인',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Alert },
    setup() {
      return { args };
    },
    template: `
      <Alert v-bind="args" @click="alert('확인 클릭')">
        <div class="h-52 text-center">모달 내용입니다. 여기에 원하는 내용을 넣으세요.</div>
      </Alert>
    `,
  }),
};
