import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import TextField from '../../../components/TextField.jsx';
import Select from '../../../components/Select.jsx';
import DatePicker from '../../../components/DatePicker.jsx';
import Button from '../../../components/Button.jsx';

/**
 * EntryForm Component
 * 
 * Form to add a new subscription with fields:
 * - serviceName (text, required)
 * - cost (numeric, required, > 0)
 * - billingCycle (dropdown: MONTHLY | YEARLY, required)
 * - nextRenewalDate (date picker, required, future-or-current)
 * 
 * Props:
 * - onSubmit: function(data) - called on valid form submission
 * - isLoading: boolean - disables form during submission
 * - error: string - error message to display
 */

const FormContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background.paper};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  padding: ${(props) => props.theme.spacing[6]};
  margin-bottom: ${(props) => props.theme.spacing[6]};
`;

const FormTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing[4]};
  align-items: end;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
`;

const ErrorBanner = styled.div`
  grid-column: 1 / -1;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  background-color: ${(props) => props.theme.colors.error.light};
  color: ${(props) => props.theme.colors.error.dark};
  border-radius: ${(props) => props.theme.radii.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

const billingCycleOptions = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export default function EntryForm({ onSubmit, isLoading, error }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceName: '',
      cost: '',
      billingCycle: '',
      nextRenewalDate: '',
    },
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        cost: parseFloat(data.cost),
      });
      reset();
    } catch (err) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const formIsLoading = isLoading || isSubmitting;

  // Get tomorrow's date as minimum date for date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <FormContainer>
      <FormTitle>Add New Subscription</FormTitle>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <TextField
          label="Service Name"
          placeholder="e.g., Netflix, Spotify"
          error={errors.serviceName?.message}
          disabled={formIsLoading}
          {...register('serviceName', {
            required: 'Service name is required',
            maxLength: {
              value: 100,
              message: 'Service name must be at most 100 characters',
            },
          })}
        />

        <TextField
          label="Cost"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          error={errors.cost?.message}
          disabled={formIsLoading}
          {...register('cost', {
            required: 'Cost is required',
            min: {
              value: 0.01,
              message: 'Cost must be greater than 0',
            },
            valueAsNumber: true,
          })}
        />

        <Select
          label="Billing Cycle"
          options={billingCycleOptions}
          placeholder="Select cycle"
          error={errors.billingCycle?.message}
          disabled={formIsLoading}
          {...register('billingCycle', {
            required: 'Billing cycle is required',
          })}
        />

        <DatePicker
          label="Next Renewal Date"
          min={getMinDate()}
          error={errors.nextRenewalDate?.message}
          disabled={formIsLoading}
          {...register('nextRenewalDate', {
            required: 'Renewal date is required',
          })}
        />

        <ButtonContainer>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={formIsLoading}
          >
            {formIsLoading ? 'Adding...' : 'Add Subscription'}
          </Button>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
}
