import styled from '@emotion/styled';

/**
 * RenewingSoonBadge Component
 * 
 * Amber badge indicating a subscription is renewing within 7 days.
 * 
 * Props:
 * - daysRemaining: number - days until renewal
 */

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[1]};
  padding: ${(props) => `${props.theme.spacing[0.5]} ${props.theme.spacing[2]}`};
  background-color: ${(props) => props.theme.colors.warningAmber};
  color: ${(props) => props.theme.colors.text.inverse};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radii.full};
  white-space: nowrap;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.text.inverse};
`;

export default function RenewingSoonBadge({ daysRemaining }) {
  const getText = () => {
    if (daysRemaining === 0) return 'Today';
    if (daysRemaining === 1) return 'Tomorrow';
    return `${daysRemaining} days`;
  };

  return (
    <Badge>
      <Dot />
      Renewing {getText()}
    </Badge>
  );
}
