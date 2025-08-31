import React from "react";
import { MessageSquarePlus } from "lucide-react";

interface HeaderProps {
  onAddFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddFeedback }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-20 h-20 p-1">
              <img
                src="/Logo.png"
                alt="Lane Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Feedback</h1>
              <p className="text-sm text-gray-600 font-medium">
                Discover and plan with user insights
              </p>
            </div>
          </div>

          <button onClick={onAddFeedback} className="btn-primary">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Add Feedback
          </button>
        </div>
      </div>
    </header>
  );
};
