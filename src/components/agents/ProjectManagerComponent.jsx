import React from 'react';
import { ProjectManagerAgent } from '../../agents/ProjectManagerAgent';
import { MessagePassingSystem } from '../../collaboration/MessagePassingMechanisms';
import { 
  Typography, 
  Box, 
  Stack, 
  Chip, 
  LinearProgress, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

class ProjectManagerComponent extends React.Component {
  constructor(props) {
    super(props);
    const messageSystem = new MessagePassingSystem();
    this.agent = new ProjectManagerAgent(messageSystem);
    this.state = {
      workflowReport: null,
      taskMetrics: null,
      error: null,
      lastUpdate: null
    };
  }

  async componentDidMount() {
    try {
      // Start monitoring system
      this.agent.startMonitoring();
      
      // Initialize metrics
      const workflowReport = await this.agent.generateWorkflowReport();
      this.setState({ 
        workflowReport,
        lastUpdate: new Date()
      });

      // Set up periodic updates
      this.updateInterval = setInterval(async () => {
        const workflowReport = await this.agent.generateWorkflowReport();
        this.setState({ 
          workflowReport,
          lastUpdate: new Date()
        });
      }, 10000);

    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.agent.monitorInterval) {
      clearInterval(this.agent.monitorInterval);
    }
  }

  renderAgentStatus() {
    const { workflowReport } = this.state;
    if (!workflowReport?.agentStatus) return null;

    return (
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Agent ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tasks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(workflowReport.agentStatus).map(([agentId, status]) => (
              <TableRow key={agentId}>
                <TableCell>{agentId}</TableCell>
                <TableCell>
                  <Chip
                    label={status}
                    size="small"
                    color={status === 'OVERLOADED' ? 'error' : 
                           status === 'BUSY' ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  {[...this.agent.taskRegistry.values()]
                    .filter(task => task.assignedTo === agentId).length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  renderTaskMetrics() {
    const { workflowReport } = this.state;
    if (!workflowReport?.taskBreakdown) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Task Status
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {Object.entries(workflowReport.taskBreakdown).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              size="small"
              color={
                status === 'COMPLETED' ? 'success' :
                status === 'FAILED' ? 'error' :
                status === 'BLOCKED' ? 'warning' :
                'default'
              }
            />
          ))}
        </Stack>
      </Box>
    );
  }

  renderBottlenecks() {
    const { workflowReport } = this.state;
    if (!workflowReport?.bottlenecks?.length) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom color="warning.main">
          System Bottlenecks
        </Typography>
        <Stack spacing={1}>
          {workflowReport.bottlenecks.map((bottleneck, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {bottleneck.description}
            </Typography>
          ))}
        </Stack>
      </Box>
    );
  }

  renderRecommendations() {
    const { workflowReport } = this.state;
    if (!workflowReport?.recommendations?.length) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom color="info.main">
          Recommendations
        </Typography>
        <Stack spacing={1}>
          {workflowReport.recommendations.map((rec, index) => (
            <Chip
              key={index}
              label={rec.description}
              size="small"
              color={rec.priority === 'high' ? 'error' : 'warning'}
              sx={{ maxWidth: '100%' }}
            />
          ))}
        </Stack>
      </Box>
    );
  }

  render() {
    const { workflowReport, error, lastUpdate } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <Box>
        {/* Workflow Metrics */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            System Metrics
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`Tasks Completed: ${workflowReport?.metrics?.tasksCompleted || 0}`}
              color="success"
              size="small"
            />
            <Chip
              label={`In Progress: ${workflowReport?.metrics?.tasksInProgress || 0}`}
              color="primary"
              size="small"
            />
            <Chip
              label={`Agents: ${workflowReport?.metrics?.totalAgents || 0}`}
              color="info"
              size="small"
            />
          </Stack>
        </Box>

        {/* Task Status Breakdown */}
        {this.renderTaskMetrics()}

        {/* Agent Status Table */}
        {this.renderAgentStatus()}

        {/* Bottlenecks */}
        {this.renderBottlenecks()}

        {/* Recommendations */}
        {this.renderRecommendations()}

        {/* Last Update Timestamp */}
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdate?.toLocaleTimeString()}
        </Typography>
      </Box>
    );
  }
}

export default ProjectManagerComponent;
