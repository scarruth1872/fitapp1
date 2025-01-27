# Counseling Assistant Application

A modern, AI-powered counseling assistant that helps users connect with counseling services and provides initial support.

## Features

- **AI-Powered Conversations**: Integrated with Ollama's deepseek-r1:1.5b model for natural and empathetic responses
- **Clinical Recognition**: Advanced analysis of user needs and concerns
- **Smart Scheduling**: Intelligent appointment scheduling with date and time selection
- **Modern UI/UX**: 
  - Beautiful, responsive chat interface
  - Real-time typing indicators
  - Smooth animations and transitions
  - Professional avatar system
  - Accessibility features (tooltips, ARIA labels)
- **User Authentication**: Secure login and signup system with password recovery
- **Navigation**: Responsive navbar with mobile support

## Technical Stack

- **Frontend**: React with Material-UI
- **AI Integration**: Ollama with deepseek-r1:1.5b model
- **State Management**: React Hooks
- **Styling**: Material-UI styled components with custom animations

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Ollama installed with deepseek-r1:1.5b model

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd fitapp1
```

2. Install dependencies:
```bash
npm install
```

3. Ensure Ollama is running with the deepseek-r1:1.5b model:
```bash
ollama run deepseek-r1:1.5b
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── assets/
│   └── counselor-avatar.svg
├── components/
│   ├── CounselingAgent.jsx
│   ├── Navbar.jsx
│   └── SchedulingPage.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Home.jsx
│   ├── Counseling.jsx
│   └── Scheduling.jsx
├── services/
│   └── ollamaService.js
├── utils/
│   └── conversationAnalyzer.js
├── contexts/
│   └── AuthContext.js
└── data/
    ├── clinicalData.js
    └── counselingData.js
```

## Key Components

### CounselingAgent
- Main chat interface component
- Handles user interactions and message display
- Implements smooth animations and visual feedback

### OllamaService
- Manages communication with Ollama AI model
- Handles response generation and context management
- Provides clinical insights and scheduling assistance

### ConversationAnalyzer
- Analyzes user messages for intent and needs
- Maintains conversation context
- Generates appropriate responses based on context

## Latest Updates

### Version 1.1.0 (2025-01-27)
- Added comprehensive user authentication system
  - Secure login and signup pages
  - Password recovery functionality
  - Protected routes for authenticated users
- Implemented dedicated scheduling system
  - Date and time selection with Material-UI pickers
  - Service and modality options
  - Contact information form
- Enhanced navigation with responsive navbar
  - Mobile-friendly drawer menu
  - User profile menu
  - Dynamic route handling based on authentication
- UI/UX Improvements
  - Consistent Material-UI styling across all pages
  - Loading indicators and error handling
  - Smooth page transitions with Framer Motion
  - Better form validation and user feedback

### Version 1.0.0 (2025-01-27)
- Integrated Ollama deepseek-r1:1.5b model for enhanced responses
- Implemented advanced clinical recognition system
- Added intelligent scheduling assistance
- Enhanced UI with modern design and animations:
  - Message bubbles with directional arrows
  - Typing indicators with animated dots
  - Smooth transitions and hover effects
  - Gradient header bar
  - Professional avatar system
  - Improved accessibility

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
