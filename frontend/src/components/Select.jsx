import styled from '@emotion/styled';

/**
 * Select Component
 * 
 * Reusable select dropdown with label and error state.
 * 
 * Usage:
 * <Select label="Billing Cycle" options={[{value: 'MONTHLY', label: 'Monthly'}]} />
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

const StyledSelect = styled.select`
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
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right ${(props) => props.theme.spacing[2]} center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: ${(props) => props.theme.spacing[10]};

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

export default function Select({
  label,
  error,
  options = [],
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledSelect disabled={disabled} hasError={!!error} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}
