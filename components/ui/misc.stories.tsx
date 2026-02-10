import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import AudioPlayer from './AudioPlayer';
import { ContactSearchCombobox } from './ContactSearchCombobox';
import { LossReasonModal } from './LossReasonModal';

const meta = {
  title: 'UI/Misc',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// ===== AUDIO PLAYER =====

export const AudioPlayerStory: StoryObj = {
  render: () => (
    <div className="w-96">
      <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    </div>
  ),
};

export const AudioPlayerMobile: StoryObj = {
  render: () => (
    <div className="w-80">
      <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const AudioPlayerDark: StoryObj = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded w-96">
      <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    </div>
  ),
};

// ===== CONTACT SEARCH COMBOBOX =====

export const ContactSearchDefault: StoryObj = {
  render: () => {
    const [contact, setContact] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    return (
      <div className="w-96">
        <ContactSearchCombobox
          onSelectContact={(c) => setContact(c)}
          onSelectCompany={(o) => setCompany(o)}
          onCreateNew={() => {}}
          selectedContact={contact}
          selectedCompany={company}
        />
      </div>
    );
  },
};

export const ContactSearchMobile: StoryObj = {
  render: () => {
    const [contact, setContact] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    return (
      <div className="w-80">
        <ContactSearchCombobox
          onSelectContact={(c) => setContact(c)}
          onSelectCompany={(o) => setCompany(o)}
          onCreateNew={() => {}}
          selectedContact={contact}
          selectedCompany={company}
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const ContactSearchDark: StoryObj = {
  render: () => {
    const [contact, setContact] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    return (
      <div className="dark bg-slate-950 p-8 rounded w-96">
        <ContactSearchCombobox
          onSelectContact={(c) => setContact(c)}
          onSelectCompany={(o) => setCompany(o)}
          onCreateNew={() => {}}
          selectedContact={contact}
          selectedCompany={company}
        />
      </div>
    );
  },
};

// ===== LOSS REASON MODAL =====

export const LossReasonDefault: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <LossReasonModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={(reason) => console.log('Loss reason:', reason)}
          dealTitle="Test Deal"
        />
      </>
    );
  },
};

export const LossReasonMobile: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="w-80">
        <button onClick={() => setIsOpen(true)}>Open</button>
        <LossReasonModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={(reason) => console.log('Loss reason:', reason)}
          dealTitle="Test Deal"
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};
