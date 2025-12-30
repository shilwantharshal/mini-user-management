def test_admin_route_requires_admin(client):
    response = client.get("/admin/users")
    assert response.status_code == 401
