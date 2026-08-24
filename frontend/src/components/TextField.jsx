import styled from '@emotion/styled';

/**
 * TextField Component
 * 
 * Reusable text input with label, error state, and optional icon.
 * 
 * Usage:
 * <TextField label="Email" error={errors.email?.message} {...register('email')} />
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

  &::placeholder {
    color: ${(props) => props.theme.colors.text.disabled};
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

export default function TextField({
  label,
  error,
  type = 'text',
  disabled = false,
  ...props
}) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        <StyledInput
          type={type}
          disabled={disabled}
          hasError={!!error}
          {...props}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}
