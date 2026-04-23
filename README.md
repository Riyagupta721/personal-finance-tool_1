# Production-Ready Expense Tracker

A full-stack application built with FastAPI, React (Vite), and PostgreSQL. Designed for resilience with idempotency handling, automatic retries, and clean architecture.

## 🚀 Features

- **Resilient Backend**: FastAPI with SQLAlchemy and PostgreSQL.
- **Clean Architecture**: Separation of concerns into API, Services, and Repository layers.
- **Idempotency**: Prevents duplicate expense entries using unique idempotency keys.
- **Modern UI**: React with glassmorphism design, dark mode, and responsive layout.
- **Error Resilience**: Axios interceptors with exponential backoff for automatic retries on network failures.
- **Dockerized**: Easy setup using Docker Compose.

## 🛠️ Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic.
- **Frontend**: React (Vite), Axios, Lucide React, Date-fns.
- **DevOps**: Docker, Docker Compose.

## 🚦 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Installation

1. Clone the repository.
2. Navigate to the project root.
3. Start the application:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:3000`.
5. Access the API documentation at `http://localhost:8000/docs`.

## 🏗️ Design Decisions

- **Money Handling**: Used `Numeric` (Decimal) type in both database and Pydantic models to avoid floating-point precision issues.
- **Idempotency**: Implemented `X-Idempotency-Key` header logic. The frontend generates a UUID for each new submission attempt. The backend checks if this key exists before creating a new record, ensuring that retries don't create duplicates.
- **Clean Architecture**:
  - `Repository`: Handles direct database interactions.
  - `Service`: Contains business logic and orchestration.
  - `API`: Defines endpoints and handles request/response validation.
- **Retry Logic**: Implemented in the frontend API client. It automatically retries requests on 5xx errors or network failures with exponential backoff.

## 🧪 Tests

Basic unit/integration tests are included for:
- **Creating an expense**: Ensures valid data is stored correctly.
- **Validation (negative amount)**: Verifies that negative amounts are rejected with a 400 error.
- **Idempotency (duplicate requests)**: Confirms that duplicate submissions with the same key don't create multiple records.

To run tests locally:
```bash
cd backend
pytest
```

## 📈 Future Improvements

- **Authentication**: Add JWT-based user authentication.
- **Migrations**: Integrate Alembic for database schema migrations.
- **Caching**: Use Redis for caching frequently accessed data.
- **Unit Tests**: Add Pytest for backend and Vitest/Testing Library for frontend.
- **Pagination**: Implement cursor-based pagination for the expense list.
