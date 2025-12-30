def test_signup_success(client):
    response = client.post("/auth/signup", json={
        "full_name": "Test User",
        "email": "testuser1@example.com",
        "password": "Strong@123"
    })

    assert response.status_code == 201
    assert "access_token" in response.get_json()


def test_signup_duplicate_email(client):
    client.post("/auth/signup", json={
        "full_name": "Test User",
        "email": "testuser2@example.com",
        "password": "Strong@123"
    })

    response = client.post("/auth/signup", json={
        "full_name": "Test User",
        "email": "testuser2@example.com",
        "password": "Strong@123"
    })

    assert response.status_code == 409


def test_login_invalid_password(client):
    client.post("/auth/signup", json={
        "full_name": "Test User",
        "email": "testuser3@example.com",
        "password": "Strong@123"
    })

    response = client.post("/auth/login", json={
        "email": "testuser3@example.com",
        "password": "WrongPass@123"
    })

    assert response.status_code == 401
