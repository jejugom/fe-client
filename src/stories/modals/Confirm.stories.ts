import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Confirm from '@/components/modals/Confirm.vue';

const meta: Meta<typeof Confirm> = {
  title: 'modals/Confirm',
  component: Confirm,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    onClick1: { action: 'click1' },
    onClick2: { action: 'click2' },
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
    components: { Confirm },
    setup() {
      return { args };
    },
    template: `
      <Confirm v-bind="args" @click1="alert('취소 클릭')" @click2="alert('확인 클릭')">
        <div class="h-52 text-center">모달 내용입니다. 여기에 원하는 내용을 넣으세요.</div>
      </Confirm>
    `,
  }),
};
