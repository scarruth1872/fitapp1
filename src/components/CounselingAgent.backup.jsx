import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  List, 
  ListItem,
  Avatar,
  Fade,
  CircularProgress,
  useTheme,
  Tooltip,
  Zoom,
  Button,
  Badge
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import { conversationAnalyzer } from '../utils/conversationAnalyzer';
import counselorImage from '../assets/counselor-avatar.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Keyframe animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const typingAnimation = keyframes`
  0% { transform: translateY(0px); }
  28% { transform: translateY(-3px); }
  44% { transform: translateY(0px); }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessageContainer = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isUser'
})(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  maxWidth: '70%',
  wordBreak: 'break-word',
  position: 'relative',
  animation: `${fadeInAnimation} 0.3s ease-out`,
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    ...(isUser ? {
      borderWidth: '8px 0 8px 8px',
      borderColor: `transparent transparent transparent ${theme.palette.primary.light}`,
      right: '-8px',
    } : {
      borderWidth: '8px 8px 8px 0',
      borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      left: '-8px',
    }),
    top: '50%',
    transform: 'translateY(-50%)',
  }
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: 'fit-content',
  marginBottom: theme.spacing(2),
}));

const TypingDot = styled('span')(({ theme, delay }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'inline-block',
  animation: `${typingAnimation} 1.4s infinite`,
  animationDelay: delay,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    '& fieldset': {
      borderWidth: '2px',
    },
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 1,
}));

const CounselingAgent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initial greeting
    const initialMessage = {
      text: "Hello! I'm your counseling assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setConversationHistory([{ role: 'assistant', content: initialMessage.text }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setIsTyping(true);

    try {
      const updatedHistory = [...conversationHistory, { role: 'user', content: userMessage.text }];
      setConversationHistory(updatedHistory);

      const response = await conversationAnalyzer.generateResponse(userMessage.text, updatedHistory);
      
      const agentMessage = {
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        action: response.action,
      };

      setMessages(prev => [...prev, agentMessage]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response.message }]);

      if (response.action === 'schedule') {
        setTimeout(() => {
          navigate('/schedule');
        }, 1500);
      }
    } catch (err) {
      setError('I apologize, but I encountered an error. Please try again.');
      console.error('Error processing message:', err);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 2, pb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Fade in timeout={500}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  {!message.isUser && (
                    <Avatar
                      src={counselorImage}
                      alt="Counselor"
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 1,
                        animation: message.isUser ? 'none' : `${pulseAnimation} 2s infinite`,
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: message.isUser ? 'flex-end' : 'flex-start' }}>
                    <MessageContainer isUser={message.isUser}>
                      <Typography variant="body1">{message.text}</Typography>
                    </MessageContainer>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mx: 1 }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {message.isUser && (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        ml: 1,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="User" style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                  )}
                </Box>
              </Fade>
            </ListItem>
          ))}
          {isTyping && (
            <ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={counselorImage}
                  alt="Counselor"
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <TypingIndicator>
                  <TypingDot delay="0s" />
                  <TypingDot delay="0.2s" />
                  <TypingDot delay="0.4s" />
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                </TypingIndicator>
              </Box>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      
      <InputContainer>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <StyledTextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isProcessing}
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Send message" arrow TransitionComponent={Zoom}>
                    <span>
                      <IconButton
                        color="primary"
                        type="submit"
                        disabled={!inputValue.trim() || isProcessing}
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        {isProcessing ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                ),
              }}
            />
          </Box>
        </form>
      </InputContainer>
    </Container>
  );
};

export default CounselingAgent;
