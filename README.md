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
- **Social Feed**: Share counseling journey updates and achievements
- **Friend System**: Connect with other users
  - Send and receive friend requests
  - Search for users
  - Manage friend connections
- **Workout Sharing**: Share your counseling progress with custom privacy settings
  - Public, friends-only, or private sharing options
  - Like and comment on shared progress
  - Save progress from other users
- **Real-time Notifications**: Stay updated with social interactions
  - Friend request notifications
  - Likes and comments alerts
  - Progress share notifications

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

# FitApp - Comprehensive Fitness Application

## Version 1.0.0 (Stable Release)
Current stable version with complete exercise database and core functionality.

## Features
- Comprehensive exercise database with 110 exercises across 11 categories:
  - Strength Training
  - Cardiovascular Training
  - Bodyweight Training
  - Isolation Exercises
  - Core Training
  - Plyometric Training
  - Olympic Weightlifting
  - Functional Training
  - Mobility and Flexibility
  - Balance and Stability
  - Recovery and Regeneration

- Each exercise includes:
  - Detailed descriptions
  - Equipment requirements
  - Difficulty levels
  - Primary and secondary muscles worked
  - Proper form and execution
  - Common errors and tips
  - Benefits and variations

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitapp1.git
```

2. Install dependencies:
```bash
cd fitapp1
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Technology Stack
- React.js
- Material-UI
- Firebase
- Vite

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Exercise database contributors
- UI/UX design team
- Testing team

## Changelog
### v1.0.0 (2025-01-28)
- Complete exercise database with 110 exercises
- Stable core functionality
- Improved user interface
- Bug fixes and performance improvements

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env` file with the following:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. **Cal.com Setup**
- Create an account at [Cal.com](https://cal.com)
- Set up your event types matching the consultation packages
- Replace `your-cal-username` in `ConsultationBooking.jsx` with your Cal.com username

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

## Project Structure

```
fitapp1/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── booking/       # Consultation booking components
│   │   ├── social/        # Social feed and interactions
│   │   └── workout/       # Workout tracking components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Main page components
│   ├── utils/             # Utility functions
│   └── config/            # Configuration files
├── public/                # Static assets
└── docs/                  # Documentation
```

## Technologies Used

- React with Vite
- Material-UI
- Firebase (Auth, Firestore, Analytics)
- Cal.com for scheduling
- Framer Motion for animations

## Development Guidelines

1. **Code Style**
   - Use functional components with hooks
   - Implement proper error handling
   - Follow Material-UI theming patterns
   - Use TypeScript for type safety

2. **State Management**
   - Use React Context for global state
   - Implement proper data fetching patterns
   - Handle loading and error states

3. **Testing**
   - Write unit tests for utilities
   - Test components in isolation
   - Implement integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For support, email support@fitapp.com or open an issue on GitHub.
