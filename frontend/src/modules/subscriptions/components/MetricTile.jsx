import styled from '@emotion/styled';

/**
 * MetricTile Component
 * 
 * Displays a single metric with label and value.
 * Used in the Topbar for burn rate and upcoming renewals.
 * 
 * Props:
 * - label: string - metric label
 * - value: string|number - metric value
 * - icon: ReactNode - optional icon
 * - color: string - accent color
 */

const Tile = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[3]};
  padding: ${(props) => `${props.theme.spacing[4]} ${props.theme.spacing[5]}`};
  background-color: ${(props) => props.theme.colors.background.paper};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  min-width: 200px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.theme.radii.lg};
  background-color: ${(props) => props.color || props.theme.colors.primary[50]};
  color: ${(props) => props.color || props.theme.colors.primary[600]};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${(props) => props.theme.typography.letterSpacing.wider};
`;

const Value = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

export default function MetricTile({ label, value, icon, color }) {
  return (
    <Tile>
      {icon && <IconContainer color={color}>{icon}</IconContainer>}
      <TextContainer>
        <Label>{label}</Label>
        <Value>{value}</Value>
      </TextContainer>
    </Tile>
  );
}
