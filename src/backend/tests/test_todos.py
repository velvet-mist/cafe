def test_create_todo(client):
    response = client.post("/api/v1/todos/", json={"title": "Buy groceries"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert data["completed"] is False
    assert "id" in data


def test_list_todos(client):
    client.post("/api/v1/todos/", json={"title": "Task 1"})
    client.post("/api/v1/todos/", json={"title": "Task 2"})
    response = client.get("/api/v1/todos/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_todo(client):
    created = client.post("/api/v1/todos/", json={"title": "Read a book"}).json()
    response = client.get(f"/api/v1/todos/{created['id']}")
    assert response.status_code == 200
    assert response.json()["title"] == "Read a book"


def test_get_todo_not_found(client):
    response = client.get("/api/v1/todos/999")
    assert response.status_code == 404


def test_update_todo(client):
    created = client.post("/api/v1/todos/", json={"title": "Old title"}).json()
    response = client.patch(
        f"/api/v1/todos/{created['id']}",
        json={"title": "New title", "completed": True},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New title"
    assert response.json()["completed"] is True


def test_delete_todo(client):
    created = client.post("/api/v1/todos/", json={"title": "Delete me"}).json()
    response = client.delete(f"/api/v1/todos/{created['id']}")
    assert response.status_code == 204
    response = client.get(f"/api/v1/todos/{created['id']}")
    assert response.status_code == 404