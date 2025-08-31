# Lane Feedback Management Application

## Overview

A production-ready single-page React application for collecting and exploring product feedback. Built with a modern tech stack focusing on user experience, performance, and maintainability.

**Architecture**: Frontend (React/TypeScript) communicates with a REST API backend (Node.js/Express) that persists data in MongoDB.

## Tech Choices

- **Frontend**: React with TypeScript for type safety and better developer experience
- **State Management**: Custom hooks with React's built-in state (useState, useEffect) - sufficient for this scope
- **Styling**: Tailwind CSS for rapid, consistent styling with excellent responsive design
- **Icons**: Lucide React for a comprehensive, lightweight icon set
- **Backend**: Express.js for its simplicity and extensive ecosystem
- **Database**: MongoDB with Mongoose for flexible document storage and excellent Node.js integration
- **Validation**: Server-side validation with Mongoose schemas plus client-side validation for UX

## How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on default port (27017)

### Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/lane-feedback
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=3001
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running locally on port 27017

4. **Run the application**:
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start separately:
   # Frontend (port 5173): npm run dev
   # Backend (port 3001): npm run server
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Seed Data
The application starts with an empty database. Use the "Add Feedback" button to create sample data.

## API Documentation

### Endpoints

#### GET /feedback
Retrieve feedback with optional filtering and sorting.

**Query Parameters**:
- `sort`: `newest` (default) or `oldest`
- `category`: `Bug`, `Feature`, `Improvement`, or omit for all
- `q`: Search term for title matching (case-insensitive)

**Example Request**:
```bash
GET /feedback?sort=newest&category=Bug&q=login
```

**Example Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Login button not working",
    "description": "The login button doesn't respond when clicked on mobile devices.",
    "category": "Bug",
    "votes": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST /feedback
Create new feedback.

**Request Body**:
```json
{
  "title": "Add dark mode",
  "description": "Users have requested a dark mode option for better accessibility.",
  "category": "Feature"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Add dark mode",
  "description": "Users have requested a dark mode option for better accessibility.",
  "category": "Feature",
  "votes": 0,
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

#### PUT /feedback/:id/vote
Increment vote count for feedback item.

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "votes": 1,
  // ... other fields
}
```

### Error Responses
All endpoints return consistent error format:
```json
{
  "error": "Descriptive error message"
}
```

## What's Missing / Trade-offs

### Current Limitations
1. **Authentication**: No JWT auth implementation - would add user management and restrict submissions
2. **Real-time Updates**: No WebSocket/SSE for live feedback updates
3. **Pagination**: All feedback loaded at once - would implement cursor-based pagination for scale
4. **Rich Text**: Plain text descriptions only - could add markdown support
5. **File Attachments**: No image/file upload capability
6. **Advanced Search**: Basic title search only - could add full-text search with MongoDB Atlas
7. **Analytics**: No usage tracking or feedback analytics dashboard

### Next Improvements
1. **Performance**: Implement virtual scrolling for large datasets
2. **Offline Support**: Add service worker for offline feedback drafting
3. **Moderation**: Admin interface for managing inappropriate content
4. **Notifications**: Email notifications for feedback status changes
5. **API Rate Limiting**: Implement rate limiting to prevent abuse
6. **Database Indexing**: Add compound indexes for common query patterns
7. **Caching**: Redis layer for frequently accessed data
8. **Testing**: Comprehensive unit and integration test coverage

## No-AI Statement

I confirm that I did not use any AI tools (ChatGPT, GitHub Copilot, CodeWhisperer, or similar) to write the code, design the UI, or draft this documentation. All implementation decisions, code structure, and documentation were created through my own knowledge and experience.