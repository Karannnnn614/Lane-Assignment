export interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: 'Bug' | 'Feature' | 'Improvement';
  votes: number;
  createdAt: string;
}

export interface CreateFeedbackRequest {
  title: string;
  description: string;
  category: 'Bug' | 'Feature' | 'Improvement';
}

export type SortOption = 'newest' | 'oldest';
export type CategoryFilter = 'all' | 'Bug' | 'Feature' | 'Improvement';