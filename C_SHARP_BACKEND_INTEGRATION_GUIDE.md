# C# Backend Integration Guide

## Overview
This document provides a comprehensive guide for integrating the converted JavaScript frontend with a C# backend API. All frontend components have been converted from TypeScript to JavaScript with detailed comments and organized by functionality.

## Converted Files

### JavaScript Files (Converted from TypeScript)
- `src/pages/Profile.js` - User profile management and display
- `src/components/MainFeed.js` - Main feed interface with tab navigation  
- `src/contexts/AuthContext.js` - Authentication state management
- `src/App.js` - Main application component with routing

## C# Backend API Endpoints Needed

### Authentication Endpoints
```csharp
// POST /api/auth/register
// POST /api/auth/login  
// POST /api/auth/logout
// GET /api/auth/validate-session
```

### User Profile Endpoints
```csharp
// GET /api/user/profile
// PUT /api/user/profile
// POST /api/user/upload-media
// GET /api/user/media
```

### Social Features Endpoints
```csharp
// POST /api/posts/like
// DELETE /api/posts/like/{postId}
// POST /api/posts/save  
// DELETE /api/posts/save/{postId}
// GET /api/user/liked-posts
// GET /api/user/saved-posts
```

### Feed Content Endpoints
```csharp
// GET /api/feeds/following
// GET /api/feeds/foodporn
// GET /api/feeds/hungry-mode
// POST /api/posts/create
```

## Frontend Integration Points

### Authentication (AuthContext.js)
- Replace Supabase auth with C# API calls
- Implement JWT token management
- Handle session validation and refresh

### Profile Management (Profile.js)
- Connect profile loading to C# user API
- Implement media upload to C# file storage
- Connect like/save functionality to C# endpoints

### Feed Management (MainFeed.js)
- Connect tab feeds to C# content APIs
- Implement post creation via C# backend
- Handle real-time updates with SignalR

## Required C# Backend Features

### Authentication & Security
- JWT token generation and validation
- Password hashing and verification
- Session management
- CORS configuration for frontend

### Database Models
- User profiles and authentication
- Posts and media content
- Likes and saved posts relationships
- Following/follower relationships

### File Storage
- Media upload handling
- Image/video processing
- CDN integration for media delivery

### Real-time Features
- SignalR for live updates
- Push notifications
- Real-time feed updates

## Implementation Steps

1. **Set up C# Web API project** with authentication
2. **Create database models** for users, posts, interactions
3. **Implement authentication endpoints** with JWT
4. **Add file upload functionality** for media
5. **Create content management APIs** for feeds
6. **Update frontend API calls** to use C# endpoints
7. **Test authentication flow** end-to-end
8. **Implement social features** (likes, saves, follows)
9. **Add real-time functionality** with SignalR
10. **Deploy and configure** production environment

## Code Organization

### Frontend Structure
```
src/
├── pages/
│   └── Profile.js          # User profile management
├── components/
│   └── MainFeed.js         # Main feed interface
├── contexts/
│   └── AuthContext.js      # Authentication logic
└── App.js                  # Main app with routing
```

### Functionality Categories in Code

#### Authentication & Login (AuthContext.js)
- User registration and login
- Session management  
- Token validation
- Logout functionality

#### Profile Management (Profile.js)
- User profile display
- Settings and preferences
- Media upload interface
- Statistics and activity

#### Content & Feed Management (MainFeed.js)
- Tab navigation
- Feed content display
- Post creation interface
- Content filtering

#### Routing & App Structure (App.js)
- Route configuration
- Provider setup
- Global state management
- Error handling

## Next Steps

1. Replace all TODO comments with actual C# API implementations
2. Update localStorage usage for secure token management
3. Add proper error handling for C# API responses
4. Implement loading states for all API calls
5. Add offline functionality where appropriate
6. Set up proper TypeScript definitions if needed later