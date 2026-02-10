import type { Meta, StoryObj } from '@storybook/nextjs';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Alert Title</AlertTitle>
      <AlertDescription>
        This is an informational alert message.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
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
    <Alert className="w-96 border-green-500">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your action completed successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Mobile Alert</AlertTitle>
        <AlertDescription>
          Responsive on small screens
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8">
      <Alert className="w-96">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Dark Mode Alert</AlertTitle>
        <AlertDescription>Works in dark mode</AlertDescription>
      </Alert>
    </div>
  ),
};
