import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTS =====

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

// ===== SIZES =====

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Default_Size: Story = {
  args: {
    children: 'Default',
    size: 'default',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    children: '🎨',
    size: 'icon',
  },
};

// ===== STATES =====

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: '⏳ Loading...',
    disabled: true,
  },
};

// ===== MOBILE PREVIEWS =====

export const Mobile: Story = {
  args: {
    children: 'Mobile Button',
    variant: 'default',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobileSE',
    },
  },
};

export const MobileSmall: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// ===== DARK MODE =====

export const DarkMode: Story = {
  args: {
    children: 'Dark Button',
    variant: 'default',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-slate-950 p-8 rounded">
        <Story />
      </div>
    ),
  ],
};

export const DarkMobileVariant: Story = {
  args: {
    children: 'Mobile Dark',
    variant: 'destructive',
  },
  decorators: [
    (Story) => (
      <div className="dark bg-slate-950 p-4 rounded w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobileSE',
    },
  },
};

// ===== GROUP: ALL VARIANTS TOGETHER =====

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 p-8 flex flex-col items-start">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🎨</Button>
    </div>
  ),
};
