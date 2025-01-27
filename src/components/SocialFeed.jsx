import { useState, useEffect } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocial } from '../contexts/SocialContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const SocialFeed = () => {
  const { 
    posts, 
    loading, 
    fetchPosts, 
    createPost, 
    deletePost, 
    toggleLike, 
    addComment 
  } = useSocial();
  const { currentUser } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      await createPost({
        content: newPost,
        type: 'status'
      });
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !selectedPost) return;

    try {
      await addComment(selectedPost.id, comment);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
      {/* Create Post */}
      <Card sx={{ mb: 3, backgroundColor: 'background.paper' }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your fitness journey..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
          >
            Post
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, y: -20 }}
              >
                <Card sx={{ mb: 2, backgroundColor: 'background.paper' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={post.userPhotoURL}
                        sx={{ mr: 2 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {post.userDisplayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {post.content}
                    </Typography>

                    {post.type === 'workout' && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`${post.workout.exercises.length} exercises`}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={post.workout.duration}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions disableSpacing>
                    <IconButton
                      onClick={() => handleLike(post.id)}
                      color={post.likes.includes(currentUser?.uid) ? 'primary' : 'default'}
                    >
                      {post.likes.includes(currentUser?.uid) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Typography variant="caption" sx={{ mr: 2 }}>
                      {post.likes.length}
                    </Typography>

                    <IconButton onClick={() => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}>
                      <CommentIcon />
                    </IconButton>
                    <Typography variant="caption" sx={{ mr: 2 }}>
                      {post.comments.length}
                    </Typography>

                    <IconButton>
                      <ShareIcon />
                    </IconButton>

                    {post.userId === currentUser?.uid && (
                      <IconButton
                        onClick={() => handleDeletePost(post.id)}
                        sx={{ ml: 'auto' }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Comments Dialog */}
      <Dialog
        open={showComments}
        onClose={() => {
          setShowComments(false);
          setSelectedPost(null);
          setComment('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <List>
            {selectedPost?.comments.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={comment.userPhotoURL}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.userDisplayName}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleComment}
              disabled={!comment.trim()}
            >
              Post
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowComments(false);
            setSelectedPost(null);
            setComment('');
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialFeed;
