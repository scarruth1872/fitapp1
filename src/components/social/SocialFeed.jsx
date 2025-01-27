import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton, 
  Avatar, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Comment as CommentIcon, 
  Share as ShareIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const SocialFeed = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'social_posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    const postRef = doc(db, 'social_posts', postId);
    const post = posts.find(p => p.id === postId);
    const hasLiked = post.likes?.includes(currentUser.uid);

    await updateDoc(postRef, {
      likes: hasLiked 
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid)
    });
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    const postRef = doc(db, 'social_posts', postId);
    const comment = {
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      text: commentText,
      createdAt: serverTimestamp(),
    };

    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });

    setCommentText('');
    setActiveCommentPost(null);
  };

  const handleShare = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this workout!',
          text: `${post.userName}'s workout: ${post.description}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={post.userAvatar} sx={{ mr: 2 }}>
                {post.userName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {post.userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.createdAt?.toDate().toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {post.description}
            </Typography>

            {post.workoutData && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Workout Details
                </Typography>
                <Typography variant="body2">
                  {JSON.stringify(post.workoutData, null, 2)}
                </Typography>
              </Paper>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <Typography variant="body2">
                {post.likes?.length || 0} likes
              </Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">
                {post.comments?.length || 0} comments
              </Typography>
            </Box>
          </CardContent>

          <Divider />

          <CardActions sx={{ px: 2, py: 1 }}>
            <IconButton 
              onClick={() => handleLike(post.id)}
              color={post.likes?.includes(currentUser.uid) ? 'primary' : 'default'}
            >
              {post.likes?.includes(currentUser.uid) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            
            <IconButton onClick={() => setActiveCommentPost(post.id)}>
              <CommentIcon />
            </IconButton>
            
            <IconButton onClick={() => handleShare(post)}>
              <ShareIcon />
            </IconButton>
          </CardActions>

          {post.comments && post.comments.length > 0 && (
            <List sx={{ px: 2, py: 0 }}>
              {post.comments.map((comment, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={comment.userAvatar}>
                      {comment.userName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.userName}
                    secondary={comment.text}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {activeCommentPost === post.id && (
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <IconButton 
                color="primary"
                onClick={() => handleComment(post.id)}
                disabled={!commentText.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
};

export default SocialFeed;
