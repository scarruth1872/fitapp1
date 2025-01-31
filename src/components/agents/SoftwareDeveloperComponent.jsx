import React from 'react';
import { SoftwareDeveloperAgent } from '../../agents/SoftwareDeveloperAgent';
import { Typography, Chip, Box } from '@mui/material';

class SoftwareDeveloperComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new SoftwareDeveloperAgent();
    this.state = {
      systemMetrics: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const systemMetrics = await this.agent.analyzeSystemHealth();
      this.setState({ systemMetrics });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { systemMetrics, error } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <div>
        <Typography variant="subtitle2">System Health:</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            label={`Services: ${systemMetrics?.runningServices || '--'}`}
            color="success"
            size="small"
          />
          <Chip
            label={`Latency: ${systemMetrics?.averageLatency?.toFixed(1) || '--'}ms`}
            color="warning"
            size="small"
          />
        </Box>
      </div>
    );
  }
}

export default SoftwareDeveloperComponent;
