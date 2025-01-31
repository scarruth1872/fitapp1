import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [achievementNotification, setAchievementNotification] = useState(null);
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter(n => !n.read).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const createNotification = async (data) => {
    try {
      if (!currentUser) return;
      
      const notificationsRef = collection(db, 'notifications');
      const newNotification = {
        userId: currentUser.uid,
        ...data,
        read: false,
        createdAt: Timestamp.now()
      };
      
      await addDoc(notificationsRef, newNotification);

      // Show achievement notification if type is achievement
      if (data.type === 'achievement') {
        setAchievementNotification({
          open: true,
          achievement: data.achievement
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          updateDoc(doc(db, 'notifications', notification.id), {
            read: true
          })
        )
      );

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearAchievementNotification = () => {
    setAchievementNotification(null);
  };

  const shareAchievement = async (achievement) => {
    try {
      const socialPost = {
        userId: currentUser.uid,
        type: 'achievement',
        achievement: achievement,
        content: `I just unlocked the ${achievement.name} achievement! 🏆`,
        createdAt: Timestamp.now(),
        likes: [],
        comments: []
      };

      await addDoc(collection(db, 'socialPosts'), socialPost);
    } catch (error) {
      console.error('Error sharing achievement:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    achievementNotification,
    clearAchievementNotification,
    shareAchievement
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
