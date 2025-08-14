import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.controllers.routes import register_routes
from app.db import init_db
from app.extensions import cache


def create_app():
    app = Flask(__name__)
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_URL"] = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    cache.init_app(app)

    app.config["JWT_SECRET_KEY"] = "super-secret-key"
    CORS(app)
    JWTManager(app)

    init_db()
    register_routes(app)

    return app
