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
 * - notes (free-text, optional) - Feature 2
 * - isShared, splitCount, splitNote - Feature 3
 * - isTrial, trialEndDate, trialReminderDays - Feature 4
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

const FormRow = styled.div`
  grid-column: 1 / -1;
`;

const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${(props) => props.theme.typography.letterSpacing.wider};
  margin-bottom: ${(props) => props.theme.spacing[3]};
  margin-top: ${(props) => props.theme.spacing[2]};
  padding-top: ${(props) => props.theme.spacing[4]};
  border-top: 1px solid ${(props) => props.theme.colors.border.light};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[2]};
`;

const CheckboxLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.primary};
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceName: '',
      cost: '',
      billingCycle: '',
      nextRenewalDate: '',
      notes: '',
      isShared: false,
      splitCount: 1,
      splitNote: '',
      isTrial: false,
      trialEndDate: '',
      trialReminderDays: 3,
    },
  });

  const isShared = watch('isShared');
  const isTrial = watch('isTrial');

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        cost: parseFloat(data.cost),
        splitCount: parseInt(data.splitCount, 10),
        trialReminderDays: parseInt(data.trialReminderDays, 10),
      });
      reset();
      setShowAdvanced(false);
    } catch (err) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const formIsLoading = isLoading || isSubmitting;

  // Get today's date as minimum date for date picker
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

        {/* Feature 2: Notes */}
        <FormRow>
          <TextField
            label="Notes (optional)"
            placeholder="e.g., shared with roommate, cancel before trial ends"
            error={errors.notes?.message}
            disabled={formIsLoading}
            {...register('notes', {
              maxLength: {
                value: 1000,
                message: 'Notes must be at most 1000 characters',
              },
            })}
          />
        </FormRow>

        {/* Advanced Options Toggle */}
        <FormRow>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </Button>
        </FormRow>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            {/* Feature 3: Cost-splitting */}
            <FormRow>
              <SectionTitle>Cost Splitting</SectionTitle>
              <CheckboxContainer>
                <CheckboxInput
                  type="checkbox"
                  id="isShared"
                  disabled={formIsLoading}
                  {...register('isShared')}
                />
                <CheckboxLabel htmlFor="isShared">
                  This subscription is shared with others
                </CheckboxLabel>
              </CheckboxContainer>
            </FormRow>

            {isShared && (
              <>
                <TextField
                  label="Split Count"
                  type="number"
                  placeholder="2"
                  min="2"
                  max="100"
                  error={errors.splitCount?.message}
                  disabled={formIsLoading}
                  {...register('splitCount', {
                    required: isShared ? 'Split count is required' : false,
                    min: {
                      value: 2,
                      message: 'Split count must be at least 2',
                    },
                    valueAsNumber: true,
                  })}
                />

                <TextField
                  label="Split Note (optional)"
                  placeholder="e.g., split with John and Jane"
                  error={errors.splitNote?.message}
                  disabled={formIsLoading}
                  {...register('splitNote', {
                    maxLength: {
                      value: 255,
                      message: 'Split note must be at most 255 characters',
                    },
                  })}
                />
              </>
            )}

            {/* Feature 4: Free Trial Tracker */}
            <FormRow>
              <SectionTitle>Free Trial</SectionTitle>
              <CheckboxContainer>
                <CheckboxInput
                  type="checkbox"
                  id="isTrial"
                  disabled={formIsLoading}
                  {...register('isTrial')}
                />
                <CheckboxLabel htmlFor="isTrial">
                  This is a free trial subscription
                </CheckboxLabel>
              </CheckboxContainer>
            </FormRow>

            {isTrial && (
              <>
                <DatePicker
                  label="Trial End Date"
                  min={getMinDate()}
                  error={errors.trialEndDate?.message}
                  disabled={formIsLoading}
                  {...register('trialEndDate', {
                    required: isTrial ? 'Trial end date is required' : false,
                  })}
                />

                <TextField
                  label="Reminder Days Before Trial Ends"
                  type="number"
                  placeholder="3"
                  min="1"
                  max="30"
                  error={errors.trialReminderDays?.message}
                  disabled={formIsLoading}
                  {...register('trialReminderDays', {
                    min: {
                      value: 1,
                      message: 'Reminder days must be at least 1',
                    },
                    max: {
                      value: 30,
                      message: 'Reminder days must be at most 30',
                    },
                    valueAsNumber: true,
                  })}
                />
              </>
            )}
          </>
        )}

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
