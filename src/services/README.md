# Services Documentation

This directory contains all the API service modules for the Byway Learning Platform frontend.

## Available Services

### 🔐 Authentication Services
- **authService**: Handles user login, registration, and authentication
- **adminService**: Admin-specific operations and platform statistics

### 📚 Content Services
- **courseService**: Course management, search, and CRUD operations
- **categoryService**: Category management and operations
- **instructorService**: Instructor management and operations

### 🛒 Shopping Services
- **cartService**: Shopping cart operations
- **landingPageService**: Landing page data and statistics

### 👤 User Services
- **myCoursesService**: User's purchased courses
- **emailService**: Email notifications and communications

### 🔧 System Services
- **healthService**: System health checks
- **api**: Axios instance with interceptors

## API Base URL

The services are configured to use the deployed backend:
```
http://mohamedexfs60-001-site1.mtempurl.com/api
```

## Usage

```typescript
import { authService, courseService, adminService } from './services';

// Authentication
const user = await authService.login({ email, password });

// Courses
const courses = await courseService.getCourses();

// Admin operations
const stats = await adminService.getPlatformStats();
```

## Authentication

Most services require authentication. The `api` instance automatically includes the JWT token from localStorage in requests.

## Error Handling

All services include proper error handling and logging. Check the browser console for detailed error information.

## Endpoints Updated

All endpoints have been updated to match the deployed backend:
- `/Auth/*` - Authentication endpoints
- `/Admin/*` - Admin operations
- `/Courses/*` - Course management
- `/Categories/*` - Category management
- `/Instructors/*` - Instructor management
- `/Cart/*` - Shopping cart
- `/Orders/*` - Order management
- `/LandingPage/*` - Landing page data
- `/MyCourses/*` - User's courses
- `/Email/*` - Email services
- `/health` - Health check
