import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SelectBox from '@/components/forms/SelectBox.vue';

const meta: Meta<typeof SelectBox> = {
  title: 'forms/SelectBox',
  component: SelectBox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    modelValue: '',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { SelectBox },
    setup() {
      return { args };
    },
    template: `
      <SelectBox v-bind="args" v-model="args.modelValue">
        <option disabled value="">옵션을 선택하세요</option>
        <option value="opt1">옵션 1</option>
        <option value="opt2">옵션 2</option>
        <option value="opt3">옵션 3</option>
      </SelectBox>
    `,
  }),
};
