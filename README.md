# Task API Performance Testing

A complete REST API built with Node.js, Express, and SQLite, designed for comprehensive performance testing with K6. This project demonstrates full-stack development skills, database design, and modern performance testing practices.

## Features

- **Complete REST API** with 12 endpoints (CRUD operations for Users, Projects, Tasks)
- **Relational database** with foreign key constraints and JOIN queries
- **Performance testing suite** with K6 for load testing and stress testing
- **Professional architecture** following MVC pattern
- **Real-time monitoring** with InfluxDB and Grafana integration
- **Comprehensive error handling** and input validation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (development), InfluxDB (metrics)
- **Performance Testing**: K6
- **Monitoring**: Grafana (optional)
- **Containerization**: Docker Compose

## API Endpoints

### Users
- `GET /api/users` - List all users with pagination
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - List all projects with owner information
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List all tasks with project and assignee details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### System
- `GET /health` - Health check endpoint
- `GET /` - API information and available endpoints

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects table  
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Tasks table
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  project_id INTEGER NOT NULL,
  assigned_to INTEGER,
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id),
  FOREIGN KEY (assigned_to) REFERENCES users (id)
);
```

## Installation

### Prerequisites
- Node.js (16+)
- Docker and Docker Compose
- K6 installed globally

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/task-api-performance-testing.git
cd task-api-performance-testing
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the API**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

4. **Start monitoring stack (optional)**
```bash
docker-compose up -d
```

This starts InfluxDB (port 8086) and Grafana (port 3001) for metrics visualization.

## Usage Examples

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create a project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Website Redesign", "description": "Complete website overhaul", "user_id": 1}'
```

### Create a task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Design mockups", "description": "Create UI wireframes", "project_id": 1, "assigned_to": 1, "priority": "high"}'
```

### Get all tasks with relationships
```bash
curl http://localhost:3000/api/tasks
```

Response includes project title and assignee name through JOIN queries:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Design mockups",
      "description": "Create UI wireframes", 
      "status": "pending",
      "priority": "high",
      "project_id": 1,
      "assigned_to": 1,
      "project_title": "Website Redesign",
      "assigned_to_name": "John Doe",
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "count": 1
}
```

## Performance Testing

### Basic Load Test
```bash
cd tests/k6/scripts
k6 run basic-load-test.js
```

### Load Test with Metrics Collection
```bash
k6 run --out influxdb=http://localhost:8086/k6 basic-load-test.js
```

### Test Configuration
The basic load test simulates:
- **Ramp up**: 10 virtual users over 30 seconds
- **Sustained load**: 10 users for 1 minute  
- **Ramp down**: 0 users over 30 seconds

### Test Scenarios
- Health check validation
- CRUD operations on all endpoints
- Response time validation (< 500ms)
- Error rate monitoring
- Database query performance under load

### Sample Results
```
✓ health check status is 200
✓ users endpoint status is 200  
✓ projects endpoint status is 200
✓ tasks endpoint status is 200
✓ tasks response time < 500ms

checks.........................: 100.00% ✓ 595   ✗ 0
http_req_duration..............: avg=2.1ms   min=1.2ms med=1.9ms max=15.2ms
http_reqs......................: 595     4.96/s
iterations.....................: 119     0.99/s
```

## Project Structure

```
task-api-performance-testing/
├── src/
│   ├── config/
│   │   └── database.js          # SQLite configuration
│   ├── controllers/
│   │   ├── userController.js    # User business logic
│   │   ├── projectController.js # Project business logic
│   │   └── taskController.js    # Task business logic
│   ├── routes/
│   │   ├── users.js            # User endpoints
│   │   ├── projects.js         # Project endpoints
│   │   └── tasks.js            # Task endpoints
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling
│   └── app.js                  # Express application setup
├── tests/
│   └── k6/
│       ├── scripts/
│       │   └── basic-load-test.js
│       └── results/            # Test results storage
├── database/
│   └── tasks.db               # SQLite database file
├── docker-compose.yml         # InfluxDB + Grafana setup
├── package.json
└── server.js                  # Application entry point
```

## Monitoring and Visualization

When using the optional Grafana setup:

1. **Access Grafana**: http://localhost:3001 (admin/admin)
2. **Configure InfluxDB data source**:
   - URL: `http://influxdb:8086`
   - Database: `k6`
   - User: `k6`, Password: `k6`
3. **Create dashboards** for:
   - Response time trends
   - Request rate and throughput
   - Error rate monitoring
   - Database performance metrics

## Development

### Adding New Endpoints
1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Register routes in `src/app.js`
4. Add database schema updates to `src/config/database.js`
5. Create corresponding K6 tests

### Database Inspection
Use DB Browser for SQLite to view and edit data:
1. Download from https://sqlitebrowser.org/
2. Open `database/tasks.db`
3. Browse tables and data in real-time

## Performance Considerations

- **Database indexing**: Consider adding indexes for frequently queried fields
- **Connection pooling**: Implement for production environments
- **Caching layer**: Redis for frequently accessed data
- **Rate limiting**: Implement to prevent abuse
- **Input validation**: Comprehensive validation middleware

## Future Enhancements

- [ ] JWT Authentication and authorization
- [ ] Input validation with express-validator
- [ ] Rate limiting with express-rate-limit
- [ ] Migration to PostgreSQL for production
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Stress testing and spike testing scenarios
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration test suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

This project demonstrates proficiency in:
- RESTful API design and implementation
- Database design with relationships
- Performance testing methodologies
- Modern development practices
- Monitoring and observability
- Containerization and DevOps practices