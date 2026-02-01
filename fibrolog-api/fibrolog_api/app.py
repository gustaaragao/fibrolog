from fastapi import FastAPI

from fibrolog_api.routers import auth, crises, pacientes, registros_diarios

app = FastAPI()

app.include_router(auth.router)
app.include_router(crises.router)
app.include_router(pacientes.router)
app.include_router(registros_diarios.router)
