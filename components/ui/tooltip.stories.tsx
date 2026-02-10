import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { Button } from './button';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Top tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">Right tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Left</Button>
      </TooltipTrigger>
      <TooltipContent side="left">Left tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80 flex justify-center py-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Mobile Tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>Mobile tooltip content</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Dark Mode</Button>
        </TooltipTrigger>
        <TooltipContent>Dark mode tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};
