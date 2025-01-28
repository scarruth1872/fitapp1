import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useAchievements } from '../hooks/useAchievements';

const WorkoutProgramContext = createContext();

export const useWorkoutProgram = () => {
  return useContext(WorkoutProgramContext);
};

export const WorkoutProgramProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { updateAchievementProgress } = useAchievements();
  const [programs, setPrograms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's workout programs
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!currentUser) {
        setPrograms([]);
        setTemplates([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch user's programs
        const userProgramsQuery = query(
          collection(db, 'workoutPrograms'),
          where('userId', '==', currentUser.uid)
        );
        const userProgramsSnapshot = await getDocs(userProgramsQuery);
        const userPrograms = userProgramsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch public templates
        const templatesQuery = query(
          collection(db, 'workoutPrograms'),
          where('isTemplate', '==', true),
          where('isPublic', '==', true)
        );
        const templatesSnapshot = await getDocs(templatesQuery);
        const publicTemplates = templatesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPrograms(userPrograms);
        setTemplates(publicTemplates);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workout programs:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [currentUser]);

  // Create a new workout program
  const createProgram = async (programData) => {
    try {
      const newProgram = {
        ...programData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isTemplate: false,
        isPublic: false
      };

      const docRef = await addDoc(collection(db, 'workoutPrograms'), newProgram);
      const createdProgram = { id: docRef.id, ...newProgram };
      setPrograms(prev => [...prev, createdProgram]);
      return createdProgram;
    } catch (err) {
      console.error('Error creating workout program:', err);
      throw err;
    }
  };

  // Update an existing program
  const updateProgram = async (programId, updates) => {
    try {
      const programRef = doc(db, 'workoutPrograms', programId);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(programRef, updatedData);
      setPrograms(prev => prev.map(program => 
        program.id === programId ? { ...program, ...updatedData } : program
      ));
    } catch (err) {
      console.error('Error updating workout program:', err);
      throw err;
    }
  };

  // Delete a program
  const deleteProgram = async (programId) => {
    try {
      await deleteDoc(doc(db, 'workoutPrograms', programId));
      setPrograms(prev => prev.filter(program => program.id !== programId));
    } catch (err) {
      console.error('Error deleting workout program:', err);
      throw err;
    }
  };

  // Share a program as a template
  const shareAsTemplate = async (programId) => {
    try {
      const program = programs.find(p => p.id === programId);
      if (!program) throw new Error('Program not found');

      const templateData = {
        ...program,
        isTemplate: true,
        isPublic: true,
        originalAuthorId: currentUser.uid,
        sharedAt: new Date().toISOString()
      };
      delete templateData.id;

      const docRef = await addDoc(collection(db, 'workoutPrograms'), templateData);
      const createdTemplate = { id: docRef.id, ...templateData };
      setTemplates(prev => [...prev, createdTemplate]);
      return createdTemplate;
    } catch (err) {
      console.error('Error sharing program as template:', err);
      throw err;
    }
  };

  // Use a template to create a new program
  const useTemplate = async (templateId) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const programData = {
        ...template,
        userId: currentUser.uid,
        isTemplate: false,
        isPublic: false,
        originalTemplateId: templateId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      delete programData.id;

      const docRef = await addDoc(collection(db, 'workoutPrograms'), programData);
      const createdProgram = { id: docRef.id, ...programData };
      setPrograms(prev => [...prev, createdProgram]);
      return createdProgram;
    } catch (err) {
      console.error('Error using template:', err);
      throw err;
    }
  };

  const completeProgram = async (programId) => {
    try {
      const programRef = doc(db, 'workoutPrograms', programId);
      await updateDoc(programRef, {
        completed: true,
        completedAt: serverTimestamp()
      });

      // Update achievements
      await updateAchievementProgress('program_completions');

      // Refresh programs
      fetchPrograms();
    } catch (error) {
      console.error('Error completing program:', error);
      throw error;
    }
  };

  const shareProgram = async (programId) => {
    try {
      const programRef = doc(db, 'workoutPrograms', programId);
      await updateDoc(programRef, {
        shared: true,
        shareCount: increment(1)
      });

      // Update achievements
      await updateAchievementProgress('social_shares');

      // Refresh programs
      fetchPrograms();
    } catch (error) {
      console.error('Error sharing program:', error);
      throw error;
    }
  };

  const value = {
    programs,
    templates,
    loading,
    error,
    createProgram,
    updateProgram,
    deleteProgram,
    shareAsTemplate,
    useTemplate,
    completeProgram,
    shareProgram
  };

  return (
    <WorkoutProgramContext.Provider value={value}>
      {children}
    </WorkoutProgramContext.Provider>
  );
};
