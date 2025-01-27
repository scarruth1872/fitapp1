import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FitnessCenter as FitnessCenterIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useSocial } from '../contexts/SocialContext';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const { following, toggleFollow } = useSocial();

  const searchUsers = async (isNewSearch = true) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setLastVisible(null);
      setHasMore(true);
      return;
    }

    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      let q;

      if (isNewSearch) {
        q = query(
          usersRef,
          where('displayName', '>=', searchQuery),
          where('displayName', '<=', searchQuery + '\uf8ff'),
          orderBy('displayName'),
          limit(10)
        );
      } else {
        q = query(
          usersRef,
          where('displayName', '>=', searchQuery),
          where('displayName', '<=', searchQuery + '\uf8ff'),
          orderBy('displayName'),
          startAfter(lastVisible),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.id !== currentUser?.uid); // Exclude current user

      setSearchResults(prev => isNewSearch ? users : [...prev, ...users]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setLastVisible(null);
    setHasMore(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      searchUsers(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <AnimatePresence mode="wait">
        {loading && searchResults.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : searchResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <List>
              {searchResults.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      border: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <Button
                          variant={following.includes(user.id) ? "outlined" : "contained"}
                          onClick={() => toggleFollow(user.id)}
                          size="small"
                        >
                          {following.includes(user.id) ? 'Unfollow' : 'Follow'}
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={user.photoURL} alt={user.displayName}>
                          {user.displayName?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" component="span">
                            {user.displayName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            {user.workoutCount > 0 && (
                              <Chip
                                icon={<FitnessCenterIcon />}
                                label={`${user.workoutCount} workouts`}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            )}
                            {user.achievements?.length > 0 && (
                              <Chip
                                icon={<EmojiEventsIcon />}
                                label={`${user.achievements.length} achievements`}
                                size="small"
                                color="secondary"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                </motion.div>
              ))}
            </List>

            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  Load More
                </Button>
              </Box>
            )}
          </motion.div>
        ) : searchQuery && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No users found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default UserSearch;
