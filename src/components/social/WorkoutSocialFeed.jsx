import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Chip,
  Divider,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  MoreVert,
  FitnessCenter,
  Timer,
  CalendarToday
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
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
  arrayRemove
} from 'firebase/firestore';

const WorkoutSocialFeed = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentDialog, setCommentDialog] = useState({ open: false, postId: null });
  const [shareDialog, setShareDialog] = useState({ open: false, post: null });
  const [comment, setComment] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, 'social_posts'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(postsQuery);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(postsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, 'social_posts', postId);
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
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      const commentData = {
        postId: commentDialog.postId,
        userId: currentUser.uid,
        content: comment,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'workoutComments'), commentData);
      await updateDoc(doc(db, 'social_posts', commentDialog.postId), {
        commentCount: increment(1)
      });
      
      setComment('');
      setCommentDialog({ open: false, postId: null });
      fetchPosts(); // Refresh posts to show new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    try {
      const { post } = shareDialog;
      const shareData = {
        userId: currentUser.uid,
        originalPostId: post.id,
        content: 'Shared this workout program',
        createdAt: new Date().toISOString(),
        likes: [],
        likeCount: 0,
        commentCount: 0,
        shareCount: 0
      };
      
      await addDoc(collection(db, 'social_posts'), shareData);
      await updateDoc(doc(db, 'social_posts', post.id), {
        shareCount: increment(1)
      });
      
      setShareDialog({ open: false, post: null });
      fetchPosts(); // Refresh posts to show new share
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDoc(doc(db, 'social_posts', selectedPost.id));
      setPosts(prev => prev.filter(post => post.id !== selectedPost.id));
      setMenuAnchor(null);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const renderPost = (post) => (
    <Card key={post.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar src={post.user?.photoURL} sx={{ mr: 1 }}>
              {post.user?.displayName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {post.user?.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Box>
          {post.userId === currentUser.uid && (
            <IconButton
              onClick={(e) => {
                setMenuAnchor(e.currentTarget);
                setSelectedPost(post);
              }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>

        {post.program && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {post.program.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {post.program.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<FitnessCenter />}
                label={post.program.difficulty}
                size="small"
              />
              <Chip
                icon={<Timer />}
                label={`${post.program.duration} weeks`}
                size="small"
              />
              <Chip
                icon={<CalendarToday />}
                label={`${post.program.workouts.length} workouts`}
                size="small"
              />
            </Box>
          </Paper>
        )}
      </CardContent>

      <Divider />

      <CardActions>
        <IconButton
          onClick={() => handleLike(post.id)}
          color={post.likes.includes(currentUser.uid) ? 'primary' : 'default'}
        >
          {post.likes.includes(currentUser.uid) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.likeCount}
        </Typography>

        <IconButton onClick={() => setCommentDialog({ open: true, postId: post.id })}>
          <Comment />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.commentCount}
        </Typography>

        <IconButton onClick={() => setShareDialog({ open: true, post })}>
          <Share />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.shareCount}
        </Typography>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Workout Community
      </Typography>

      {posts.map(renderPost)}

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog.open}
        onClose={() => setCommentDialog({ open: false, postId: null })}
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your comment"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog({ open: false, postId: null })}>
            Cancel
          </Button>
          <Button onClick={handleComment} variant="contained">
            Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog.open}
        onClose={() => setShareDialog({ open: false, post: null })}
      >
        <DialogTitle>Share Workout Program</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to share this workout program with your followers?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog({ open: false, post: null })}>
            Cancel
          </Button>
          <Button onClick={handleShare} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedPost(null);
        }}
      >
        <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
      </Menu>
    </Box>
  );
};

export default WorkoutSocialFeed;
