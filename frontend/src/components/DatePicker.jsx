import styled from '@emotion/styled';

/**
 * DatePicker Component
 * 
 * Reusable date input with label and error state.
 * Uses native HTML5 date input for simplicity.
 * 
 * Usage:
 * <DatePicker label="Next Renewal Date" error={errors.date?.message} />
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[1]};
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${(props) => `${props.theme.spacing[2.5]} ${props.theme.spacing[3]}`};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-family: ${(props) => props.theme.typography.fontFamily.primary};
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.paper};
  border: 1px solid ${(props) => {
    if (props.hasError) return props.theme.colors.error.main;
    return props.theme.colors.inputBorder;
  }};
  border-radius: ${(props) => props.theme.radii.md};
  transition: all ${(props) => props.theme.transitions.fast};

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity ${(props) => props.theme.transitions.fast};
  }

  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => {
      if (props.hasError) return props.theme.colors.error.main;
      return props.theme.colors.grey[400];
    }};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => {
      if (props.hasError) return props.theme.colors.error.main;
      return props.theme.colors.inputFocus;
    }};
    box-shadow: 0 0 0 3px ${(props) => {
      if (props.hasError) return 'rgba(244, 67, 54, 0.1)';
      return 'rgba(33, 150, 243, 0.1)';
    }};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.grey[100]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.error.main};
`;

export default function DatePicker({
  label,
  error,
  disabled = false,
  ...props
}) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledInput
        type="date"
        disabled={disabled}
        hasError={!!error}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}
