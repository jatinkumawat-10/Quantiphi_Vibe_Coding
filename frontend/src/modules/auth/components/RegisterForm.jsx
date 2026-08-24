import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import TextField from '../../../components/TextField.jsx';
import Button from '../../../components/Button.jsx';

/**
 * RegisterForm Component
 * 
 * Registration form with username and password fields.
 * Uses React Hook Form for form management and validation.
 * 
 * Props:
 * - onSubmit: function(username, password) - called on valid form submission
 * - isLoading: boolean - disables form during submission
 * - error: string - error message to display
 */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[4]};
`;

const ErrorBanner = styled.div`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  background-color: ${(props) => props.theme.colors.error.light};
  color: ${(props) => props.theme.colors.error.dark};
  border-radius: ${(props) => props.theme.radii.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

export default function RegisterForm({ onSubmit, isLoading, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.username, data.password);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TextField
        label="Username"
        placeholder="Choose a username"
        error={errors.username?.message}
        disabled={isLoading}
        {...register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          maxLength: {
            value: 50,
            message: 'Username must be at most 50 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers, and underscores',
          },
        })}
      />

      <TextField
        label="Password"
        type="password"
        placeholder="Choose a password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
      />

      <TextField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value, formValues) =>
            value === formValues.password || 'Passwords do not match',
        })}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </Button>
    </Form>
  );
}
