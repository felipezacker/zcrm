import type { Meta, StoryObj } from '@storybook/nextjs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Responsive card for mobile</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobileSE',
    },
  },
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Just header and content.</p>
      </CardContent>
    </Card>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Dark Mode Card</CardTitle>
          <CardDescription>Works with dark theme</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card in dark mode</p>
        </CardContent>
      </Card>
    </div>
  ),
};
