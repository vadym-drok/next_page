from fastapi import FastAPI
from app.routers import users
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(docs_url='/')


app.include_router(users.router)


origins = [
    "http://localhost",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
