import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  orderBy,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const SocialContext = createContext();

export function useSocial() {
  return useContext(SocialContext);
}

export function SocialProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const { currentUser } = useAuth();
  const { notifyFollow, notifyLike, notifyComment } = useNotification();

  // Fetch user's social connections
  useEffect(() => {
    async function fetchConnections() {
      if (!currentUser) {
        setFollowing([]);
        setFollowers([]);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFollowing(userData.following || []);
          setFollowers(userData.followers || []);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    }

    fetchConnections();
  }, [currentUser]);

  // Fetch social feed posts
  const fetchPosts = async (isInitial = false) => {
    if (!currentUser) return;

    try {
      const postsRef = collection(db, 'posts');
      let q;

      if (isInitial) {
        q = query(
          postsRef,
          where('userId', 'in', [...following, currentUser.uid]),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        q = query(
          postsRef,
          where('userId', 'in', [...following, currentUser.uid]),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      const newPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (postData) => {
    if (!currentUser) return;

    try {
      const postsRef = collection(db, 'posts');
      const newPost = {
        ...postData,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };
      
      const docRef = await addDoc(postsRef, newPost);
      setPosts(prev => [{id: docRef.id, ...newPost}, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  // Toggle follow/unfollow with notification
  const toggleFollow = async (userId) => {
    if (!currentUser || userId === currentUser.uid) return;

    try {
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const targetUserRef = doc(db, 'users', userId);
      const targetUserDoc = await getDoc(targetUserRef);
      const targetUserName = targetUserDoc.data().displayName;
      
      const isFollowing = following.includes(userId);
      
      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid)
        });
        setFollowing(prev => prev.filter(id => id !== userId));
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid)
        });
        setFollowing(prev => [...prev, userId]);

        // Send follow notification
        await notifyFollow(userId, currentUser.displayName);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  };

  // Toggle like with notification
  const toggleLike = async (postId) => {
    if (!currentUser) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likes = postData.likes || [];
        const isLiked = likes.includes(currentUser.uid);
        
        await updateDoc(postRef, {
          likes: isLiked 
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid)
        });

        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            const newLikes = isLiked
              ? post.likes.filter(id => id !== currentUser.uid)
              : [...post.likes, currentUser.uid];
            return { ...post, likes: newLikes };
          }
          return post;
        }));

        // Send like notification if not already liked
        if (!isLiked && postData.userId !== currentUser.uid) {
          await notifyLike(
            postData.userId,
            postData.userDisplayName,
            postId,
            postData.type
          );
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  // Add comment with notification
  const addComment = async (postId, comment) => {
    if (!currentUser) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const newComment = {
          userId: currentUser.uid,
          userDisplayName: currentUser.displayName,
          userPhotoURL: currentUser.photoURL,
          content: comment,
          createdAt: new Date().toISOString()
        };

        await updateDoc(postRef, {
          comments: arrayUnion(newComment)
        });

        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        }));

        // Send comment notification if not own post
        if (postData.userId !== currentUser.uid) {
          await notifyComment(
            postData.userId,
            postData.userDisplayName,
            postId,
            postData.type
          );
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const value = {
    posts,
    loading,
    following,
    followers,
    fetchPosts,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    toggleFollow
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
}
