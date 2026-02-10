import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="text-xs">Mobile</div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <div className="text-xs">Default</div>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <div className="text-xs">Large</div>
      <Avatar className="h-12 w-12">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>AA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BB</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>DK</AvatarFallback>
      </Avatar>
    </div>
  ),
};
