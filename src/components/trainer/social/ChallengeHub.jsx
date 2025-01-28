import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Badge,
  Tooltip,
  AvatarGroup
} from '@mui/material';
import {
  Add as AddIcon,
  EmojiEvents,
  Group as GroupIcon,
  Share as ShareIcon,
  WhatshotRounded,
  CheckCircle,
  Timer
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';

const ChallengeHub = () => {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'workout',
    goal: '',
    duration: 7,
    privacy: 'public'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [currentUser]);

  const fetchChallenges = async () => {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(
        challengesRef,
        where('endDate', '>=', new Date()),
        orderBy('endDate'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const challengeData = [];
      
      querySnapshot.forEach((doc) => {
        challengeData.push({ id: doc.id, ...doc.data() });
      });

      setChallenges(challengeData);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + newChallenge.duration);

      const challengeData = {
        ...newChallenge,
        createdBy: currentUser.uid,
        startDate,
        endDate,
        participants: [
          {
            userId: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            progress: 0,
            joined: new Date()
          }
        ],
        status: 'active'
      };

      await addDoc(collection(db, 'challenges'), challengeData);
      setOpenCreate(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleJoinChallenge = async (challenge) => {
    try {
      const participant = {
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        progress: 0,
        joined: new Date()
      };

      await updateDoc(doc(db, 'challenges', challenge.id), {
        participants: [...challenge.participants, participant]
      });

      fetchChallenges();
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const calculateProgress = (challenge) => {
    const participant = challenge.participants.find(p => p.userId === currentUser.uid);
    return participant ? participant.progress : 0;
  };

  const getStatusColor = (challenge) => {
    const daysLeft = Math.ceil((challenge.endDate.toDate() - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) return 'error';
    if (daysLeft <= 3) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Fitness Challenges
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create Challenge
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {challenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEvents
                          color="primary"
                          sx={{ mr: 1, fontSize: 28 }}
                        />
                        <Typography variant="h6" component="div">
                          {challenge.title}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {challenge.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          icon={<WhatshotRounded />}
                          label={`Goal: ${challenge.goal}`}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          icon={<Timer />}
                          label={`${challenge.duration} days`}
                          size="small"
                          color={getStatusColor(challenge)}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(challenge)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AvatarGroup max={4}>
                          {challenge.participants.map((participant) => (
                            <Tooltip
                              key={participant.userId}
                              title={participant.displayName}
                            >
                              <Avatar
                                src={participant.photoURL}
                                alt={participant.displayName}
                              />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {challenge.participants.length} participants
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions>
                      {challenge.participants.some(p => p.userId === currentUser.uid) ? (
                        <Button
                          startIcon={<CheckCircle />}
                          disabled
                          fullWidth
                        >
                          Joined
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<GroupIcon />}
                          onClick={() => handleJoinChallenge(challenge)}
                          fullWidth
                        >
                          Join Challenge
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Create Challenge Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Challenge</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newChallenge.title}
            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={newChallenge.description}
            onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Challenge Type"
            value={newChallenge.type}
            onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="workout">Workout</MenuItem>
            <MenuItem value="steps">Steps</MenuItem>
            <MenuItem value="weight">Weight Loss</MenuItem>
            <MenuItem value="strength">Strength</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Goal"
            value={newChallenge.goal}
            onChange={(e) => setNewChallenge({ ...newChallenge, goal: e.target.value })}
            sx={{ mt: 2 }}
            placeholder="e.g., Complete 20 workouts"
          />
          <TextField
            select
            fullWidth
            label="Duration (days)"
            value={newChallenge.duration}
            onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={14}>14 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={60}>60 days</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Privacy"
            value={newChallenge.privacy}
            onChange={(e) => setNewChallenge({ ...newChallenge, privacy: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private (Invite Only)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateChallenge}
            disabled={!newChallenge.title || !newChallenge.goal}
          >
            Create Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChallengeHub;
