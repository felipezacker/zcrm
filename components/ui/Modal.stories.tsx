import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './button';
import { useState } from 'react';

const meta = {
    title: 'UI/Modal',
    component: Modal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive modal example
const ModalDemo = ({ size }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="p-8">
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Modal Title"
                size={size}
            >
                <p className="text-foreground-secondary">
                    This is the modal content. It can contain any React components.
                </p>
                <div className="mt-4 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                </div>
            </Modal>
        </div>
    );
};

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Modal Title',
        children: 'Modal content goes here',
    },
    render: (args) => <ModalDemo size={args.size} />,
};

export const Small: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Small Modal',
        size: 'sm',
        children: 'Small modal content',
    },
    render: (args) => <ModalDemo size="sm" />,
};

export const Large: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Large Modal',
        size: 'lg',
        children: 'Large modal content',
    },
    render: (args) => <ModalDemo size="lg" />,
};

export const ExtraLarge: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Extra Large Modal',
        size: 'xl',
        children: 'Extra large modal content',
    },
    render: (args) => <ModalDemo size="xl" />,
};

// Static open modal for visual testing
export const OpenState: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        title: 'Confirm Action',
        children: (
            <div>
                <p className="text-foreground-secondary mb-4">
                    Are you sure you want to proceed with this action?
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                </div>
            </div>
        ),
    },
};
