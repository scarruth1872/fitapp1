import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Divider,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';

const FriendSystem = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to friends list
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribeFriends = onSnapshot(userRef, (doc) => {
      const userData = doc.data();
      setFriends(userData?.friends || []);
      setPendingRequests(userData?.pendingRequests || []);
    });

    return () => unsubscribeFriends();
  }, [currentUser]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', searchQuery),
      where('displayName', '<=', searchQuery + '\uf8ff')
    );

    const snapshot = await getDocs(q);
    const results = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUser.uid);
    
    setSearchResults(results);
  };

  const handleSendRequest = async (userId) => {
    const targetUserRef = doc(db, 'users', userId);
    await updateDoc(targetUserRef, {
      pendingRequests: arrayUnion({
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        timestamp: new Date(),
      })
    });
  };

  const handleAcceptRequest = async (request) => {
    const userRef = doc(db, 'users', currentUser.uid);
    const requesterRef = doc(db, 'users', request.userId);

    // Add to friends lists
    await updateDoc(userRef, {
      friends: arrayUnion({
        userId: request.userId,
        displayName: request.displayName,
        photoURL: request.photoURL,
      }),
      pendingRequests: arrayRemove(request)
    });

    await updateDoc(requesterRef, {
      friends: arrayUnion({
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      })
    });
  };

  const handleRejectRequest = async (request) => {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      pendingRequests: arrayRemove(request)
    });
  };

  const handleUnfriend = async (friend) => {
    const userRef = doc(db, 'users', currentUser.uid);
    const friendRef = doc(db, 'users', friend.userId);

    await updateDoc(userRef, {
      friends: arrayRemove(friend)
    });

    await updateDoc(friendRef, {
      friends: arrayRemove({
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      })
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Friends" />
          <Tab label="Requests" />
          <Tab label="Find Friends" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <List>
          {friends.map((friend) => (
            <ListItem key={friend.userId}>
              <ListItemAvatar>
                <Avatar src={friend.photoURL}>
                  {friend.displayName?.[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={friend.displayName}
                secondary="Friend"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleUnfriend(friend)}
                >
                  Unfriend
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {friends.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No friends yet. Start by finding some friends!
            </Typography>
          )}
        </List>
      )}

      {activeTab === 1 && (
        <List>
          {pendingRequests.map((request) => (
            <ListItem key={request.userId}>
              <ListItemAvatar>
                <Avatar src={request.photoURL}>
                  {request.displayName?.[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={request.displayName}
                secondary="Sent you a friend request"
              />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  onClick={() => handleAcceptRequest(request)}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleRejectRequest(request)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {pendingRequests.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No pending friend requests
            </Typography>
          )}
        </List>
      )}

      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>

          <List>
            {searchResults.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar src={user.photoURL}>
                    {user.displayName?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.displayName}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    color="primary"
                    onClick={() => handleSendRequest(user.id)}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FriendSystem;
