from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fibrolog_api.routers import auth, crises, pacientes, registros_diarios

app = FastAPI()

# Configuração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",  # Expo web dev server
        "http://localhost:19006", # Expo web alternativo
        "exp://localhost:8081",   # Expo Go
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(crises.router)
app.include_router(pacientes.router)
app.include_router(registros_diarios.router)
