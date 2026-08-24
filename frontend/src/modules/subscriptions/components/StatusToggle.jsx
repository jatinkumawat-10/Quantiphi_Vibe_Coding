import styled from '@emotion/styled';

/**
 * StatusToggle Component
 * 
 * Toggle switch for changing subscription status between ACTIVE and PAUSED.
 * Implements optimistic UI with visual feedback.
 * 
 * Props:
 * - isActive: boolean - current status
 * - onToggle: function - called with new status
 * - disabled: boolean - disable toggle during loading
 */

const ToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => {
    if (props.disabled) return props.theme.colors.grey[300];
    return props.checked ? props.theme.colors.activeGreen : props.theme.colors.grey[400];
  }};
  border-radius: ${(props) => props.theme.radii.full};
  transition: all ${(props) => props.theme.transitions.normal};

  &::before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: transform ${(props) => props.theme.transitions.normal};
    transform: ${(props) => (props.checked ? 'translateX(22px)' : 'translateX(0)')};
    box-shadow: ${(props) => props.theme.shadows.sm};
  }
`;

export default function StatusToggle({ isActive, onToggle, disabled = false }) {
  const handleChange = () => {
    if (!disabled) {
      onToggle(isActive ? 'PAUSED' : 'ACTIVE');
    }
  };

  return (
    <ToggleContainer disabled={disabled}>
      <HiddenInput
        type="checkbox"
        checked={isActive}
        onChange={handleChange}
        disabled={disabled}
      />
      <Slider checked={isActive} disabled={disabled} />
    </ToggleContainer>
  );
}
