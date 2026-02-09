import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const meta = {
    title: 'UI/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive'],
        },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Alert className="w-[400px]">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
                This is an informational alert message.
            </AlertDescription>
        </Alert>
    ),
};

export const Destructive: Story = {
    render: () => (
        <Alert variant="destructive" className="w-[400px]">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again.
            </AlertDescription>
        </Alert>
    ),
};

export const Success: Story = {
    render: () => (
        <Alert className="w-[400px] border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
                Your changes have been saved successfully.
            </AlertDescription>
        </Alert>
    ),
};

export const Warning: Story = {
    render: () => (
        <Alert className="w-[400px] border-yellow-500 text-yellow-700">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                Please review your input before proceeding.
            </AlertDescription>
        </Alert>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-4 w-[400px]">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default</AlertTitle>
                <AlertDescription>Default alert style.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Destructive</AlertTitle>
                <AlertDescription>Error alert style.</AlertDescription>
            </Alert>
        </div>
    ),
};
