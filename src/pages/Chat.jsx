import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';

const MessageContainer = styled(Box)`
  height: 60vh;
  overflow-y: auto;
  padding: 20px;
  background: rgba(0, 26, 0, 0.9);
  border: 1px solid #00ff00;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #001a00;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }
`;

const Message = styled(Paper)`
  padding: 10px 15px;
  margin: 10px 0;
  max-width: 80%;
  word-wrap: break-word;
  ${props => props.isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
  background-color: ${props => props.isUser ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 26, 0, 0.9)'} !important;
  border: 1px solid #00ff00;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

  useEffect(() => {
    // Debug log for API key (remove in production)
    if (!API_KEY) {
      console.error('API key is missing. Please check your .env file');
      setError('API key is missing. Please check your .env file');
    } else {
      console.log('API key is present');
      setError(null);
    }
  }, [API_KEY]);

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setError(null); // Reset error state
    
    if (!API_KEY) {
      setError('API key not found. Please add your Google Gemini API key to the .env file');
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      console.log('Creating model instance...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `You are a knowledgeable fitness and wellness coach. Please provide advice about: ${userMessage}
                     Consider the following aspects in your response:
                     - Scientific evidence and best practices
                     - Safety considerations
                     - Practical implementation tips
                     Keep the response concise, friendly, and actionable.`;

      console.log('Generating content...');
      const result = await model.generateContent(prompt);
      console.log('Content generated, getting response...');
      const response = await result.response;
      console.log('Getting text from response...');
      const text = response.text();

      setMessages(prev => [...prev, { text, isUser: false }]);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message || 'An error occurred while generating the response');
      setMessages(prev => [...prev, {
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        height: 'calc(100vh - 140px)',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3
      }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', textAlign: 'center' }}>
          Health & Wellness Assistant
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <MessageContainer>
          {messages.length === 0 && (
            <Typography 
              color="primary.main" 
              sx={{ textAlign: 'center', opacity: 0.7, mt: 2 }}
            >
              Ask me anything about fitness, health, or wellness!
            </Typography>
          )}
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser} elevation={1}>
              <Typography color="primary">
                {message.text}
              </Typography>
            </Message>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress color="primary" size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </MessageContainer>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about health, fitness, nutrition, or wellness..."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00ff00',
                },
                '&:hover fieldset': {
                  borderColor: '#00ff00',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00ff00',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
