import styled from '@emotion/styled';
import ScienceIcon from '@mui/icons-material/Science';

/**
 * TrialBadge Component
 * 
 * Feature 4: Free Trial Tracker
 * 
 * Shows a badge indicating trial status (active, ending soon, ended).
 * 
 * Props:
 * - trialStatus: { isTrial, isTrialActive, isTrialEndingSoon, daysUntilTrialEnd, message }
 */

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[1]};
  padding: ${(props) => `${props.theme.spacing[0.5]} ${props.theme.spacing[2]}`};
  background-color: ${(props) => {
    if (props.isEndingSoon) return 'rgba(255, 152, 0, 0.15)';
    if (props.isActive) return 'rgba(33, 150, 243, 0.1)';
    return 'rgba(158, 158, 158, 0.1)';
  }};
  color: ${(props) => {
    if (props.isEndingSoon) return props.theme.colors.warning.dark;
    if (props.isActive) return props.theme.colors.primary[700];
    return props.theme.colors.grey[600];
  }};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radii.full};
  white-space: nowrap;
`;

const Icon = styled(ScienceIcon)`
  font-size: 14px;
`;

export default function TrialBadge({ trialStatus }) {
  if (!trialStatus || !trialStatus.isTrial) {
    return null;
  }

  return (
    <Badge
      isActive={trialStatus.isTrialActive}
      isEndingSoon={trialStatus.isTrialEndingSoon}
      title={trialStatus.message}
    >
      <Icon />
      {trialStatus.message}
    </Badge>
  );
}
