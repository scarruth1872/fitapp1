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
  Button
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { conversationAnalyzer } from '../utils/conversationAnalyzer';
import counselorImage from '../assets/counselor-avatar.svg';
import { useNavigate } from 'react-router-dom';

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

const MessageContainer = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isUser'
})(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  maxWidth: '70%',
  wordBreak: 'break-word',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '0',
    borderStyle: 'solid',
    ...(isUser ? {
      borderWidth: '8px 0 8px 12px',
      borderColor: `transparent transparent transparent ${theme.palette.primary.light}`,
      right: '-12px',
      top: '20px'
    } : {
      borderWidth: '8px 12px 8px 0',
      borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      left: '-12px',
      top: '20px'
    })
  },
  '& pre': {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 0)
  },
  '& code': {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5)
  },
  '& ul, & ol': {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  '& li': {
    marginBottom: theme.spacing(0.5)
  }
}));

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: prop => prop !== 'isUser' && prop !== 'isTyping'
})(({ theme, isUser, isTyping }) => ({
  backgroundColor: isUser ? theme.palette.secondary.main : theme.palette.primary.main,
  marginRight: isUser ? 0 : theme.spacing(2),
  marginLeft: isUser ? theme.spacing(2) : 0,
  width: 40,
  height: 40,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: `2px solid ${theme.palette.background.paper}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: isTyping ? `${pulseAnimation} 2s infinite` : 'none',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  }
}));

const MessageWrapper = styled(Box, {
  shouldForwardProp: prop => prop !== 'isUser'
})(({ theme, isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
  opacity: 0,
  animation: 'fadeIn 0.5s ease forwards',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
}));

const TypingDot = styled('span')(({ theme, delay }) => ({
  width: 6,
  height: 6,
  backgroundColor: theme.palette.text.primary,
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 2px',
  animation: `${typingAnimation} 1.4s infinite`,
  animationDelay: `${delay}ms`
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  zIndex: 1,
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease',
  transform: 'translateY(0)',
  '&:focus-within': {
    transform: 'translateY(-2px)',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
    }
  }
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05) rotate(10deg)'
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled
  }
}));

const CounselingAgent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initContext = async () => {
      try {
        const newContext = await conversationAnalyzer.createContext();
        setContext(newContext);
        // Add welcome message
        setMessages([{
          text: "Hello! I'm your counseling assistant. How can I help you today?",
          sender: 'agent'
        }]);
      } catch (error) {
        console.error('Error initializing context:', error);
      }
    };
    initContext();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !context) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsTyping(true);

    // Add user message immediately
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      // Get response from conversation analyzer
      const response = await conversationAnalyzer.analyzeMessage(userMessage, context);
      
      // Add agent response after a small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [...prev, { text: response, sender: 'agent' }]);
        setIsTyping(false);
      }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
    } catch (error) {
      console.error('Error getting response:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I apologize, but I encountered an issue. Please try again.",
          sender: 'agent'
        }]);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSchedulingRequest = () => {
    navigate('/schedule');
  };

  const renderMessageText = (text) => {
    if (text.includes('[Schedule Appointment]')) {
      return (
        <Box>
          <Typography variant="body1" component="div" gutterBottom>
            {text.replace('[Schedule Appointment]', '')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSchedulingRequest}
            sx={{ mt: 1 }}
          >
            Schedule Appointment
          </Button>
        </Box>
      );
    }
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <Typography 
        key={i} 
        component="p" 
        sx={{ 
          mb: 1,
          '&:last-child': { mb: 0 },
          lineHeight: 1.6
        }}
      >
        {line || ' '}
      </Typography>
    ));
  };

  return (
    <Container maxWidth="md" sx={{ 
      mt: 4, 
      mb: 4, 
      height: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
      }
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        p: 2,
        backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%), linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px'
      }}>
        <List>
          {messages.map((message, index) => (
            <Fade in={true} key={index} timeout={500}>
              <ListItem sx={{ p: 1 }}>
                <MessageWrapper isUser={message.sender === 'user'}>
                  {message.sender === 'agent' && (
                    <Tooltip title="Counseling Assistant" arrow TransitionComponent={Zoom}>
                      <StyledAvatar 
                        isUser={false}
                        src={counselorImage}
                      >
                        Ra
                      </StyledAvatar>
                    </Tooltip>
                  )}
                  <MessageContainer isUser={message.sender === 'user'}>
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ 
                        '& p': { mb: 1 },
                        '& p:last-child': { mb: 0 }
                      }}
                    >
                      {renderMessageText(message.text)}
                    </Typography>
                  </MessageContainer>
                  {message.sender === 'user' && (
                    <Tooltip title="You" arrow TransitionComponent={Zoom}>
                      <StyledAvatar isUser={true}>You</StyledAvatar>
                    </Tooltip>
                  )}
                </MessageWrapper>
              </ListItem>
            </Fade>
          ))}
          {isTyping && (
            <Fade in={true}>
              <ListItem sx={{ p: 1 }}>
                <MessageWrapper isUser={false}>
                  <Tooltip title="Counseling Assistant" arrow TransitionComponent={Zoom}>
                    <StyledAvatar isUser={false} src={counselorImage} isTyping>Ra</StyledAvatar>
                  </Tooltip>
                  <MessageContainer isUser={false}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TypingDot delay={0} />
                      <TypingDot delay={200} />
                      <TypingDot delay={400} />
                    </Box>
                  </MessageContainer>
                </MessageWrapper>
              </ListItem>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <InputContainer>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          disabled={isTyping || !context}
        />
        <Tooltip title="Send message" arrow TransitionComponent={Zoom}>
          <span>
            <StyledSendButton 
              onClick={handleSendMessage} 
              disabled={isTyping || !inputText.trim() || !context}
              aria-label="Send message"
            >
              <SendIcon />
            </StyledSendButton>
          </span>
        </Tooltip>
      </InputContainer>
    </Container>
  );
};

export default CounselingAgent;
