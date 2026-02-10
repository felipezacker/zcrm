import type { Meta, StoryObj } from '@storybook/nextjs';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is the popover content.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80 flex justify-center py-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Mobile Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <p className="text-sm">Mobile popover content</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Dark Mode</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Popover in dark mode</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
