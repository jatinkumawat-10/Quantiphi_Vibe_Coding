import styled from '@emotion/styled';
import GroupIcon from '@mui/icons-material/Group';

/**
 * SplitBadge Component
 * 
 * Feature 3: Cost-splitting
 * 
 * Shows a badge indicating the subscription is shared and split info.
 * 
 * Props:
 * - isShared: boolean
 * - splitCount: number
 * - splitNote: string (optional)
 */

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[1]};
  padding: ${(props) => `${props.theme.spacing[0.5]} ${props.theme.spacing[2]}`};
  background-color: rgba(156, 39, 176, 0.1);
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radii.full};
  white-space: nowrap;
`;

const Icon = styled(GroupIcon)`
  font-size: 14px;
`;

export default function SplitBadge({ isShared, splitCount, splitNote }) {
  if (!isShared || splitCount <= 1) {
    return null;
  }

  const splitAmount = splitCount;
  const title = splitNote
    ? `Shared with ${splitAmount - 1} other${splitAmount - 1 === 1 ? '' : 's'}: ${splitNote}`
    : `Split ${splitAmount} ways`;

  return (
    <Badge title={title}>
      <Icon />
      Split {splitAmount}x
    </Badge>
  );
}
