from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine

# Register ORM models with Base before create_all
from app.models.cause import Cause  # noqa: F401
from app.models.donation import Donation  # noqa: F401
from app.routes import balances, causes, donations, import_

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Masjid Accounting API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(donations.router)
app.include_router(causes.router)
app.include_router(balances.router)
app.include_router(import_.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
