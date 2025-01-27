import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  startAfter,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const TemplateContext = createContext();

export function useTemplate() {
  return useContext(TemplateContext);
}

export function TemplateProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [publicTemplates, setPublicTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user's templates
  useEffect(() => {
    async function fetchTemplates() {
      if (!currentUser) {
        setTemplates([]);
        setLoading(false);
        return;
      }

      try {
        const templatesRef = collection(db, 'workoutTemplates');
        const q = query(
          templatesRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

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

  // Fetch public templates
  const fetchPublicTemplates = async (isNewQuery = true) => {
    try {
      setLoading(true);
      const templatesRef = collection(db, 'workoutTemplates');
      let q;

      if (isNewQuery) {
        q = query(
          templatesRef,
          where('isPublic', '==', true),
          orderBy('likes', 'desc'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        q = query(
          templatesRef,
          where('isPublic', '==', true),
          orderBy('likes', 'desc'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      const templatesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPublicTemplates(prev => isNewQuery ? templatesList : [...prev, ...templatesList]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error('Error fetching public templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create template
  const createTemplate = async (templateData) => {
    if (!currentUser) return;

    try {
      const templatesRef = collection(db, 'workoutTemplates');
      const newTemplate = {
        ...templateData,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        likes: [],
        saves: [],
        tags: templateData.tags || []
      };

      const docRef = await addDoc(templatesRef, newTemplate);
      const template = { id: docRef.id, ...newTemplate };
      
      setTemplates(prev => [template, ...prev]);
      return template;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  };

  // Update template
  const updateTemplate = async (templateId, updates) => {
    if (!currentUser) return;

    try {
      const templateRef = doc(db, 'workoutTemplates', templateId);
      const templateDoc = await getDoc(templateRef);

      if (!templateDoc.exists() || templateDoc.data().userId !== currentUser.uid) {
        throw new Error('Template not found or unauthorized');
      }

      const updatedTemplate = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(templateRef, updatedTemplate);

      setTemplates(prev =>
        prev.map(template =>
          template.id === templateId
            ? { ...template, ...updatedTemplate }
            : template
        )
      );

      if (templateDoc.data().isPublic) {
        setPublicTemplates(prev =>
          prev.map(template =>
            template.id === templateId
              ? { ...template, ...updatedTemplate }
              : template
          )
        );
      }
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  // Delete template
  const deleteTemplate = async (templateId) => {
    if (!currentUser) return;

    try {
      const templateRef = doc(db, 'workoutTemplates', templateId);
      const templateDoc = await getDoc(templateRef);

      if (!templateDoc.exists() || templateDoc.data().userId !== currentUser.uid) {
        throw new Error('Template not found or unauthorized');
      }

      await deleteDoc(templateRef);

      setTemplates(prev =>
        prev.filter(template => template.id !== templateId)
      );

      if (templateDoc.data().isPublic) {
        setPublicTemplates(prev =>
          prev.filter(template => template.id !== templateId)
        );
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  // Toggle template publicity
  const togglePublic = async (templateId) => {
    if (!currentUser) return;

    try {
      const templateRef = doc(db, 'workoutTemplates', templateId);
      const templateDoc = await getDoc(templateRef);

      if (!templateDoc.exists() || templateDoc.data().userId !== currentUser.uid) {
        throw new Error('Template not found or unauthorized');
      }

      const isPublic = !templateDoc.data().isPublic;
      await updateDoc(templateRef, { isPublic });

      setTemplates(prev =>
        prev.map(template =>
          template.id === templateId
            ? { ...template, isPublic }
            : template
        )
      );

      if (isPublic) {
        setPublicTemplates(prev => [
          { ...templateDoc.data(), id: templateId, isPublic },
          ...prev
        ]);
      } else {
        setPublicTemplates(prev =>
          prev.filter(template => template.id !== templateId)
        );
      }
    } catch (error) {
      console.error('Error toggling template publicity:', error);
      throw error;
    }
  };

  // Like template
  const toggleLike = async (templateId) => {
    if (!currentUser) return;

    try {
      const templateRef = doc(db, 'workoutTemplates', templateId);
      const templateDoc = await getDoc(templateRef);

      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }

      const likes = templateDoc.data().likes || [];
      const isLiked = likes.includes(currentUser.uid);

      await updateDoc(templateRef, {
        likes: isLiked
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid)
      });

      const updateTemplateList = (list) =>
        list.map(template =>
          template.id === templateId
            ? {
                ...template,
                likes: isLiked
                  ? template.likes.filter(id => id !== currentUser.uid)
                  : [...template.likes, currentUser.uid]
              }
            : template
        );

      setTemplates(updateTemplateList);
      setPublicTemplates(updateTemplateList);
    } catch (error) {
      console.error('Error toggling template like:', error);
      throw error;
    }
  };

  // Save template
  const toggleSave = async (templateId) => {
    if (!currentUser) return;

    try {
      const templateRef = doc(db, 'workoutTemplates', templateId);
      const templateDoc = await getDoc(templateRef);

      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }

      const saves = templateDoc.data().saves || [];
      const isSaved = saves.includes(currentUser.uid);

      await updateDoc(templateRef, {
        saves: isSaved
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid)
      });

      const updateTemplateList = (list) =>
        list.map(template =>
          template.id === templateId
            ? {
                ...template,
                saves: isSaved
                  ? template.saves.filter(id => id !== currentUser.uid)
                  : [...template.saves, currentUser.uid]
              }
            : template
        );

      setTemplates(updateTemplateList);
      setPublicTemplates(updateTemplateList);
    } catch (error) {
      console.error('Error toggling template save:', error);
      throw error;
    }
  };

  const value = {
    templates,
    publicTemplates,
    loading,
    hasMore,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    togglePublic,
    toggleLike,
    toggleSave,
    fetchPublicTemplates
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}
