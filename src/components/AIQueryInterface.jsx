import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { NLPSpecialistAgent } from '../agents/NLPSpecialistAgent';
import { useCollaboration } from '../contexts/CollaborationContext';

const MessageTypes = {
  USER: 'user',
  SYSTEM: 'system',
  ERROR: 'error',
  INFO: 'info'
};

const AIQueryInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const { messageSystem, projectManager } = useCollaboration();
  const nlpAgent = new NLPSpecialistAgent();

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    addMessage({
      type: MessageTypes.SYSTEM,
      content: "Welcome! I can help you analyze change logs, understand code changes, and provide insights. What would you like to know?",
      metadata: {
        suggestions: [
          "Show recent changes",
          "Analyze commit patterns",
          "Find related issues"
        ]
      }
    });
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date(),
      ...message
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setIsProcessing(true);

    // Add user message
    addMessage({
      type: MessageTypes.USER,
      content: userQuery
    });

    try {
      // Process query through NLP Agent
      const analysis = await nlpAgent.analyzeTechnicalText([userQuery], 'query');
      
      // Get relevant information based on analysis
      const taskConfig = {
        type: analysis[0].classification[0].label,
        priority: 'high',
        requirements: {
          nlp: true,
          dataAnalysis: analysis[0].entities.length > 0
        }
      };

      // Register task with Project Manager
      projectManager.taskRegistry.set(Date.now(), {
        ...taskConfig,
        status: 'IN_PROGRESS',
        query: userQuery,
        startedAt: Date.now()
      });

      // Process and generate response
      const responseData = await processQuery(analysis[0]);

      // Add system response
      addMessage({
        type: MessageTypes.SYSTEM,
        content: responseData.response,
        metadata: responseData.metadata
      });

      // Add any relevant suggestions
      if (responseData.suggestions) {
        addMessage({
          type: MessageTypes.INFO,
          content: "You might also be interested in:",
          metadata: {
            suggestions: responseData.suggestions
          }
        });
      }

    } catch (error) {
      console.error('Query processing failed:', error);
      addMessage({
        type: MessageTypes.ERROR,
        content: "I apologize, but I encountered an error processing your request. Please try rephrasing your question."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processQuery = async (analysis) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      response: "Based on the analysis of recent change logs, I found several relevant patterns and insights.",
      metadata: {
        confidence: 0.85,
        sources: ['recent commits', 'issue tracker'],
        relatedChanges: [
          { id: 'abc123', description: 'Updated deployment pipeline' },
          { id: 'def456', description: 'Fixed memory leak' }
        ]
      },
      suggestions: [
        "View detailed metrics",
        "Show related commits",
        "Analyze impact"
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const renderMessage = (message) => {
    const { type, content, metadata } = message;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: type === MessageTypes.USER ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '80%',
            backgroundColor: type === MessageTypes.USER ? 'primary.light' : 'background.paper',
            color: type === MessageTypes.USER ? 'white' : 'text.primary'
          }}
        >
          <Typography>{content}</Typography>
          
          {metadata?.relatedChanges && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Related Changes:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {metadata.relatedChanges.map((change, index) => (
                  <Chip
                    key={index}
                    label={change.description}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {metadata?.suggestions && (
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
              {metadata.suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  clickable
                />
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages Container */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map(message => (
          <Box key={message.id}>
            {renderMessage(message)}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Form */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about changes, patterns, or insights..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          size="small"
        />
        <IconButton 
          type="submit" 
          color="primary"
          disabled={!input.trim() || isProcessing}
        >
          {isProcessing ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default AIQueryInterface;
