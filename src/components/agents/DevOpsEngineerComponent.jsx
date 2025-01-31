import React from 'react';
import { DevOpsEngineerAgent } from '../../agents/DevOpsEngineerAgent';
import { Typography, Box, Stack, Chip, LinearProgress } from '@mui/material';

class DevOpsEngineerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new DevOpsEngineerAgent();
    this.state = {
      deploymentStatus: null,
      infrastructureMetrics: null,
      modelDeployment: null,
      modelPerformance: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      // Deploy base application
      const deploymentStatus = await this.agent.deployApplication('production', '1.0.0');
      const infrastructureMetrics = await this.agent.monitorInfrastructure();

      // Deploy and monitor ML models
      const modelDeployment = await this.agent.deployModel({
        name: 'changelog-analyzer',
        version: '1.0.0',
        requiresGPU: false
      });

      const modelPerformance = await this.agent.monitorModelPerformance('changelog-analyzer');

      this.setState({ 
        deploymentStatus, 
        infrastructureMetrics,
        modelDeployment,
        modelPerformance
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { deploymentStatus, infrastructureMetrics, modelDeployment, modelPerformance, error } = this.state;

    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <Box>
        <Stack spacing={2}>
          {/* Infrastructure Status */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Infrastructure Status
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`CPU: ${infrastructureMetrics?.cpuUsage?.toFixed(1) || '--'}%`}
                color="primary"
                size="small"
              />
              <Chip
                label={`Memory: ${infrastructureMetrics?.memoryUsage?.toFixed(1) || '--'}%`}
                color="primary"
                size="small"
              />
            </Stack>
          </Box>

          {/* Model Deployment */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Model Deployment
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`Status: ${modelDeployment?.status || '--'}`}
                color={modelDeployment?.status === 'deployed' ? 'success' : 'warning'}
                size="small"
              />
              <Chip
                label={`Version: ${modelDeployment?.version || '--'}`}
                color="info"
                size="small"
              />
            </Stack>
          </Box>

          {/* Model Performance */}
          {modelPerformance && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Model Performance
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  label={`P95 Latency: ${modelPerformance.inference.latency.p95.toFixed(1)}ms`}
                  color="secondary"
                  size="small"
                />
                <Chip
                  label={`Error Rate: ${(modelPerformance.inference.errorRate * 100).toFixed(2)}%`}
                  color="secondary"
                  size="small"
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(modelPerformance.resources.gpu || 0)}
                sx={{ height: 8, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                GPU Utilization
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    );
  }
}

export default DevOpsEngineerComponent;
