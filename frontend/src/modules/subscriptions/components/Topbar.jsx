import styled from '@emotion/styled';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import ScienceIcon from '@mui/icons-material/Science';
import MetricTile from './MetricTile.jsx';

/**
 * Topbar Component
 * 
 * Renders three metric tiles:
 * 1. Total Monthly Burn Rate
 * 2. Upcoming Renewals Alert Count
 * 3. Trials Ending Soon Count (Feature 4)
 * 
 * Props:
 * - metrics: { totalMonthlyBurnRate: number, upcomingRenewalsCount: number, trialEndingCount: number }
 */

const TopbarContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[6]};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export default function Topbar({ metrics }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <TopbarContainer>
      <MetricTile
        label="Monthly Burn Rate"
        value={formatCurrency(metrics.totalMonthlyBurnRate)}
        icon={<AttachMoneyIcon />}
        color="rgba(33, 150, 243, 0.1)"
      />
      <MetricTile
        label="Renewing Soon"
        value={metrics.upcomingRenewalsCount}
        icon={<NotificationImportantIcon />}
        color="rgba(255, 152, 0, 0.1)"
      />
      {metrics.trialEndingCount > 0 && (
        <MetricTile
          label="Trials Ending"
          value={metrics.trialEndingCount}
          icon={<ScienceIcon />}
          color="rgba(156, 39, 176, 0.1)"
        />
      )}
    </TopbarContainer>
  );
}
