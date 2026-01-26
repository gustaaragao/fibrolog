from http import HTTPStatus


def test_create_paciente(client):
    response = client.post('/pacientes', json={'nome': 'Gustavo'})

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['nome'] == 'Gustavo'
    assert 'id' in data
    assert 'created_at' in data
