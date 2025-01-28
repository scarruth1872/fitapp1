import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  FitnessCenter,
  Assistant
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalTrainerAgent from '../../agents/PersonalTrainerAgent';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const TrainerChat = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [trainerAgent, setTrainerAgent] = useState(null);
  const theme = useTheme();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (currentUser?.uid) {
      const agent = new PersonalTrainerAgent({
        uid: currentUser.uid,
        fitnessLevel: currentUser.fitnessLevel || 'beginner',
        preferences: currentUser.preferences || {}
      });
      setTrainerAgent(agent);

      const messagesRef = collection(db, 'users', currentUser.uid, 'trainerMessages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
        scrollToBottom();
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !trainerAgent) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      const messagesRef = collection(db, 'users', currentUser.uid, 'trainerMessages');
      await addDoc(messagesRef, {
        content: userMessage,
        sender: 'user',
        timestamp: serverTimestamp()
      });

      const response = await trainerAgent.processMessage(userMessage);

      await addDoc(messagesRef, {
        content: response,
        sender: 'trainer',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const messagesRef = collection(db, 'users', currentUser.uid, 'trainerMessages');
      await addDoc(messagesRef, {
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'trainer',
        timestamp: serverTimestamp()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      <Paper 
        elevation={0}
        ref={chatContainerRef}
        sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 2,
          backgroundColor: 'transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          },
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {message.sender === 'trainer' && (
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    <Assistant />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.background.paper,
                    color: message.sender === 'user'
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                    fontFamily: theme.typography.fontFamily
                  }}
                >
                  <Typography 
                    variant="body1"
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit'
                    }}
                  >
                    {message.content}
                  </Typography>
                </Paper>
                {message.sender === 'user' && (
                  <Avatar 
                    sx={{ 
                      ml: 1, 
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText
                    }}
                  >
                    {currentUser.email[0].toUpperCase()}
                  </Avatar>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.primary.main}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask your trainer anything..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                color: theme.palette.text.primary,
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputBase-input': {
                fontFamily: theme.typography.fontFamily,
              }
            }}
          />
          <IconButton 
            type="submit" 
            color="primary" 
            disabled={loading || !newMessage.trim()}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              '&.Mui-disabled': {
                bgcolor: theme.palette.action.disabledBackground,
              }
            }}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{ color: theme.palette.primary.contrastText }} 
              />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default TrainerChat;
