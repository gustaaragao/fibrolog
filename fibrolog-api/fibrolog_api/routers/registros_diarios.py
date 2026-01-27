from fastapi import APIRouter

router = APIRouter(prefix='/registros-diarios', tags=['Registros Diários'])


@router.post('/{paciente_id}')
def create_registro(paciente_id: int): ...

@router.get('/{paciente_id}')
def get_registros_by_id(paciente_id: int): ...

@router.put('{registro_id}')
def update_registro(registro_id: int): ...


@router.delete('/{registro_id}')
def delete_registro(registro_id: int): ...
