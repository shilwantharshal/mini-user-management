def test_get_profile_requires_auth(client):
    response = client.get("/users/me")
    assert response.status_code == 401
