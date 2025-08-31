import React, { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc, ChevronDown, ChevronRight, Heart, Bug, Lightbulb, Wrench, Calendar, MessageSquare } from 'lucide-react';
import { Feedback, SortOption, CategoryFilter } from '../types/feedback';

interface FeedbackExplorerProps {
  feedback: Feedback[];
  loading: boolean;
  onRefresh: (sort: SortOption, category: CategoryFilter, search: string) => void;
  onVote: (id: string) => void;
}

export const FeedbackExplorer: React.FC<FeedbackExplorerProps> = ({
  feedback,
  loading,
  onRefresh,
  onVote
}) => {
  const [sort, setSort] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    onRefresh(newSort, categoryFilter, search);
  };

  const handleCategoryChange = (newCategory: CategoryFilter) => {
    setCategoryFilter(newCategory);
    onRefresh(sort, newCategory, search);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    onRefresh(sort, categoryFilter, newSearch);
  };

  const toggleGroup = (category: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const groupedFeedback = useMemo(() => {
    const groups: Record<string, Feedback[]> = {
      Bug: [],
      Feature: [],
      Improvement: []
    };
    
    feedback.forEach(item => {
      groups[item.category].push(item);
    });
    
    return groups;
  }, [feedback]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bug': return <Bug className="w-4 h-4 text-red-500" />;
      case 'Feature': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'Improvement': return <Wrench className="w-4 h-4 text-green-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'Feature': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Improvement': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const hasResults = feedback.length > 0;
  const hasSearch = search.trim() || categoryFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Controls */}
      <div className="mb-8 space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback by title..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value as CategoryFilter)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Improvement">Improvement</option>
          </select>
          
          {/* Sort */}
          <button
            onClick={() => handleSortChange(sort === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          >
            {sort === 'newest' ? (
              <>
                <SortDesc className="w-4 h-4 mr-2" />
                Newest First
              </>
            ) : (
              <>
                <SortAsc className="w-4 h-4 mr-2" />
                Oldest First
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading feedback...</p>
        </div>
      )}

      {/* Empty States */}
      {!loading && !hasResults && !hasSearch && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No feedback yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Be the first to share your thoughts and help improve the product. Your feedback drives innovation.</p>
        </div>
      )}

      {!loading && !hasResults && hasSearch && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No results found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
              onRefresh('newest', 'all', '');
            }}
            className="btn-primary"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grouped Feedback */}
      {!loading && hasResults && (
        <div className="space-y-6 animate-fade-in">
          {Object.entries(groupedFeedback).map(([category, items]) => {
            if (items.length === 0) return null;
            
            const isCollapsed = collapsedGroups.has(category);
            
            return (
              <div key={category} className="card overflow-hidden">
                <button
                  onClick={() => toggleGroup(category)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-25 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {items.length}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {!isCollapsed && (
                  <div className="border-t border-gray-100">
                    {items.map((item, index) => (
                      <div
                        key={item._id}
                        className={`p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 ${
                          index !== items.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-base font-semibold text-gray-900 truncate">
                                {item.title}
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 font-medium">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => onVote(item._id)}
                            className="ml-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 group"
                          >
                            <Heart className="w-4 h-4 group-hover:fill-current" />
                            <span className="font-semibold">{item.votes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};