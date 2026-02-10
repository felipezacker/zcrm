import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sheet } from './Sheet';
import { Button } from './button';
import { useState } from 'react';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ariaLabel: 'Sheet',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
        <Sheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="py-4">Sheet content goes here</div>
        </Sheet>
      </>
    );
  },
};

export const Mobile: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ariaLabel: 'Mobile Menu',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div className="w-80">
        <Button onClick={() => setIsOpen(true)} className="w-full">Menu</Button>
        <Sheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-2 p-4">
            <Button variant="ghost" className="w-full justify-start">Item 1</Button>
            <Button variant="ghost" className="w-full justify-start">Item 2</Button>
          </div>
        </Sheet>
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    ariaLabel: 'Dark Sheet',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div className="dark bg-slate-950 p-8 rounded">
        <Button onClick={() => setIsOpen(true)}>Open</Button>
        <Sheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>Content in dark mode</p>
        </Sheet>
      </div>
    );
  },
};
