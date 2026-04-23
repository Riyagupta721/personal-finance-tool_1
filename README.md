# 💰 Reimagined Expense Tracker

A production-ready, full-stack personal finance tool built with a focus on **resilience**, **precision**, and **premium aesthetics**. This application is designed to handle real-world conditions like network instability and duplicate submissions while providing a beautiful user experience.

---

## 🚀 Key Features

- **Resilient API**: Implements **Idempotency Keys** (`X-Idempotency-Key`) to prevent duplicate transactions if a user clicks "Submit" twice or a network retry occurs.
- **Financial Precision**: Uses `Decimal` (Python) and `Numeric(10,2)` (SQL) to ensure 100% accuracy in financial calculations—no floating-point errors.
- **Smart Retries**: Frontend is equipped with automated retry logic and exponential backoff to handle temporary server issues gracefully.
- **Live Summaries**: Real-time total expenditure and category-wise breakdown displayed in a stunning glassmorphism dashboard.
- **Search & Sort**: Instantly filter by category or sort by date to find exactly what you're looking for.
- **Dark Mode Aesthetics**: A modern, sleek UI using vanilla CSS with custom gradients and micro-animations.

---

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy (ORM), Pydantic (Validation).
- **Frontend**: React, Vite, Axios (API Client), Lucide-React (Icons).
- **Database**: PostgreSQL (Production) / SQLite (Local Development).
- **DevOps**: Docker, Docker Compose, Render (Cloud Hosting).

---

## 🏁 Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Docker** (Optional, but recommended)

### Option 1: Local Setup (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-finance-tool_1.git
   cd personal-finance-tool_1
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Option 2: One-Click Setup (With Docker)
Just run one command from the root folder:
```bash
docker-compose up --build
```
The app will be live at `http://localhost:5173` and the API at `http://localhost:8000`.

---

## 🧪 Testing

The project includes a suite of integration tests covering core business logic.

```bash
cd backend
pytest
```
*Tests cover: Expense creation, negative amount validation, and idempotency handling.*

---

## 🚢 Deployment

This project is configured for **One-Click Deployment** on [Render](https://render.com) using the included `render.yaml` Blueprint.

1. Push your code to GitHub.
2. Connect your repo to Render.
3. Select the **Blueprint** option.
4. Render will automatically provision your Database, Backend, and Frontend.

---

## 🏗️ Architecture Overview

The backend follows a **Clean Layered Architecture**:
- **API Layer**: Handles routing and request/response validation.
- **Service Layer**: Contains business logic (idempotency checks, calculation rules).
- **Repository Layer**: Pure data access using SQLAlchemy.

The frontend uses a **Component-Based Architecture**:
- **Atomic Components**: Reusable UI elements like `ExpenseForm` and `SummaryCards`.
- **API Interceptors**: Centralized error handling and retry logic.

---

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 📈 Future Roadmap
- [ ] JWT User Authentication.
- [ ] Monthly Budgeting & Alerts.
- [ ] Data Export (CSV/PDF).
- [ ] Interactive Charts (Chart.js).

Developed with ❤️ by Riyagupta721
