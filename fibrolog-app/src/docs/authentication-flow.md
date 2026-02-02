# FibroLog App - Authentication Flow

## Overview

This application implements a secure authentication flow using JWT tokens with a FastAPI backend. The app provides conditional navigation based on authentication state.

## Architecture

### Authentication Context (`AuthContext` & `AuthProvider`)
- Manages global authentication state
- Provides login, logout, and token management functions
- Handles automatic token persistence using AsyncStorage
- Implements token expiration checking and automatic logout

### API Integration (`apiClient` & `authService`)
- Axios client with automatic JWT token injection
- Request/response interceptors for token management
- Error handling for 401 (unauthorized) responses
- Development logging for debugging

### Form Validation (`schemas.ts`)
- Zod validation schemas matching backend requirements
- Real-time validation feedback
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Email format validation

### Navigation (`AppNavigator`)
- Conditional navigation based on authentication state
- Stack reset on login/logout (prevents back navigation)
- Loading screen during authentication state determination
- Error boundaries for unhandled errors

## Authentication Flow

1. **App Initialization**
   - App starts with loading screen
   - AuthProvider checks for stored token in AsyncStorage
   - If token exists and is valid, user is automatically logged in
   - If no token or expired token, user sees login screen

2. **Login Process**
   - User enters email and password
   - Form validation using Zod schemas
   - Submit request to `/auth` endpoint
   - On success: token stored, user state updated, navigate to home
   - On error: display appropriate error message

3. **Authenticated State**
   - All API requests automatically include JWT token
   - User can access protected screens
   - Token expiration is checked periodically
   - User information displayed on home screen

4. **Logout Process**
   - Clear token from AsyncStorage
   - Clear user state
   - Navigate back to login screen
   - Stack reset prevents navigation back to protected screens

5. **Token Expiration**
   - Automatic detection of expired tokens
   - 401 responses trigger automatic logout
   - Periodic token validation (every minute)

## API Integration

### Endpoints
- `POST /auth` - Authentication endpoint
  - Request: `{ email: string, password: string }`
  - Response: `{ access_token: string, token_type: string }`

### Error Handling
- Network errors: Connection timeout/failure messages
- 401 Unauthorized: Automatic logout and redirect
- 422 Validation: Display validation error messages
- 500 Server Error: Generic error message with retry option

### Security Features
- JWT tokens stored in AsyncStorage
- Automatic token expiration handling
- Request/response logging only in development
- Password validation matching backend requirements

## Configuration

### Environment Variables
- `EXPO_PUBLIC_API_URL`: API base URL (default: http://localhost:8000)

### Dependencies
- `@react-navigation/native` & `@react-navigation/stack`: Navigation
- `react-hook-form` & `zod`: Form validation
- `@hookform/resolvers`: Zod integration with react-hook-form
- `axios`: HTTP client
- `@react-native-async-storage/async-storage`: Token persistence

## Development

### Running the App
```bash
npm start
```

### Testing Authentication
1. Start FastAPI backend on localhost:8000
2. Run the app
3. Use valid credentials to test login flow
4. Test invalid credentials for error handling
5. Test token persistence by restarting the app

### Debugging
- API requests/responses logged in development mode
- Error boundary catches unhandled errors
- Token expiration simulation available in development