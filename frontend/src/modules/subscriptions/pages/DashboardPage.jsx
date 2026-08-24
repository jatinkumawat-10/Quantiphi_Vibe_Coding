import { useState } from 'react';
import styled from '@emotion/styled';
import AppLayout from '../../../components/Layout/AppLayout.jsx';
import Topbar from '../components/Topbar.jsx';
import EntryForm from '../components/EntryForm.jsx';
import SubscriptionTable from '../components/SubscriptionTable.jsx';
import useSubscriptions from '../hooks/useSubscriptions.js';

/**
 * DashboardPage Component
 * 
 * Main dashboard page with:
 * - Topbar with metrics (burn rate + upcoming renewals + trial ending)
 * - Entry form for adding new subscriptions (with notes, cost-split, trial fields)
 * - Subscription table with toggle and badges
 * 
 * All business logic is handled server-side.
 * Frontend only renders what the API returns.
 */

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing[6]};
`;

const ErrorBanner = styled.div`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  background-color: ${(props) => props.theme.colors.error.light};
  color: ${(props) => props.theme.colors.error.dark};
  border-radius: ${(props) => props.theme.radii.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;

export default function DashboardPage() {
  const {
    subscriptions,
    metrics,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    toggleStatus,
  } = useSubscriptions();

  const [formError, setFormError] = useState(null);

  const handleCreateSubscription = async (data) => {
    setFormError(null);
    try {
      await createSubscription(data);
    } catch (err) {
      setFormError(err.message);
      throw err; // Re-throw to let EntryForm know
    }
  };

  return (
    <AppLayout>
      <PageTitle>Dashboard</PageTitle>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Topbar metrics={metrics} />

      <EntryForm
        onSubmit={handleCreateSubscription}
        isLoading={isLoading}
        error={formError}
      />

      <SubscriptionTable
        subscriptions={subscriptions}
        onToggle={toggleStatus}
        isLoading={isLoading}
      />
    </AppLayout>
  );
}
