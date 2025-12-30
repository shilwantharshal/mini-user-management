import os
import pytest
import mongomock

from app import create_app
from extensions import mongo


@pytest.fixture
def client(monkeypatch):
    # Set test env
    os.environ["FLASK_ENV"] = "testing"
    os.environ["JWT_SECRET_KEY"] = "test-secret-key"

    app = create_app()
    app.config["TESTING"] = True

    # ---- MOCK MONGO DB ----
    mock_client = mongomock.MongoClient()
    mock_db = mock_client["test_db"]

    # Patch mongo.db to use mock DB
    monkeypatch.setattr(mongo, "db", mock_db)

    with app.test_client() as client:
        yield client
