import styled from '@emotion/styled';

/**
 * Button Component
 * 
 * Reusable button with variants (primary, secondary, danger, ghost)
 * and sizes (sm, md, lg).
 * 
 * Usage:
 * <Button variant="primary" size="md" onClick={handler}>Click me</Button>
 */

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[2]};
  font-family: ${(props) => props.theme.typography.button.fontFamily};
  font-size: ${(props) => {
    const sizes = {
      sm: props.theme.typography.fontSize.xs,
      md: props.theme.typography.fontSize.sm,
      lg: props.theme.typography.fontSize.base,
    };
    return sizes[props.size] || sizes.md;
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  letter-spacing: ${(props) => props.theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  border-radius: ${(props) => props.theme.radii.md};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};
  white-space: nowrap;

  /* Sizes */
  padding: ${(props) => {
    const paddings = {
      sm: `${props.theme.spacing[1.5]} ${props.theme.spacing[3]}`,
      md: `${props.theme.spacing[2]} ${props.theme.spacing[4]}`,
      lg: `${props.theme.spacing[3]} ${props.theme.spacing[5]}`,
    };
    return paddings[props.size] || paddings.md;
  }};

  /* Variants */
  ${(props) => {
    const { theme, variant, disabled } = props;
    
    const variants = {
      primary: `
        background-color: ${disabled ? theme.colors.grey[300] : theme.colors.primary[600]};
        color: ${theme.colors.text.inverse};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.primary[800]};
        }
      `,
      secondary: `
        background-color: ${disabled ? theme.colors.grey[100] : 'transparent'};
        color: ${disabled ? theme.colors.text.disabled : theme.colors.primary[600]};
        border: 1px solid ${disabled ? theme.colors.grey[300] : theme.colors.primary[600]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[50]};
        }
      `,
      danger: `
        background-color: ${disabled ? theme.colors.grey[300] : theme.colors.error.main};
        color: ${theme.colors.text.inverse};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.error.dark};
        }
      `,
      ghost: `
        background-color: transparent;
        color: ${disabled ? theme.colors.text.disabled : theme.colors.text.primary};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.grey[100]};
        }
      `,
    };

    return variants[props.variant] || variants.primary;
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
