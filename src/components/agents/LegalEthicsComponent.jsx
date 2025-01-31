import React from 'react';
import { LegalEthicsConsultantAgent } from '../../agents/LegalEthicsConsultantAgent';
import { Typography, Chip, Box } from '@mui/material';

class LegalEthicsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.agent = new LegalEthicsConsultantAgent();
    this.state = {
      complianceData: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const complianceData = await this.agent.checkRegulatoryCompliance();
      this.setState({ complianceData });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { complianceData, error } = this.state;
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }

    return (
      <div>
        <Typography variant="subtitle2">Compliance Status:</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            label={`Issues: ${complianceData?.complianceIssues || '--'}`}
            color={complianceData?.complianceIssues > 0 ? 'error' : 'success'}
            size="small"
          />
          <Chip
            label={`Last Audit: ${complianceData?.lastAuditDate || '--'}`}
            color="info"
            size="small"
          />
        </Box>
      </div>
    );
  }
}

export default LegalEthicsComponent;
