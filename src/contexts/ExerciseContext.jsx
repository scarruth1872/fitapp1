import { createContext, useContext, useState, useMemo } from 'react';
import { exerciseDatabase } from '../data/trainerData/exerciseDatabase';

const ExerciseContext = createContext();

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract all exercises from the database
  const exercises = useMemo(() => {
    const allExercises = [];
    Object.values(exerciseDatabase.categories).forEach(category => {
      category.exercises.forEach(exercise => {
        allExercises.push({
          ...exercise,
          categoryName: category.name
        });
      });
    });
    return allExercises;
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return ['All', ...Object.values(exerciseDatabase.categories).map(cat => cat.name)];
  }, []);

  // Filter exercises based on search query and category
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exercise.equipment && exercise.equipment.some(eq => 
          eq.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (exercise.primaryMuscles && exercise.primaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (exercise.secondaryMuscles && exercise.secondaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      const matchesCategory = !selectedCategory || 
                            selectedCategory === 'All' || 
                            exercise.categoryName === selectedCategory;

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
