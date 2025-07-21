import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Modal from '@/components/modals/Modal.vue';

const meta: Meta<typeof Modal> = {
  title: 'modals/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    click1: { action: 'click1' },
    click2: { action: 'click2' },
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
    components: { Modal },
    setup() {
      return { args };
    },
    template: `
      <Modal v-bind="args" @click1="alert('취소 클릭')" @click2="alert('확인 클릭')">
        <div class="h-52 text-center">모달 내용입니다. 여기에 원하는 내용을 넣으세요.</div>
      </Modal>
    `,
  }),
};
