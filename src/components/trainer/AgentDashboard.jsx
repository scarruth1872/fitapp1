import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, Button } from '@mui/material';
import { People as AgentsIcon, Code as CodeIcon, Psychology as NLPIcon, DataObject as DataScienceIcon, Balance as LegalIcon, Cloud as DevOpsIcon, ManageAccounts as ProjectManagerIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import DataScientistComponent from '../../components/agents/DataScientistComponent';
import MLComponent from '../../components/agents/MLComponent';
import NLPComponent from '../../components/agents/NLPComponent';
import SoftwareDeveloperComponent from '../../components/agents/SoftwareDeveloperComponent';
import DevOpsEngineerComponent from '../../components/agents/DevOpsEngineerComponent';
import LegalEthicsComponent from '../../components/agents/LegalEthicsComponent';
import ProjectManagerComponent from '../../components/agents/ProjectManagerComponent';
import AIQueryInterface from '../../components/AIQueryInterface';

const AgentDashboard = () => {
  const { currentUser } = useAuth();

const agentConfigurations = [
  {
    name: 'Data Scientist',
    component: <DataScientistComponent />,
    icon: <DataScienceIcon fontSize="large" />,
    description: 'Handles data collection, preprocessing, and analysis',
    status: 'Active',
    active: true
  },
  {
    name: 'Machine Learning Engineer',
    component: <MLComponent />,
    icon: <CodeIcon fontSize="large" />,
    description: 'Manages model architecture and training pipelines',
    status: 'Active',
    active: true
  },
  {
    name: 'NLP Specialist',
    component: <NLPComponent />,
    icon: <NLPIcon fontSize="large" />,
    description: 'Processes natural language data and semantic analysis',
    status: 'Active',
    active: true
  },
  {
    name: 'Software Developer',
    component: <SoftwareDeveloperComponent />,
    icon: <CodeIcon fontSize="large" />,
    description: 'Maintains system architecture and integrations',
    status: 'Active',
    active: true
  },
  {
    name: 'Legal/Ethics Consultant',
    component: <LegalEthicsComponent />,
    icon: <LegalIcon fontSize="large" />,
    description: 'Ensures regulatory compliance and ethical standards',
    status: 'Active',
    active: true
  },
  {
    name: 'DevOps Engineer',
    component: <DevOpsEngineerComponent/>,
    icon: <DevOpsIcon fontSize="large" />,
    description: 'Manages deployment and infrastructure',
    status: 'Active',
    active: true
  },
  {
    name: 'Project Manager',
    component: <ProjectManagerComponent />,
    icon: <ProjectManagerIcon fontSize="large" />,
    description: 'Coordinates agent tasks and resolves conflicts',
    status: 'Active',
    active: true
  },
  {
    name: 'AI Query Interface',
    component: <AIQueryInterface />,
    icon: <AgentsIcon fontSize="large" />,
    description: 'Interactive interface for querying AI agents',
    status: 'Active',
    active: true
  }
];

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AgentsIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 2 }} />
          Agent Coordination Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Logged in as: {currentUser?.email}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {agentConfigurations.map((agent, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {agent.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {agent.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {agent.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color={agent.active ? 'success.main' : 'error.main'}>
                    Status: {agent.status}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    color={agent.active ? 'success' : 'error'}
                  >
                    {agent.active ? 'Active' : 'Disabled'}
                  </Button>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                {agent.component}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default AgentDashboard;
