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
  Badge,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { conversationAnalyzer } from '../utils/conversationAnalyzer';
import counselorImage from '../assets/counselor-avatar.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { counselingData } from '../data/counselingData';

// Enhanced animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const typingAnimation = keyframes`
  0% { transform: translateY(0px); }
  28% { transform: translateY(-3px); }
  44% { transform: translateY(0px); }
`;

const fadeInAnimation = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px); 
    filter: blur(2px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
    filter: blur(0);
  }
`;

const slideInAnimation = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Enhanced styled components
const MessageContainer = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  maxWidth: '100%',
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? isUser ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 0, 0.6)'
    : isUser ? theme.palette.primary.light : theme.palette.background.paper,
  border: theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
  boxShadow: theme.palette.mode === 'dark' 
    ? 'none'
    : '0 2px 4px rgba(0,0,0,0.1)',
  color: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.text.primary,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '10px',
    height: '10px',
    transform: 'rotate(45deg)',
    backgroundColor: 'inherit',
    borderTop: theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
    borderLeft: theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
    top: '20px',
    [isUser ? 'right' : 'left']: '-5px',
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : theme.palette.background.paper,
  border: theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
  width: 'fit-content',
  marginBottom: theme.spacing(2),
  animation: `${slideInAnimation} 0.3s ease-out`,
}));

const TypingDot = styled('span')(({ theme, delay }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.main,
  borderRadius: '50%',
  display: 'inline-block',
  animation: `${typingAnimation} 1.4s infinite`,
  animationDelay: delay,
  opacity: theme.palette.mode === 'dark' ? 0.7 : 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    border: theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
    color: theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
    '&.Mui-focused': {
      boxShadow: theme.palette.mode === 'dark'
        ? '0 0 0 2px rgba(0, 255, 0, 0.2)'
        : '0 4px 8px rgba(0,0,0,0.1)',
      transform: 'translateY(-1px)',
    },
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.main,
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.main,
    },
    '& input': {
      color: theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
    },
    '& textarea': {
      color: theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
  },
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.1)' : theme.palette.primary.light,
  color: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.contrastText,
  border: theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.2)' : theme.palette.primary.main,
  },
  margin: '4px',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 1,
  backdropFilter: 'blur(10px)',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : theme.palette.background.paper,
  border: theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  animation: `${fadeInAnimation} 0.5s ease-out`,
  '& .MuiTypography-root': {
    color: theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
  },
  '& .MuiChip-root': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.1)' : theme.palette.primary.light,
    color: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.contrastText,
    border: theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
  },
  '& .MuiButton-root': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.1)' : theme.palette.primary.main,
    color: theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.contrastText,
    border: theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.2)' : theme.palette.primary.dark,
    },
  },
  '&:hover': {
    transform: theme.palette.mode === 'dark' ? 'none' : 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const CounselingAgent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initial greeting with suggested topics
    const initialMessage = {
      text: "Hello! I'm your counseling assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setConversationHistory([{ role: 'assistant', content: initialMessage.text }]);
    setSuggestions([
      'I need someone to talk to',
      'Looking for counseling services',
      'Want to schedule an appointment',
      'Feeling anxious or stressed'
    ]);
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

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSubmit({ preventDefault: () => {} }, suggestion);
  };

  const renderServiceCard = (service) => (
    <ServiceCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {service.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          {service.modalities.map((modality) => (
            <Chip
              key={modality}
              label={modality}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventAvailableIcon />}
            onClick={() => navigate('/schedule')}
          >
            Schedule
          </Button>
          <Typography variant="caption" color="text.secondary">
            {service.durations.join(', ')} min sessions
          </Typography>
        </Box>
      </CardContent>
    </ServiceCard>
  );

  const handleSubmit = async (e, suggestionText = null) => {
    e.preventDefault();
    const messageText = suggestionText || inputValue;
    if ((!messageText.trim() && !suggestionText) || isProcessing) return;

    const userMessage = {
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setIsTyping(true);
    setSuggestions([]);

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

      // Generate contextual suggestions based on the response
      if (response.suggestedServices) {
        const service = counselingData.services.find(s => s.name === response.suggestedServices[0]);
        if (service) {
          setSelectedService(service);
        }
      }

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
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#000' : theme.palette.background.default,
        color: theme => theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.text.primary,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.3)' : 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: 4, // Add top margin to lower the content
        }}
      >
        <Avatar
          src={counselorImage}
          alt="Counselor"
          sx={{
            width: 40,
            height: 40,
            border: theme => theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
            boxShadow: theme => theme.palette.mode === 'dark' ? '0 0 10px rgba(0, 255, 0, 0.3)' : 'none',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: theme => theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textShadow: theme => theme.palette.mode === 'dark' ? '0 0 10px rgba(0, 255, 0, 0.3)' : 'none',
          }}
        >
          Counseling Assistant
        </Typography>
      </Box>

      {/* Messages Section */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 2, // Add top margin
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme => theme.palette.mode === 'dark' ? '#00ff00' : theme.palette.primary.light,
            borderRadius: '4px',
            opacity: theme => theme.palette.mode === 'dark' ? 0.3 : 1,
          },
        }}
      >
        {/* Suggestions Section - Moved to top */}
        {suggestions.length > 0 && !isProcessing && (
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              p: { xs: 2, sm: 3 },
              justifyContent: 'center',
              mb: 3,
            }}
          >
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                size="medium"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: 2.5,
                  px: 2,
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme => theme.palette.mode === 'dark' 
                      ? '0 0 15px rgba(0, 255, 0, 0.3)'
                      : '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              />
            ))}
          </Box>
        )}

        <List sx={{ width: '100%', p: 0 }}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                p: { xs: 1.5, sm: 2 },
                gap: 2,
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: message.isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '85%',
                  width: 'auto',
                }}
              >
                {/* Avatar */}
                <Box sx={{ flexShrink: 0 }}>
                  <Avatar
                    src={message.isUser ? currentUser?.photoURL : counselorImage}
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      border: theme => theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
                    }}
                  >
                    {message.isUser && !currentUser?.photoURL && <PersonIcon />}
                  </Avatar>
                </Box>

                {/* Message Content */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    maxWidth: '100%',
                  }}
                >
                  <MessageContainer 
                    isUser={message.isUser} 
                    elevation={1}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      minWidth: '120px',
                      maxWidth: '100%',
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.text}
                    </Typography>

                    {selectedService && !message.isUser && message.action === 'suggest_service' && (
                      <Box sx={{ mt: 2 }}>
                        <ServiceCard elevation={0}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                              {selectedService.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: 1.6,
                              }}
                            >
                              {selectedService.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              {selectedService.modalities.map((modality) => (
                                <Chip
                                  key={modality}
                                  label={modality}
                                  size="small"
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<EventAvailableIcon />}
                                onClick={() => navigate('/schedule')}
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              >
                                Schedule
                              </Button>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  opacity: 0.7,
                                }}
                              >
                                {selectedService.durations.join(', ')} min sessions
                              </Typography>
                            </Box>
                          </CardContent>
                        </ServiceCard>
                      </Box>
                    )}
                  </MessageContainer>

                  {/* Timestamp */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                      ml: message.isUser ? 0 : 1,
                      mr: message.isUser ? 1 : 0,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <ListItem sx={{ p: { xs: 0.5, sm: 1 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={counselorImage}
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    border: theme => theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
                  }}
                />
                <TypingIndicator>
                  <TypingDot delay="0s" />
                  <TypingDot delay="0.2s" />
                  <TypingDot delay="0.4s" />
                </TypingIndicator>
              </Box>
            </ListItem>
          )}
        </List>

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Section */}
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderTop: 1,
          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.3)' : 'divider',
          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : theme.palette.background.paper,
          mt: 'auto', // Push to bottom
        }}
      >
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {error}
          </Typography>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledTextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isProcessing}
              multiline
              maxRows={4}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  p: { xs: 1.5, sm: 2 },
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'inherit',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.3)' : 'inherit',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.5)' : 'inherit',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme => theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
                  boxShadow: theme => theme.palette.mode === 'dark' ? '0 0 10px rgba(0, 255, 0, 0.2)' : 'none',
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    sx={{
                      p: 1,
                      mr: 0.5,
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.1)' : 'inherit',
                      border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.2)' : 'inherit',
                        transform: 'scale(1.1)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                        backgroundColor: 'transparent',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isProcessing ? (
                      <CircularProgress 
                        size={24}
                        sx={{
                          color: theme => theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
                        }}
                      />
                    ) : (
                      <SendIcon 
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          color: theme => theme.palette.mode === 'dark' ? '#00ff00' : 'inherit',
                          transform: 'rotate(-45deg)',
                        }} 
                      />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CounselingAgent;
