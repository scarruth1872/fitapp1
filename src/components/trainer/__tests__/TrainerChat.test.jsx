import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TrainerChat from '../TrainerChat';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../config/firebase';

// Mock Firebase
vi.mock('../../../config/firebase', () => ({
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
  }
}));

// Mock Auth Context
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('TrainerChat', () => {
  const mockUser = { uid: 'test-user-id' };
  const mockMessages = [
    {
      id: '1',
      text: 'Hello trainer',
      sender: 'user',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'How can I help you today?',
      sender: 'trainer',
      timestamp: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ currentUser: mockUser });
  });

  it('renders chat interface', () => {
    render(<TrainerChat />);
    
    expect(screen.getByPlaceholder('Ask your trainer anything...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays messages', () => {
    render(
      <TrainerChat
        userProfile={{}}
        exerciseDb={{}}
        nutritionDb={{}}
        wellnessDb={{}}
      />
    );

    mockMessages.forEach(message => {
      expect(screen.getByText(message.text)).toBeInTheDocument();
    });
  });

  it('handles message input', async () => {
    const mockAddDoc = vi.fn().mockResolvedValue({ id: '3' });
    db.collection.mockReturnValue({ add: mockAddDoc });

    render(<TrainerChat />);

    const input = screen.getByPlaceholder('Ask your trainer anything...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Test message',
        sender: 'user'
      }));
    });

    expect(input.value).toBe('');
  });

  it('switches context correctly', () => {
    render(<TrainerChat />);

    const exerciseChip = screen.getByText('Exercise');
    const nutritionChip = screen.getByText('Nutrition');
    const wellnessChip = screen.getByText('Wellness');

    fireEvent.click(nutritionChip);
    expect(nutritionChip).toHaveClass('MuiChip-colorPrimary');

    fireEvent.click(wellnessChip);
    expect(wellnessChip).toHaveClass('MuiChip-colorPrimary');
    expect(nutritionChip).not.toHaveClass('MuiChip-colorPrimary');

    fireEvent.click(exerciseChip);
    expect(exerciseChip).toHaveClass('MuiChip-colorPrimary');
    expect(wellnessChip).not.toHaveClass('MuiChip-colorPrimary');
  });

  it('handles loading state', async () => {
    const slowAddDoc = vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ id: '3' }), 1000);
    }));
    db.collection.mockReturnValue({ add: slowAddDoc });

    render(<TrainerChat />);

    const input = screen.getByPlaceholder('Ask your trainer anything...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    const mockAddDoc = vi.fn().mockRejectedValue(new Error('Failed to send message'));
    db.collection.mockReturnValue({ add: mockAddDoc });

    render(<TrainerChat />);

    const input = screen.getByPlaceholder('Ask your trainer anything...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Error sending message:')).toBeInTheDocument();
    });
  });

  it('prevents empty messages', () => {
    const mockAddDoc = vi.fn();
    db.collection.mockReturnValue({ add: mockAddDoc });

    render(<TrainerChat />);

    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('handles Enter key press', () => {
    const mockAddDoc = vi.fn().mockResolvedValue({ id: '3' });
    db.collection.mockReturnValue({ add: mockAddDoc });

    render(<TrainerChat />);

    const input = screen.getByPlaceholder('Ask your trainer anything...');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockAddDoc).toHaveBeenCalled();
  });
});
