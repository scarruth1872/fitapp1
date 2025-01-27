import { createContext, useContext, useState, useMemo } from 'react';

const ExerciseContext = createContext();

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider = ({ children }) => {
  // This could be fetched from Firebase in a real app
  const [exercises] = useState([
    { id: '1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell', description: 'A compound exercise that primarily targets the chest muscles.', instructions: ['Lie on a flat bench', 'Grip the barbell slightly wider than shoulder width', 'Lower the bar to your chest', 'Press the bar back up to starting position'] },
    { id: '2', name: 'Squat', category: 'Legs', equipment: 'Barbell', description: 'A fundamental lower body exercise that works multiple muscle groups.', instructions: ['Position the bar on your upper back', 'Stand with feet shoulder-width apart', 'Lower your body by bending your knees', 'Return to standing position'] },
    { id: '3', name: 'Deadlift', category: 'Back', equipment: 'Barbell', description: 'A powerful compound movement that targets the entire posterior chain.', instructions: ['Stand with feet hip-width apart', 'Bend at hips and knees to grip the bar', 'Keep your back straight', 'Stand up with the weight'] },
    { id: '4', name: 'Pull-up', category: 'Back', equipment: 'Bodyweight', description: 'An upper body pulling exercise that builds back and arm strength.', instructions: ['Hang from a pull-up bar with hands wider than shoulders', 'Pull yourself up until your chin is over the bar', 'Lower yourself back down with control'] },
    { id: '5', name: 'Push-up', category: 'Chest', equipment: 'Bodyweight', description: 'A classic bodyweight exercise for building upper body strength.', instructions: ['Start in a plank position', 'Lower your body until your chest nearly touches the ground', 'Push back up to starting position'] },
    { id: '6', name: 'Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell', description: 'An overhead pressing movement that builds shoulder strength and stability.', instructions: ['Hold dumbbells at shoulder height', 'Press weights overhead', 'Lower back to starting position'] },
    { id: '7', name: 'Bicep Curl', category: 'Arms', equipment: 'Dumbbell', description: 'An isolation exercise that targets the biceps muscles.', instructions: ['Hold dumbbells at your sides', 'Curl the weights up toward your shoulders', 'Lower back down with control'] },
    { id: '8', name: 'Tricep Extension', category: 'Arms', equipment: 'Cable', description: 'An isolation exercise for developing the triceps muscles.', instructions: ['Face away from cable machine', 'Push the rope attachment down', 'Keep your upper arms stationary'] },
    { id: '9', name: 'Leg Press', category: 'Legs', equipment: 'Machine', description: 'A machine-based lower body exercise that targets the quadriceps.', instructions: ['Sit in the leg press machine', 'Push the platform away', 'Bend knees to return to start'] },
    { id: '10', name: 'Lat Pulldown', category: 'Back', equipment: 'Cable', description: 'A machine exercise that builds back width and strength.', instructions: ['Grip the bar wider than shoulder width', 'Pull the bar down to your upper chest', 'Control the weight back up'] },
    { id: '11', name: 'Dumbbell Row', category: 'Back', equipment: 'Dumbbell', description: 'A compound exercise that targets the back and arm muscles.', instructions: ['Hold dumbbells at your sides', 'Bend at hips and knees', 'Lift the dumbbells to your sides', 'Lower back down with control'] },
    { id: '12', name: 'Leg Extension', category: 'Legs', equipment: 'Machine', description: 'An isolation exercise that targets the quadriceps muscles.', instructions: ['Sit in the leg extension machine', 'Lift the weight up with your legs', 'Lower back down with control'] },
    { id: '13', name: 'Leg Curl', category: 'Legs', equipment: 'Machine', description: 'An isolation exercise that targets the hamstrings muscles.', instructions: ['Sit in the leg curl machine', 'Lift the weight up with your legs', 'Lower back down with control'] },
    { id: '14', name: 'Calf Raise', category: 'Legs', equipment: 'Machine', description: 'An isolation exercise that targets the calf muscles.', instructions: ['Stand on the calf raise machine', 'Lift the weight up with your calf', 'Lower back down with control'] },
    { id: '15', name: 'Face Pull', category: 'Shoulders', equipment: 'Cable', description: 'An isolation exercise that targets the rear deltoid muscles.', instructions: ['Face away from cable machine', 'Pull the rope attachment toward your face', 'Keep your upper arms stationary'] }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Calculate unique categories from exercises
  const categories = useMemo(() => {
    const uniqueCategories = new Set(exercises.map(exercise => exercise.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, [exercises]);

  // Filter exercises based on search query and category
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
                            exercise.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);

  const value = {
    exercises: filteredExercises,
    loading,
    setLoading,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
