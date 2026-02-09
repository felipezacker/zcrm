import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta = {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card content with useful information.</p>
            </CardContent>
            <CardFooter>
                <Button>Action</Button>
            </CardFooter>
        </Card>
    ),
};

export const Simple: Story = {
    render: () => (
        <Card className="w-[350px] p-6">
            <p>Simple card with just content.</p>
        </Card>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Enter your details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="email@example.com" />
                </div>
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <input type="password" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="••••••••" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Create</Button>
            </CardFooter>
        </Card>
    ),
};

export const DarkMode: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Dark Mode Card</CardTitle>
                <CardDescription>This card uses design tokens</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content adapts to dark mode automatically.</p>
            </CardContent>
        </Card>
    ),
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
