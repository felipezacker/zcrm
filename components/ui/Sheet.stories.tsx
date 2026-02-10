import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './Sheet';
import { Button } from './button';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetHeader>
        <div className="py-4">Sheet content</div>
      </SheetContent>
    </Sheet>
  ),
};

export const Mobile: Story = {
  render: () => (
    <div className="w-80">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full">Menu</Button>
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle>Mobile Menu</SheetTitle>
          </SheetHeader>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">Item 1</Button>
            <Button variant="ghost" className="w-full justify-start">Item 2</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Dark Mode Sheet</SheetTitle>
          </SheetHeader>
          <p>Content in dark mode</p>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
