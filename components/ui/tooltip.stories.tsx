import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';

const meta = {
    title: 'UI/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <TooltipProvider>
                <Story />
            </TooltipProvider>
        ),
    ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
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

export const WithSidePositions: Story = {
    args: {},
    render: () => (
        <div className="flex gap-8 items-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="secondary">Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">Top tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="secondary">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">Right tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="secondary">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="secondary">Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">Left tooltip</TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const LongContent: Story = {
    args: {},
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button>Info</Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
                <p>This tooltip contains longer content that wraps to multiple lines.</p>
            </TooltipContent>
        </Tooltip>
    ),
};

export const DarkMode: Story = {
    args: {},
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div data-theme="dark" className="p-6 bg-neutral-900 rounded-lg">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Dark Mode Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Tooltip in dark mode</p>
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};
