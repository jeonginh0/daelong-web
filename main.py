from fastapi import FastAPI, Depends
from requests import Session
from starlette.middleware.cors import CORSMiddleware
from domain.user import user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")
#
# @app.get("/")
# dezf index():
#     return FileResponse("frontend/build/index.html")


app.include_router(user_router.router)