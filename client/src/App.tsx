import React, { useState } from 'react';
import { Header } from './components/Header';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackExplorer } from './components/FeedbackExplorer';
import { Toast } from './components/Toast';
import { useFeedback } from './hooks/useFeedback';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const {
    feedback,
    loading,
    error,
    submitting,
    fetchFeedback,
    createFeedback,
    voteFeedback,
    clearError
  } = useFeedback();

  const handleCreateFeedback = async (data: any) => {
    const success = await createFeedback(data);
    if (success) {
      setToast({ message: 'Feedback submitted successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to submit feedback. Please try again.', type: 'error' });
    }
    return success;
  };

  const handleVote = async (id: string) => {
    await voteFeedback(id);
  };

  // Show error toast if there's an API error
  React.useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Header onAddFeedback={() => setIsFormOpen(true)} />
      
      <FeedbackExplorer
        feedback={feedback}
        loading={loading}
        onRefresh={fetchFeedback}
        onVote={handleVote}
      />
      
      <FeedbackForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateFeedback}
        submitting={submitting}
      />
      
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default App;
