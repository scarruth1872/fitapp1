import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const MotionContainer = motion(Container);
const MotionCard = motion(Card);

const Social = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [openComments, setOpenComments] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const postsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const post = { id: doc.id, ...doc.data() };
        
        // Fetch user data
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', post.userId)
        ));
        const userData = userDoc.docs[0]?.data() || {};
        
        // Fetch comments
        const commentsSnapshot = await getDocs(query(
          collection(db, 'comments'),
          where('postId', '==', doc.id),
          orderBy('timestamp', 'desc')
        ));
        const comments = commentsSnapshot.docs.map(commentDoc => ({
          id: commentDoc.id,
          ...commentDoc.data()
        }));

        return {
          ...post,
          user: userData,
          comments
        };
      }));

      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        content: newPost,
        likes: [],
        timestamp: serverTimestamp(),
      });

      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      const likes = post.likes || [];
      
      if (likes.includes(currentUser.uid)) {
        await updateDoc(postRef, {
          likes: likes.filter(id => id !== currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: [...likes, currentUser.uid]
        });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !selectedPost) return;

    try {
      await addDoc(collection(db, 'comments'), {
        postId: selectedPost.id,
        userId: currentUser.uid,
        content: comment,
        timestamp: serverTimestamp(),
      });

      setComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleOpenComments = (post) => {
    setSelectedPost(post);
    setOpenComments(true);
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
    setOpenComments(false);
    setComment('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ py: 4 }}>
        {/* Create Post */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Share Your Fitness Journey
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
              sx={{ alignSelf: 'flex-end' }}
            >
              Post
            </Button>
          </Box>
        </Paper>

        {/* Posts */}
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={post.user?.photoURL}
                      alt={post.user?.displayName}
                      sx={{ mr: 2 }}
                    >
                      {post.user?.displayName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {post.user?.displayName || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.timestamp?.toDate().toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {post.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleLike(post.id)}
                    startIcon={
                      <FavoriteIcon
                        color={post.likes?.includes(currentUser.uid) ? 'error' : 'inherit'}
                      />
                    }
                  >
                    {post.likes?.length || 0}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleOpenComments(post)}
                    startIcon={<CommentIcon />}
                  >
                    {post.comments?.length || 0}
                  </Button>
                  <Button size="small" startIcon={<ShareIcon />}>
                    Share
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Comments Dialog */}
        <Dialog
          open={openComments}
          onClose={handleCloseComments}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Comments</DialogTitle>
          <DialogContent>
            <List>
              {selectedPost?.comments?.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      {comment.user?.displayName?.[0] || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.user?.displayName || 'Anonymous'}
                    secondary={comment.content}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <IconButton
                color="primary"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseComments}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MotionContainer>
  );
};

export default Social;
