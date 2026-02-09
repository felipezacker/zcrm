import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';
import { useState } from 'react';
import { Button } from './button';

const meta = {
    title: 'UI/Sheet',
    component: Sheet,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for Sheet demo
function SheetDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-8">
            <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Demo Sheet">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Sheet Content</h2>
                    <p className="text-muted-foreground mb-4">
                        This is a bottom sheet component for mobile-first designs.
                    </p>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </div>
            </Sheet>
        </div>
    );
}

export const Default: Story = {
    args: {
        isOpen: false,
        onClose: () => { },
        children: null,
    },
    render: () => <SheetDemo />,
};

function SheetWithLongContent() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-8">
            <Button onClick={() => setIsOpen(true)}>Open Long Sheet</Button>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Long Content">
                <div className="p-6 max-h-[80vh] overflow-auto">
                    <h2 className="text-lg font-semibold mb-4">Long Content</h2>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <p key={i} className="text-muted-foreground mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                            euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc.
                        </p>
                    ))}
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </div>
            </Sheet>
        </div>
    );
}

export const LongContent: Story = {
    args: {
        isOpen: false,
        onClose: () => { },
        children: null,
    },
    render: () => <SheetWithLongContent />,
};

function SheetDarkDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div data-theme="dark" className="p-8 bg-neutral-900 min-h-screen">
            <Button variant="outline" onClick={() => setIsOpen(true)}>
                Open Dark Sheet
            </Button>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Dark Mode Sheet">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Dark Mode Sheet</h2>
                    <p className="text-neutral-400 mb-4">
                        Sheet adapts to dark mode automatically.
                    </p>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </div>
            </Sheet>
        </div>
    );
}

export const DarkMode: Story = {
    args: {
        isOpen: false,
        onClose: () => { },
        children: null,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => <SheetDarkDemo />,
};
