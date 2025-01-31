import React from 'react';
import { MessagePassingSystem } from '../collaboration/MessagePassingMechanisms';
import { createProjectManager } from '../agents/ProjectManagerAgent';

export const CollaborationContext = React.createContext();

export const CollaborationProvider = ({ children }) => {
  const [messageSystem] = React.useState(new MessagePassingSystem());
  const [projectManager] = React.useState(() => createProjectManager(messageSystem));

  const value = {
    messageSystem,
    projectManager
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = React.useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
