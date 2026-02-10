import type { Meta, StoryObj } from '@storybook/nextjs';
import { FullscreenSheet } from './FullscreenSheet';
import { Button } from './Button';
import { useState } from 'react';

const meta = {
  title: 'UI/FullscreenSheet',
  component: FullscreenSheet,
  tags: ['autodocs'],
} satisfies Meta<typeof FullscreenSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Fullscreen Sheet',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Fullscreen</Button>
        <FullscreenSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="h-full flex flex-col">
            <div className="flex-1 p-4">
              <h2 className="text-2xl font-bold mb-4">Fullscreen Content</h2>
              <p>Content takes full screen on mobile</p>
            </div>
            <div className="border-t p-4">
              <Button onClick={() => setIsOpen(false)} className="w-full">Close</Button>
            </div>
          </div>
        </FullscreenSheet>
      </>
    );
  },
};

export const Mobile: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Mobile Fullscreen',
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <div className="w-80">
        <Button onClick={() => setIsOpen(true)} className="w-full">Open</Button>
        <FullscreenSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Mobile Fullscreen</h2>
            <p>Takes entire screen on mobile</p>
          </div>
        </FullscreenSheet>
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};
