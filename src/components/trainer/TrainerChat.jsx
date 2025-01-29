import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Chip,
  Stack,
  Button,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as AIIcon,
  SportsGymnastics as WorkoutIcon,
  Restaurant as NutritionIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSnackbar } from '../../contexts/SnackbarContext';

const TrainerChat = ({ suggestions, trainerStatus }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { workouts } = useWorkout();
  const { showSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [quickResponses] = useState([
    { id: 'workout', text: "Create a workout plan", icon: <WorkoutIcon /> },
    { id: 'nutrition', text: "Nutrition advice", icon: <NutritionIcon /> },
    { id: 'progress', text: "View my progress", icon: <InsightsIcon /> }
  ]);

  useEffect(() => {
    loadChatHistory();
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (suggestions?.length > 0) {
      const suggestionMessages = suggestions.map(suggestion => ({
        id: `suggestion-${Date.now()}-${Math.random()}`,
        type: 'trainer',
        content: suggestion.message,
        action: suggestion.action,
        timestamp: new Date()
      }));
      setMessages(prev => [...prev, ...suggestionMessages]);
    }
  }, [suggestions]);

  const loadChatHistory = async () => {
    try {
      const chatRef = collection(db, 'chatMessages');
      const q = query(
        chatRef,
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const chatHistory = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }))
        .reverse();
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      showSnackbar('Error loading chat history. Please try again.', 'error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      userId: currentUser.uid,
      timestamp: new Date()
    };

    try {
      // Add user message to Firestore
      await addDoc(collection(db, 'chatMessages'), {
        ...userMessage,
        timestamp: serverTimestamp()
      });

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Simulate AI trainer response
      setTimeout(async () => {
        const generateTrainerResponse = (userInput) => {
          const lowercaseInput = userInput.toLowerCase();
          
          // Common workout-related keywords
          if (lowercaseInput.includes('workout') || lowercaseInput.includes('exercise')) {
            return "I'd be happy to help you with your workout! Would you like me to create a personalized workout plan based on your goals and fitness level?";
          }
          
          // Nutrition-related keywords
          if (lowercaseInput.includes('diet') || lowercaseInput.includes('nutrition') || lowercaseInput.includes('food')) {
            return "Let's talk about your nutrition goals! I can help you create a balanced meal plan that supports your fitness journey. What specific nutrition advice are you looking for?";
          }
          
          // Progress-related keywords
          if (lowercaseInput.includes('progress') || lowercaseInput.includes('track') || lowercaseInput.includes('improve')) {
            return "I'll help you track your fitness progress! Would you like to see your workout statistics or set new fitness goals?";
          }
          
          // Goals-related keywords
          if (lowercaseInput.includes('goal') || lowercaseInput.includes('target')) {
            return "Setting clear fitness goals is important! Let's discuss your objectives and create a plan to achieve them. What are your main fitness goals?";
          }
          
          // Default response with follow-up question
          return `I understand you're interested in ${userInput.toLowerCase()}. Could you tell me more about your specific needs or goals? This will help me provide better guidance.`;
        };

        const trainerResponse = {
          id: `trainer-${Date.now()}`,
          type: 'trainer',
          content: generateTrainerResponse(input),
          isTrainer: true,
          timestamp: new Date()
        };

        try {
          // Add trainer response to Firestore
          await addDoc(collection(db, 'chatMessages'), {
            ...trainerResponse,
            userId: currentUser.uid,
            timestamp: serverTimestamp()
          });

          setMessages(prev => [...prev, trainerResponse]);
        } catch (error) {
          console.error('Error saving trainer response:', error);
          showSnackbar('Error saving trainer response. Please try again.', 'error');
        }

        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error saving message:', error);
      showSnackbar('Error sending message. Please try again.', 'error');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Messages Container */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <AIIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="primary.main" gutterBottom>
              Welcome to Your Personal AI Trainer!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              I'm here to help you achieve your fitness goals. You can ask me about workouts, nutrition, progress tracking, or anything fitness-related!
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {quickResponses.map((response) => (
                <Chip
                  key={response.id}
                  icon={response.icon}
                  label={response.text}
                  onClick={() => {
                    setInput(response.text);
                    handleSend();
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {message.type === 'trainer' && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 1,
                      width: 32,
                      height: 32
                    }}
                  >
                    <AIIcon />
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.type === 'user' ? 'primary.dark' : 'background.paper',
                    border: 1,
                    borderColor: 'primary.main',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1" color="text.primary">
                    {message.content}
                  </Typography>
                  {message.action && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => console.log('Action:', message.action)}
                    >
                      {message.action}
                    </Button>
                  )}
                </Paper>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Responses */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {quickResponses.map((response) => (
          <Chip
            key={response.id}
            icon={response.icon}
            label={response.text}
            onClick={() => setInput(response.text)}
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          />
        ))}
      </Stack>

      {/* Input Area */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask your AI trainer anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            mr: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
            }
          }}
        >
          {isTyping ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default TrainerChat;
