import type { Meta, StoryObj } from '@storybook/nextjs';
import { Badge } from './badge';

const meta = {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Badge',
        variant: 'default',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const Destructive: Story = {
    args: {
        children: 'Destructive',
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex gap-2 flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>
    ),
};

export const UseCases: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center gap-2">
                <span>Priority:</span>
                <Badge variant="destructive">High</Badge>
            </div>
            <div className="flex items-center gap-2">
                <span>Type:</span>
                <Badge variant="secondary">Feature</Badge>
            </div>
        </div>
    ),
};
