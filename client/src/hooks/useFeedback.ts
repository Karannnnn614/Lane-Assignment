import { useState, useEffect, useCallback } from 'react';
import { Feedback, CreateFeedbackRequest, SortOption, CategoryFilter } from '../types/feedback';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = useCallback(async (
    sort: SortOption = 'newest',
    category: CategoryFilter = 'all',
    search: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (category !== 'all') params.append('category', category);
      if (search.trim()) params.append('q', search.trim());
      
      const response = await fetch(`${API_BASE}/feedback?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = async (data: CreateFeedbackRequest): Promise<boolean> => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create feedback');
      }
      
      const newFeedback = await response.json();
      setFeedback(prev => [newFeedback, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const voteFeedback = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/feedback/${id}/vote`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to vote on feedback');
      }
      
      const updatedFeedback = await response.json();
      setFeedback(prev => 
        prev.map(item => item._id === id ? updatedFeedback : item)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    submitting,
    fetchFeedback,
    createFeedback,
    voteFeedback,
    clearError: () => setError(null)
  };
};