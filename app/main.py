from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth as auth_routes
from app.api.routes import users as users_routes
from app.api.routes import exhibitions as exhibitions_routes
from app.api.routes import reviews as reviews_routes
from app.api.routes import social as social_routes
from app.api.routes import calendar as calendar_routes
from app.api.routes import search as search_routes
from app.api.routes import messaging as messaging_routes
from app.core.config import settings
from app.db.session import init_models

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(users_routes.router)
app.include_router(exhibitions_routes.router)
app.include_router(reviews_routes.router)
app.include_router(social_routes.router)
app.include_router(calendar_routes.router)
app.include_router(search_routes.router)
app.include_router(messaging_routes.router)


@app.on_event("startup")
async def on_startup():
    await init_models()


@app.get("/")
async def root():
    return {"name": settings.app_name, "status": "ok"}
