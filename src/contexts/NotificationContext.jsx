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
  const { currentUser } = useAuth();

  // Listen for new notifications
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

  // Create a new notification
  const createNotification = async (userId, data) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const newNotification = {
        userId,
        ...data,
        read: false,
        createdAt: Timestamp.now()
      };
      
      await addDoc(notificationsRef, newNotification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Mark notification as read
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

  // Mark all notifications as read
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

  // Create follow notification
  const notifyFollow = async (followerId, followerName) => {
    await createNotification(currentUser.uid, {
      type: 'follow',
      followerId,
      followerName,
      message: `${followerName} started following you`
    });
  };

  // Create like notification
  const notifyLike = async (userId, userName, postId, postType) => {
    await createNotification(userId, {
      type: 'like',
      likerId: currentUser.uid,
      likerName: currentUser.displayName,
      postId,
      postType,
      message: `${currentUser.displayName} liked your ${postType}`
    });
  };

  // Create comment notification
  const notifyComment = async (userId, userName, postId, postType) => {
    await createNotification(userId, {
      type: 'comment',
      commenterId: currentUser.uid,
      commenterName: currentUser.displayName,
      postId,
      postType,
      message: `${currentUser.displayName} commented on your ${postType}`
    });
  };

  // Create workout share notification
  const notifyWorkoutShare = async (followers) => {
    await Promise.all(
      followers.map(followerId =>
        createNotification(followerId, {
          type: 'workout_share',
          sharerId: currentUser.uid,
          sharerName: currentUser.displayName,
          message: `${currentUser.displayName} shared a new workout`
        })
      )
    );
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    notifyFollow,
    notifyLike,
    notifyComment,
    notifyWorkoutShare
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
