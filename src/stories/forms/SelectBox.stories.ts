import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SelectBox from '@/components/forms/SelectBox.vue';

// SelectBox 컴포넌트의 제네릭 타입을 명시적으로 'string'으로 지정합니다.
// 만약 다른 타입(number, boolean)을 사용한다면 해당 타입으로 변경해야 합니다.
const meta: Meta<typeof SelectBox<string>> = {
  title: 'forms/SelectBox',
  component: SelectBox as any, // 'as any'를 사용해 타입스크립트의 엄격한 검사를 일시적으로 완화합니다.
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
