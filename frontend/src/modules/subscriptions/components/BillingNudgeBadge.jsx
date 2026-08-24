import styled from '@emotion/styled';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

/**
 * BillingNudgeBadge Component
 * 
 * Feature 1: Annual vs Monthly Nudge
 * 
 * Shows a badge suggesting to switch billing cycle for savings.
 * 
 * Props:
 * - nudge: { shouldNudge, suggestedCycle, monthlySavings, yearlySavings, message }
 */

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[1]};
  padding: ${(props) => `${props.theme.spacing[0.5]} ${props.theme.spacing[2]}`};
  background-color: ${(props) => props.theme.colors.success.light};
  color: ${(props) => props.theme.colors.success.dark};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radii.full};
  white-space: nowrap;
`;

const Icon = styled(CompareArrowsIcon)`
  font-size: 14px;
`;

export default function BillingNudgeBadge({ nudge }) {
  if (!nudge || !nudge.shouldNudge) {
    return null;
  }

  return (
    <Badge title={nudge.message}>
      <Icon />
      Save ${nudge.yearlySavings}/yr
    </Badge>
  );
}
