from fastapi import FastAPI

from fibrolog_api.routers import pacientes

app = FastAPI()

app.include_router(pacientes.router)
