# Todo Task Management Application

A full-stack web application for managing todo tasks with a modern, responsive UI. Built with React frontend, Node.js/Express backend, and PostgreSQL database.

## Features

- ✅ Create new todo tasks with title and description
- ✅ View the 5 most recent incomplete tasks
- ✅ Mark tasks as completed (they disappear from the UI)
- ✅ Responsive design with beautiful UI
- ✅ Real-time updates
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## Architecture

The application consists of three main components:

- **Frontend**: React SPA with modern UI components
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL with optimized schema

## Tech Stack

### Frontend
- React 18
- Modern CSS with gradients and animations
- Axios for API communication
- Responsive design

### Backend
- Node.js with Express.js
- PostgreSQL with connection pooling
- Express validation middleware
- Security middleware (Helmet, CORS, Rate limiting)
- Comprehensive error handling

### Database
- PostgreSQL 15
- Optimized schema with indexes
- Sample data for testing

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Development and production configurations

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

The application will automatically:
- Create and initialize the PostgreSQL database
- Start the backend API server
- Build and serve the React frontend
- Set up networking between containers

## Development

### Running Tests

#### Backend Tests
```bash
# Run backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Frontend Tests
```bash
# Run frontend tests
cd frontend
npm test
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all incomplete tasks (max 5) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a specific task |
| PUT | `/api/tasks/:id/complete` | Mark a task as completed |
| GET | `/health` | Health check endpoint |

### Database Schema

```sql
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://todoapp:todoapp123@database:5432/todoapp
```

#### Frontend
```
REACT_APP_API_URL=http://localhost:3001
```

## Project Structure

```
todo/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── tests/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── setup.js
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── jest.config.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.js
│   │   │   ├── TaskForm.js
│   │   │   └── TaskList.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## Testing

### Backend Test Coverage
- Model tests for Task operations
- Controller tests for API endpoints
- Integration tests for complete workflows
- Error handling tests
- Validation tests

### Frontend Test Coverage
- Component rendering tests
- User interaction tests
- API integration tests
- Error state tests
- Loading state tests

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
- **Input Validation**: Express-validator for request validation
- **SQL Injection Protection**: Parameterized queries
- **Error Handling**: Secure error messages

## Performance Optimizations

- Database indexes on frequently queried columns
- Connection pooling for database connections
- Efficient React component structure
- Optimized Docker images
- Proper HTTP caching headers

## Production Deployment

For production deployment:

1. Update environment variables for production
2. Use production database credentials
3. Configure proper CORS origins
4. Set up SSL certificates
5. Use a reverse proxy (nginx)
6. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 3001, and 5432 are available
2. **Database connection**: Ensure PostgreSQL container is running
3. **Build failures**: Check Docker and Docker Compose versions
4. **API errors**: Check backend logs with `docker-compose logs backend`

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build

# Stop all services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
