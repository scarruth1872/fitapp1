import React from 'react';
import { DataScientistAgent } from '../../agents/DataScientistAgent';
import { Typography, LinearProgress, Box } from '@mui/material';

class DataScientistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new DataScientistAgent();
    this.state = {
      datasetStats: null,
      preprocessingStatus: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const datasetStats = await this.agent.analyzeDataset('production-data');
      const preprocessingStatus = await this.agent.preprocessData();
      this.setState({ datasetStats, preprocessingStatus });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { datasetStats, error } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <div>
        <Typography variant="subtitle2">Data Quality Score:</Typography>
        <LinearProgress 
          variant="determinate" 
          value={datasetStats?.qualityScore || 0} 
          sx={{ height: 8, mb: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="caption">
            Features: {datasetStats?.featureCount || '--'}
          </Typography>
          <Typography variant="caption">
            Samples: {datasetStats?.sampleCount || '--'}
          </Typography>
        </Box>
      </div>
    );
  }
}

export default DataScientistComponent;
