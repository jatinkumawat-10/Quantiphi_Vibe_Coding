import styled from '@emotion/styled';
import { format } from 'date-fns';
import StatusToggle from './StatusToggle.jsx';
import RenewingSoonBadge from './RenewingSoonBadge.jsx';
import BillingNudgeBadge from './BillingNudgeBadge.jsx';
import TrialBadge from './TrialBadge.jsx';
import SplitBadge from './SplitBadge.jsx';

/**
 * SubscriptionRow Component
 * 
 * Renders a single subscription row in the table.
 * Shows service name, cost, billing cycle, renewal date, status, toggle,
 * and new feature badges (nudge, split, trial).
 * 
 * Props:
 * - subscription: Object - subscription data with server-side annotations
 * - onToggle: function - called when status is toggled
 * - isToggling: boolean - loading state for this specific row
 */

const Row = styled.tr`
  background-color: ${(props) => {
    if (props.isPaused) return props.theme.colors.grey[50];
    return props.theme.colors.background.paper;
  }};
  opacity: ${(props) => (props.isPaused ? 0.7 : 1)};
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    background-color: ${(props) => {
      if (props.isPaused) return props.theme.colors.grey[100];
      return props.theme.colors.grey[50];
    }};
  }
`;

const Cell = styled.td`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
  vertical-align: middle;
`;

const ServiceName = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const Cost = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
`;

const Notes = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: ${(props) => props.theme.spacing[1]};
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[2]};
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${(props) => `${props.theme.spacing[0.5]} ${props.theme.spacing[2]}`};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radii.full};
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.status === 'ACTIVE') return 'rgba(76, 175, 80, 0.1)';
    return 'rgba(158, 158, 158, 0.1)';
  }};
  color: ${(props) => {
    if (props.status === 'ACTIVE') return props.theme.colors.success.dark;
    return props.theme.colors.grey[600];
  }};
`;

export default function SubscriptionRow({ subscription, onToggle, isToggling = false }) {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate split cost if shared
  const displayCost = subscription.isShared && subscription.splitCount > 1
    ? subscription.cost / subscription.splitCount
    : subscription.cost;

  return (
    <Row isPaused={subscription.status === 'PAUSED'}>
      <Cell>
        <ServiceName>{subscription.serviceName}</ServiceName>
        {subscription.notes && (
          <Notes title={subscription.notes}>{subscription.notes}</Notes>
        )}
      </Cell>
      <Cell>
        <Cost>{formatCurrency(displayCost)}</Cost>
        {subscription.isShared && subscription.splitCount > 1 && (
          <Notes>of {formatCurrency(subscription.cost)}</Notes>
        )}
      </Cell>
      <Cell>{subscription.billingCycle}</Cell>
      <Cell>{formatDate(subscription.nextRenewalDate)}</Cell>
      <Cell>
        <BadgeContainer>
          <StatusBadge status={subscription.status}>{subscription.status}</StatusBadge>
          {subscription.isRenewingSoon && (
            <RenewingSoonBadge daysRemaining={subscription.daysRemaining} />
          )}
          <BillingNudgeBadge nudge={subscription.billingNudge} />
          <SplitBadge
            isShared={subscription.isShared}
            splitCount={subscription.splitCount}
            splitNote={subscription.splitNote}
          />
          <TrialBadge trialStatus={subscription.trialStatus} />
        </BadgeContainer>
      </Cell>
      <Cell>
        <StatusToggle
          isActive={subscription.status === 'ACTIVE'}
          onToggle={(newStatus) => onToggle(subscription.id, newStatus)}
          disabled={isToggling}
        />
      </Cell>
    </Row>
  );
}
