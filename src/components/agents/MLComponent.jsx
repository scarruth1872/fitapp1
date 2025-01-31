import React from 'react';
import { MachineLearningEngineerAgent } from '../../agents/MachineLearningEngineerAgent';
import { Typography, LinearProgress, Box, Chip, Stack } from '@mui/material';

class MLComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new MachineLearningEngineerAgent();
    this.state = {
      modelMetrics: null,
      trainingStatus: null,
      changeLogAnalysis: null,
      semanticMappings: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      // Initialize change log analysis model
      const changeLogModel = await this.agent.selectModelArchitecture('changeLogAnalysis', {
        dataSize: 50000,
        complexity: 'high',
        labelDistribution: 'balanced'
      });

      // Initialize semantic mapping model
      const semanticModel = await this.agent.selectModelArchitecture('semanticMapping', {
        dataSize: 30000,
        complexity: 'high',
        hasGraphStructure: true
      });

      // Training simulation
      const trainingStatus = await this.agent.trainModel({
        taskType: 'changeLogAnalysis',
        architecture: changeLogModel.primary
      });

      // Evaluation
      const modelMetrics = await this.agent.evaluateModel(
        { name: changeLogModel.primary },
        null,
        'changeLogAnalysis'
      );

      this.setState({
        modelMetrics,
        trainingStatus,
        changeLogAnalysis: changeLogModel,
        semanticMappings: semanticModel
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { modelMetrics, error } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Model Architecture:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`Change Log: ${this.state.changeLogAnalysis?.primary || '--'}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`Semantic: ${this.state.semanticMappings?.primary || '--'}`}
            size="small"
            color="primary"
          />
        </Stack>

        <Typography variant="subtitle2" gutterBottom>
          Performance Metrics:
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={modelMetrics?.metrics?.accuracy * 100 || 0} 
          sx={{ height: 8, mb: 1 }}
        />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={`Precision: ${modelMetrics?.metrics?.precision?.toFixed(2) || '--'}`} 
            size="small" 
            color="secondary"
          />
          <Chip 
            label={`Recall: ${modelMetrics?.metrics?.recall?.toFixed(2) || '--'}`} 
            size="small" 
            color="secondary"
          />
          <Chip 
            label={`F1: ${modelMetrics?.metrics?.f1Score?.toFixed(2) || '--'}`} 
            size="small" 
            color="secondary"
          />
        </Stack>

        {modelMetrics?.analysis && (
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Insights: {modelMetrics.analysis.insights}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
}

export default MLComponent;
