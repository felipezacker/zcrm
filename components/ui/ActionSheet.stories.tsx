import type { Meta, StoryObj } from '@storybook/react';
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
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open</Button>
        <ActionSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="w-80">
        <Button onClick={() => setIsOpen(true)} className="w-full">Menu</Button>
        <ActionSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
