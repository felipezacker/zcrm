import type { Meta, StoryObj } from '@storybook/nextjs';
import { Modal } from './Modal';
import { Button } from './Button';
import { useState } from 'react';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Dialog Title',
    size: 'md',
    children: null,
  },
};

export const Small: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Small Modal',
    size: 'sm',
    children: null,
  },
};

export const Large: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Large Modal',
    size: 'lg',
    children: null,
  },
};

export const Mobile: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Mobile Modal',
    size: 'md',
    children: null,
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const WithLongContent: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="space-y-4">
        <p>Modal with longer content</p>
        <p>This demonstrates scrolling on small screens</p>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i}>Content line {i + 1}</p>
        ))}
      </div>
    </ModalWrapper>
  ),
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Long Content Modal',
    size: 'md',
    children: null,
  },
};

export const Dark: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Dark Mode Modal',
    size: 'md',
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-slate-950 min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
};
