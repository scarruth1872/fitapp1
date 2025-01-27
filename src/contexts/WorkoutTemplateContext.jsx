import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const WorkoutTemplateContext = createContext();

export function useWorkoutTemplate() {
  return useContext(WorkoutTemplateContext);
}

export function WorkoutTemplateProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user's workout templates
  useEffect(() => {
    async function fetchTemplates() {
      if (!currentUser) {
        setTemplates([]);
        setLoading(false);
        return;
      }

      try {
        const templatesRef = collection(db, 'workoutTemplates');
        const q = query(templatesRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const templatesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTemplates(templatesList);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [currentUser]);

  // Create a new template
  const createTemplate = async (templateData) => {
    if (!currentUser) return;

    try {
      const templatesRef = collection(db, 'workoutTemplates');
      const newTemplate = {
        ...templateData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        isPublic: false // Default to private
      };
      
      const docRef = await addDoc(templatesRef, newTemplate);
      setTemplates(prev => [...prev, { id: docRef.id, ...newTemplate }]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  };

  // Delete a template
  const deleteTemplate = async (templateId) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'workoutTemplates', templateId));
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  // Start a workout from a template
  const startWorkoutFromTemplate = async (template) => {
    if (!currentUser) return;

    try {
      const workoutsRef = collection(db, 'workouts');
      const newWorkout = {
        userId: currentUser.uid,
        date: new Date().toISOString(),
        exercises: template.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            ...set,
            completed: false
          }))
        })),
        notes: `Based on template: ${template.name}`,
        templateId: template.id
      };

      const docRef = await addDoc(workoutsRef, newWorkout);
      return docRef.id;
    } catch (error) {
      console.error('Error starting workout from template:', error);
      throw error;
    }
  };

  const value = {
    templates,
    loading,
    createTemplate,
    deleteTemplate,
    startWorkoutFromTemplate
  };

  return (
    <WorkoutTemplateContext.Provider value={value}>
      {children}
    </WorkoutTemplateContext.Provider>
  );
}
