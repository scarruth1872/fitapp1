import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import ExerciseVisualizer from '../ExerciseVisualizer';

const mockExerciseDb = {
  categories: {
    strength: {
      name: 'Strength',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          type: 'strength',
          difficulty: 'intermediate',
          equipment: ['barbell', 'bench'],
          primaryMuscles: ['chest', 'triceps'],
          secondaryMuscles: ['shoulders'],
          preparation: ['Step 1', 'Step 2'],
          execution: ['Execute 1', 'Execute 2'],
          commonErrors: ['Error 1']
        },
        {
          id: '2',
          name: 'Squat',
          type: 'strength',
          difficulty: 'intermediate',
          equipment: ['barbell'],
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['hamstrings', 'core'],
          preparation: ['Step 1'],
          execution: ['Execute 1'],
          commonErrors: ['Error 1']
        }
      ]
    },
    cardio: {
      name: 'Cardio',
      exercises: [
        {
          id: '3',
          name: 'Running',
          type: 'cardio',
          difficulty: 'beginner',
          equipment: ['none'],
          primaryMuscles: ['quadriceps', 'calves'],
          secondaryMuscles: ['hamstrings'],
          preparation: ['Step 1'],
          execution: ['Execute 1'],
          commonErrors: ['Error 1']
        }
      ]
    }
  }
};

describe('ExerciseVisualizer', () => {
  it('renders exercise categories', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    expect(screen.getByText('All Exercises')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
  });

  it('displays exercise list', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('filters exercises by category', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    // Click on Strength tab
    fireEvent.click(screen.getByText('Strength'));

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.queryByText('Running')).not.toBeInTheDocument();

    // Click on Cardio tab
    fireEvent.click(screen.getByText('Cardio'));

    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('shows exercise details when clicked', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    fireEvent.click(screen.getByText('Bench Press'));

    expect(screen.getByText('Equipment Needed')).toBeInTheDocument();
    expect(screen.getByText('Muscle Groups')).toBeInTheDocument();
    expect(screen.getByText('Preparation')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.getByText('Common Errors')).toBeInTheDocument();

    // Check specific exercise details
    expect(screen.getByText('barbell')).toBeInTheDocument();
    expect(screen.getByText('bench')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('triceps')).toBeInTheDocument();
    expect(screen.getByText('shoulders')).toBeInTheDocument();
  });

  it('handles exercise selection', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    // Select first exercise
    fireEvent.click(screen.getByText('Bench Press'));
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();

    // Select second exercise
    fireEvent.click(screen.getByText('Squat'));
    expect(screen.queryByText('Step 2')).not.toBeInTheDocument();
    expect(screen.getByText('quadriceps')).toBeInTheDocument();
  });

  it('displays exercise difficulty and type', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    const benchPress = screen.getByText('Bench Press');
    const listItem = benchPress.closest('li');
    
    expect(within(listItem).getByText('strength • intermediate')).toBeInTheDocument();
  });

  it('handles accordion expansion', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    fireEvent.click(screen.getByText('Bench Press'));

    // Click on preparation accordion
    fireEvent.click(screen.getByText('Preparation'));
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();

    // Click on execution accordion
    fireEvent.click(screen.getByText('Execution'));
    expect(screen.getByText('Execute 1')).toBeInTheDocument();
    expect(screen.getByText('Execute 2')).toBeInTheDocument();

    // Click on common errors accordion
    fireEvent.click(screen.getByText('Common Errors'));
    expect(screen.getByText('Error 1')).toBeInTheDocument();
  });

  it('updates layout on exercise selection', () => {
    render(<ExerciseVisualizer exerciseDb={mockExerciseDb} />);

    // Initially, exercise list should take full width
    const initialList = screen.getByRole('list');
    expect(initialList).toHaveStyle({ gridColumn: '1 / -1' });

    // After selecting an exercise, list should take half width
    fireEvent.click(screen.getByText('Bench Press'));
    const updatedList = screen.getByRole('list');
    expect(updatedList).toHaveStyle({ gridColumn: '1 / 2' });
  });
});
