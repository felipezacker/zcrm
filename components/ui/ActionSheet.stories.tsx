import type { Meta, StoryObj } from '@storybook/nextjs';
import { ActionSheet } from './ActionSheet';
import { Button } from './button';
import { useState } from 'react';

const meta = {
  title: 'UI/ActionSheet',
  component: ActionSheet,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Choose Action',
    description: 'Select an action below',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open</Button>
        <ActionSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-2 p-4">
            <Button className="w-full">Action 1</Button>
            <Button className="w-full">Action 2</Button>
            <Button variant="destructive" className="w-full">Delete</Button>
          </div>
        </ActionSheet>
      </>
    );
  },
};

export const Mobile: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Menu',
    description: 'Select an option',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div className="w-80">
        <Button onClick={() => setIsOpen(true)} className="w-full">Menu</Button>
        <ActionSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-2 p-4">
            <Button className="w-full" size="lg">Option 1</Button>
            <Button className="w-full" size="lg">Option 2</Button>
          </div>
        </ActionSheet>
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};
