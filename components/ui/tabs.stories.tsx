import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
    title: 'UI/Tabs',
    component: Tabs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    render: () => (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-4">
                <p className="text-sm text-muted-foreground">
                    Make changes to your account here.
                </p>
            </TabsContent>
            <TabsContent value="password" className="p-4">
                <p className="text-sm text-muted-foreground">
                    Change your password here.
                </p>
            </TabsContent>
            <TabsContent value="settings" className="p-4">
                <p className="text-sm text-muted-foreground">
                    Configure your settings here.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const TwoTabs: Story = {
    args: {},
    render: () => (
        <Tabs defaultValue="overview" className="w-[300px]">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4">
                <p className="text-sm">Dashboard overview content.</p>
            </TabsContent>
            <TabsContent value="analytics" className="p-4">
                <p className="text-sm">Analytics data and charts.</p>
            </TabsContent>
        </Tabs>
    ),
};

export const DisabledTab: Story = {
    args: {},
    render: () => (
        <Tabs defaultValue="active" className="w-[300px]">
            <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="p-4">
                <p className="text-sm">Active tab content.</p>
            </TabsContent>
            <TabsContent value="other" className="p-4">
                <p className="text-sm">Other tab content.</p>
            </TabsContent>
        </Tabs>
    ),
};

export const DarkMode: Story = {
    args: {},
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div data-theme="dark" className="p-6 bg-neutral-900 rounded-lg">
            <Tabs defaultValue="tab1" className="w-[350px]">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="p-4">
                    <p className="text-sm text-white">Dark mode tab content.</p>
                </TabsContent>
                <TabsContent value="tab2" className="p-4">
                    <p className="text-sm text-white">Second tab in dark mode.</p>
                </TabsContent>
            </Tabs>
        </div>
    ),
};
