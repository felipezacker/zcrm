import type { Meta, StoryObj } from '@storybook/react';
import { AudioPlayer } from './AudioPlayer';
import { ContactSearchCombobox } from './ContactSearchCombobox';
import { LossReasonModal } from './LossReasonModal';

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
  render: () => (
    <div className="w-96">
      <ContactSearchCombobox />
    </div>
  ),
};

export const ContactSearchMobile: StoryObj = {
  render: () => (
    <div className="w-80">
      <ContactSearchCombobox />
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const ContactSearchDark: StoryObj = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded w-96">
      <ContactSearchCombobox />
    </div>
  ),
};

// ===== LOSS REASON MODAL =====

export const LossReasonDefault: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <LossReasonModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          dealId="test-123"
        />
      </>
    );
  },
};

export const LossReasonMobile: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
      <div className="w-80">
        <button onClick={() => setIsOpen(true)}>Open</button>
        <LossReasonModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          dealId="test-123"
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

import React from 'react';
