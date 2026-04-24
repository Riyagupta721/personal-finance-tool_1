import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base, get_db
import uuid

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_expense():
    response = client.post(
        "/expenses/",
        json={
            "amount": 100.50,
            "category": "Food",
            "description": "Lunch",
            "date": "2024-04-23T12:00:00Z"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == "100.50"
    assert data["category"] == "Food"

def test_validation_negative_amount():
    response = client.post(
        "/expenses/",
        json={
            "amount": -50.00,
            "category": "Food",
            "description": "Error",
            "date": "2024-04-23T12:00:00Z"
        }
    )
    assert response.status_code == 400
    assert response.json() == {"error": "Amount cannot be negative"}

def test_idempotency():
    idempotency_key = str(uuid.uuid4())
    payload = {
        "amount": 50.00,
        "category": "Transport",
        "description": "Taxi",
        "date": "2024-04-23T12:00:00Z",
        "idempotency_key": idempotency_key
    }
    
    # First request
    response1 = client.post("/expenses/", json=payload)
    assert response1.status_code == 201
    id1 = response1.json()["id"]
    
    # Second request with same key
    response2 = client.post("/expenses/", json=payload)
    assert response2.status_code == 201
    assert response2.json()["id"] == id1 # Should return same record

def test_delete_expense():
    # Create an expense
    create_resp = client.post(
        "/expenses/",
        json={
            "amount": 200.00,
            "category": "Shopping",
            "description": "Shoes",
            "date": "2024-04-23T12:00:00Z"
        }
    )
    expense_id = create_resp.json()["id"]
    
    # Delete it
    delete_resp = client.delete(f"/expenses/{expense_id}")
    assert delete_resp.status_code == 204
    
    # Verify it's gone
    get_resp = client.get("/expenses/")
    expenses = get_resp.json()
    assert not any(e["id"] == expense_id for e in expenses)

def test_delete_nonexistent_expense():
    non_existent_uuid = str(uuid.uuid4())
    response = client.delete(f"/expenses/{non_existent_uuid}")
    assert response.status_code == 404
