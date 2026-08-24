import { useState } from 'react';
import styled from '@emotion/styled';
import SubscriptionRow from './SubscriptionRow.jsx';

/**
 * SubscriptionTable Component
 * 
 * Renders all subscriptions in a structured table.
 * Handles loading, empty, and error states.
 * 
 * Props:
 * - subscriptions: Array - list of subscriptions
 * - onToggle: function - called when status is toggled
 * - isLoading: boolean - loading state
 */

const TableContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background.paper};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${(props) => props.theme.colors.grey[50]};
`;

const TableHeader = styled.th`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  text-align: left;
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${(props) => props.theme.typography.letterSpacing.wider};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

const TableBody = styled.tbody``;

const EmptyState = styled.div`
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[6]}`};
  text-align: center;
`;

const EmptyTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const EmptyText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const LoadingRow = styled.tr`
  text-align: center;
`;

const LoadingCell = styled.td`
  padding: ${(props) => `${props.theme.spacing[8]} ${props.theme.spacing[4]}`};
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

export default function SubscriptionTable({ subscriptions, onToggle, isLoading }) {
  const [togglingId, setTogglingId] = useState(null);

  const handleToggle = async (id, newStatus) => {
    setTogglingId(id);
    try {
      await onToggle(id, newStatus);
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <TableContainer>
        <StyledTable>
          <TableHead>
            <tr>
              <TableHeader>Service</TableHeader>
              <TableHeader>Cost</TableHeader>
              <TableHeader>Cycle</TableHeader>
              <TableHeader>Renewal Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Toggle</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            <LoadingRow>
              <LoadingCell colSpan={6}>Loading subscriptions...</LoadingCell>
            </LoadingRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <EmptyTitle>No subscriptions yet</EmptyTitle>
          <EmptyText>Add your first subscription using the form above.</EmptyText>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <tr>
            <TableHeader>Service</TableHeader>
            <TableHeader>Cost</TableHeader>
            <TableHeader>Cycle</TableHeader>
            <TableHeader>Renewal Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Toggle</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {subscriptions.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onToggle={handleToggle}
              isToggling={togglingId === subscription.id}
            />
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}
