import React from 'react';
import { NLPSpecialistAgent } from '../../agents/NLPSpecialistAgent';
import { Typography, LinearProgress, Box } from '@mui/material';

class NLPComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new NLPSpecialistAgent();
    this.state = {
      processingMetrics: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const processingMetrics = await this.agent.processTextData();
      this.setState({ processingMetrics });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { processingMetrics, error } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <div>
        <Typography variant="subtitle2">NLP Processing:</Typography>
        <LinearProgress 
          variant="determinate" 
          value={processingMetrics?.accuracy * 100 || 0} 
          sx={{ height: 8, mb: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="caption">
            Entities: {processingMetrics?.entityCount || '--'}
          </Typography>
          <Typography variant="caption">
            Intents: {processingMetrics?.intentCount || '--'}
          </Typography>
        </Box>
      </div>
    );
  }
}

export default NLPComponent;
