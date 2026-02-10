import type { Meta, StoryObj } from '@storybook/nextjs';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Default', variant: 'default' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};

export const Destructive: Story = {
  args: { children: 'Destructive', variant: 'destructive' },
};

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-x-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Badge variant="default">Mobile Badge</Badge>
      <Badge variant="secondary">Info</Badge>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-4 space-x-2">
      <Badge variant="default">Dark</Badge>
      <Badge variant="secondary">Mode</Badge>
    </div>
  ),
};
