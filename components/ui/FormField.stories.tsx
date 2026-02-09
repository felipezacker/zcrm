import type { Meta, StoryObj } from '@storybook/react';
import { InputField, TextareaField, SelectField, CheckboxField, SubmitButton } from './FormField';

const meta = {
    title: 'UI/FormField',
    component: InputField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
    },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Input: Story = {
    args: {
        label: 'Email',
        placeholder: 'email@example.com',
    },
};

export const InputWithError: Story = {
    args: {
        label: 'Email',
        placeholder: 'email@example.com',
        error: { type: 'required', message: 'Email is required' },
    },
};

export const InputWithHint: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        hint: 'Must be at least 8 characters',
    },
};

export const Textarea: Story = {
    render: () => (
        <div className="w-[300px]">
            <TextareaField
                label="Description"
                placeholder="Enter a description..."
                rows={4}
            />
        </div>
    ),
    args: { label: 'Description' },
};

export const Select: Story = {
    render: () => (
        <div className="w-[300px]">
            <SelectField
                label="Country"
                placeholder="Select a country"
                options={[
                    { value: 'br', label: 'Brazil' },
                    { value: 'us', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                ]}
            />
        </div>
    ),
    args: { label: 'Country' },
};

export const Checkbox: Story = {
    render: () => (
        <div className="w-[300px]">
            <CheckboxField
                label="I agree to the terms and conditions"
            />
        </div>
    ),
    args: { label: 'Terms' },
};

export const SubmitButtons: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <SubmitButton variant="primary">Save Changes</SubmitButton>
            <SubmitButton variant="secondary">Cancel</SubmitButton>
            <SubmitButton variant="danger">Delete</SubmitButton>
            <SubmitButton isLoading loadingText="Saving...">Save</SubmitButton>
        </div>
    ),
    args: { label: 'Submit' },
};

export const CompleteForm: Story = {
    render: () => (
        <div className="w-[400px] space-y-4 p-6 border rounded-lg">
            <h2 className="text-lg font-semibold">Contact Form</h2>
            <InputField label="Name" placeholder="Your name" required />
            <InputField label="Email" type="email" placeholder="email@example.com" required />
            <SelectField
                label="Subject"
                placeholder="Select a subject"
                options={[
                    { value: 'support', label: 'Technical Support' },
                    { value: 'sales', label: 'Sales Inquiry' },
                    { value: 'other', label: 'Other' },
                ]}
            />
            <TextareaField label="Message" placeholder="Your message..." rows={4} />
            <CheckboxField label="Subscribe to newsletter" />
            <SubmitButton>Send Message</SubmitButton>
        </div>
    ),
    args: { label: 'Form' },
};
