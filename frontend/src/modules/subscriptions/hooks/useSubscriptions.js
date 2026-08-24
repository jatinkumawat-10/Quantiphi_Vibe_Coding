import { useState, useEffect, useCallback } from 'react';
import * as subscriptionApi from '../api/subscriptionApi.js';

/**
 * useSubscriptions Hook
 * 
 * Manages subscription data and metrics state.
 * Provides functions to fetch, create, update, and toggle subscriptions.
 * Implements optimistic UI updates for toggle operations.
 * Updated with new features: notes, cost-splitting, free trial
 */
export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalMonthlyBurnRate: 0,
    upcomingRenewalsCount: 0,
    trialEndingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscriptions and metrics
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subscriptionsData, metricsData] = await Promise.all([
        subscriptionApi.getSubscriptions(),
        subscriptionApi.getMetrics(),
      ]);

      setSubscriptions(subscriptionsData);
      setMetrics(metricsData);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to load data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create a new subscription
  const createSubscription = useCallback(async (data) => {
    try {
      const newSubscription = await subscriptionApi.createSubscription(data);
      // Refresh data after creation
      await fetchData();
      return newSubscription;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to create subscription';
      throw new Error(message);
    }
  }, [fetchData]);

  // Update a subscription
  const updateSubscription = useCallback(async (id, data) => {
    try {
      const updatedSubscription = await subscriptionApi.updateSubscription(id, data);
      // Refresh data after update
      await fetchData();
      return updatedSubscription;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to update subscription';
      throw new Error(message);
    }
  }, [fetchData]);

  // Toggle subscription status with optimistic update
  const toggleStatus = useCallback(async (id, newStatus) => {
    // Optimistic update
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );

    // Update metrics optimistically
    setMetrics((prev) => {
      const sub = subscriptions.find((s) => s.id === id);
      if (!sub) return prev;

      const monthlyCost = sub.normalizedMonthlyCost || 0;
      const newBurnRate =
        newStatus === 'ACTIVE'
          ? prev.totalMonthlyBurnRate + monthlyCost
          : prev.totalMonthlyBurnRate - monthlyCost;

      return {
        ...prev,
        totalMonthlyBurnRate: Math.max(0, Math.round(newBurnRate * 100) / 100),
      };
    });

    try {
      await subscriptionApi.toggleSubscriptionStatus(id, newStatus);
      // Re-fetch to ensure consistency with server
      const metricsData = await subscriptionApi.getMetrics();
      setMetrics(metricsData);
    } catch (err) {
      // Revert optimistic update on error
      await fetchData();
      const message = err.response?.data?.error?.message || 'Failed to update status';
      throw new Error(message);
    }
  }, [subscriptions, fetchData]);

  return {
    subscriptions,
    metrics,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    toggleStatus,
    refresh: fetchData,
  };
}
