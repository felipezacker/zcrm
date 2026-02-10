import type { Meta, StoryObj } from '@storybook/react';
import { InputField, TextareaField, SelectField, CheckboxField, SubmitButton } from './FormField';
import { useForm } from 'react-hook-form';

const meta = {
  title: 'UI/Form Fields',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const InputDefault: Story = {
  render: () => {
    const { register, formState: { errors } } = useForm();
    return (
      <div className="w-96">
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          registration={register('email')}
          error={errors.email}
        />
      </div>
    );
  },
};

export const InputWithError: Story = {
  render: () => {
    return (
      <div className="w-96">
        <InputField
          label="Password"
          type="password"
          placeholder="Enter password"
          error={{ message: 'Password is required' } as any}
        />
      </div>
    );
  },
};

export const Textarea: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className="w-96">
        <TextareaField
          label="Message"
          placeholder="Enter your message"
          registration={register('message')}
        />
      </div>
    );
  },
};

export const Select: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className="w-96">
        <SelectField
          label="Choose option"
          placeholder="Select one"
          options={[
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' },
            { value: 'opt3', label: 'Option 3' },
          ]}
          registration={register('option')}
        />
      </div>
    );
  },
};

export const Checkbox: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className="w-96">
        <CheckboxField
          label="I agree to terms"
          registration={register('agree')}
        />
      </div>
    );
  },
};

export const SubmitButtonVariants: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <SubmitButton variant="primary">Primary</SubmitButton>
      <SubmitButton variant="secondary">Secondary</SubmitButton>
      <SubmitButton variant="danger">Danger</SubmitButton>
    </div>
  ),
};

export const Mobile: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className="w-80">
        <InputField
          label="Name"
          placeholder="Your name"
          registration={register('name')}
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className="dark bg-slate-950 p-8 rounded w-96">
        <InputField
          label="Email"
          type="email"
          placeholder="Email in dark mode"
          registration={register('email')}
        />
      </div>
    );
  },
};
