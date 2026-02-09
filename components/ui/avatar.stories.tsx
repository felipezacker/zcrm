import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta = {
    title: 'UI/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    render: () => (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export const Fallback: Story = {
    args: {},
    render: () => (
        <Avatar>
            <AvatarImage src="/broken-image.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
    ),
};

export const Sizes: Story = {
    args: {},
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">XS</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">SM</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className="h-14 w-14">
                <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">XL</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const AvatarGroup: Story = {
    args: {},
    render: () => (
        <div className="flex -space-x-2">
            <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-destructive text-destructive-foreground">B</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-success text-white">C</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
                <AvatarFallback>+3</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const DarkMode: Story = {
    args: {},
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div data-theme="dark" className="p-6 bg-neutral-900 rounded-lg flex gap-4">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>DM</AvatarFallback>
            </Avatar>
        </div>
    ),
};
