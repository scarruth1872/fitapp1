import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
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
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';

const useWorkoutSocial = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(db, 'workoutPosts'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(postsQuery);
      const postsData = await Promise.all(snapshot.docs.map(async doc => {
        const post = { id: doc.id, ...doc.data() };
        
        // Fetch user data
        const userDoc = await getDocs(doc(db, 'users', post.userId));
        post.user = userDoc.data();
        
        // Fetch program data if it exists
        if (post.programId) {
          const programDoc = await getDocs(doc(db, 'workoutPrograms', post.programId));
          post.program = programDoc.data();
        }
        
        return post;
      }));
      
      setPosts(postsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content, programId = null) => {
    try {
      const postData = {
        userId: currentUser.uid,
        content,
        programId,
        createdAt: serverTimestamp(),
        likes: [],
        likeCount: 0,
        commentCount: 0,
        shareCount: 0
      };
      
      await addDoc(collection(db, 'workoutPosts'), postData);
      await fetchPosts(); // Refresh posts
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'workoutPosts', postId));
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting post:', err);
    }
  };

  const likePost = async (postId) => {
    try {
      const postRef = doc(db, 'workoutPosts', postId);
      const hasLiked = posts.find(p => p.id === postId).likes.includes(currentUser.uid);
      
      await updateDoc(postRef, {
        likes: hasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
        likeCount: increment(hasLiked ? -1 : 1)
      });
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newLikes = hasLiked
            ? post.likes.filter(id => id !== currentUser.uid)
            : [...post.likes, currentUser.uid];
          return {
            ...post,
            likes: newLikes,
            likeCount: hasLiked ? post.likeCount - 1 : post.likeCount + 1
          };
        }
        return post;
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error updating like:', err);
    }
  };

  const addComment = async (postId, content) => {
    try {
      const commentData = {
        postId,
        userId: currentUser.uid,
        content,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'workoutComments'), commentData);
      await updateDoc(doc(db, 'workoutPosts', postId), {
        commentCount: increment(1)
      });
      
      await fetchPosts(); // Refresh posts to show updated comment count
    } catch (err) {
      setError(err.message);
      console.error('Error adding comment:', err);
    }
  };

  const sharePost = async (postId) => {
    try {
      const originalPost = posts.find(p => p.id === postId);
      if (!originalPost) return;

      const shareData = {
        userId: currentUser.uid,
        originalPostId: postId,
        programId: originalPost.programId,
        content: 'Shared this workout program',
        createdAt: serverTimestamp(),
        likes: [],
        likeCount: 0,
        commentCount: 0,
        shareCount: 0
      };
      
      await addDoc(collection(db, 'workoutPosts'), shareData);
      await updateDoc(doc(db, 'workoutPosts', postId), {
        shareCount: increment(1)
      });
      
      await fetchPosts(); // Refresh posts
    } catch (err) {
      setError(err.message);
      console.error('Error sharing post:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    likePost,
    addComment,
    sharePost,
    refreshPosts: fetchPosts
  };
};

export default useWorkoutSocial;
