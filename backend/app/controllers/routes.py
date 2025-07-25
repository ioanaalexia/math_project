from flask import request, jsonify
from pydantic import ValidationError
from app.schemas import PowerInput
from app.services.logic import calculate_power, factorial, fibonacci
from app.services.logger import log_request
from app.services.auth import create_user, authenticate_user
from app.models import RequestLog
from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from app.db import SessionLocal
from app.models import User
from time import time
from app.schemas import PowerInput
from sqlalchemy import func

def register_routes(app):
    @app.route("/pow", methods=["POST"])
    @jwt_required()
    def pow_route():
        try:
            start = time()  # ✅ adăugat
            data = PowerInput.parse_raw(request.data)
            result = calculate_power(data.base, data.exp)
            duration = round((time() - start) * 1000, 2)  # ✅ în ms
            log_request("pow", {"base": data.base, "exp": data.exp}, result, duration_ms=duration)  # ✅ corect
            return jsonify({"result": result, "duration_ms": duration})
        except ValidationError as e:
            return jsonify({"error": e.errors()}), 400

    @app.route("/factorial/<int:n>")
    @jwt_required()
    def factorial_route(n):
        try:
            start = time()
            result = factorial(n)
            duration = round((time() - start) * 1000, 2)
            log_request("factorial", {"n": n}, result, duration_ms=duration)
            return jsonify({"result": result, "duration_ms": duration})
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

    from time import time

    @app.route("/fibonacci/<int:n>")
    @jwt_required()
    def fibonacci_route(n):
        try:
            start = time()
            result = fibonacci(n)
            duration = round((time() - start) * 1000, 2)
            log_request("fibonacci", {"n": n}, result, duration_ms=duration)
            return jsonify({"result": result, "duration_ms": duration})
        except ValueError as e:
            return jsonify({"error": str(e)}), 400


    @app.route("/logs", methods=["GET"])
    @jwt_required()
    def get_logs():
        db = SessionLocal()
        logs = db.query(RequestLog).order_by(RequestLog.timestamp.desc()).all()
        db.close()
        result = [
            {
                "id": log.id,
                "operation": log.operation,
                "input_data": log.input_data,
                "result": log.result,
                "timestamp": log.timestamp.isoformat()
            }
            for log in logs
        ]
        return jsonify(result)

    @app.route("/signup", methods=["POST"])
    def signup():
        data = request.get_json()
        user = create_user(data["name"], data["email"], data["password"])
        if not user:
            return jsonify({"message": "Email already registered"}), 409
        return jsonify({"message": "User created successfully"}), 201

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        user = authenticate_user(data["email"], data["password"])
        if not user:
            return jsonify({"message": "Invalid credentials"}), 401
        token = create_access_token(identity=user.email)

        with open("token_debug.log", "a") as f:
            f.write(f"Token generat pentru {user.email}: {token}\n")

        return jsonify({
            "token": token,
            "name": user.name,
            "email": user.email
        })

    @app.route("/users", methods=["GET"])
    def get_users():
        db = SessionLocal()
        users = db.query(User).all()
        result = [{"id": u.id, "name": u.name, "email": u.email} for u in users]
        db.close()
        return jsonify(result)

    @app.route("/cache/info")
    def cache_info():
        return jsonify({"message": "Redis caching activ ✅"})

    @app.route("/cache/clear", methods=["POST"])
    def clear_cache():
        cache.clear()
        return jsonify({"message": "Cache golit!"})

    @app.route("/cache/test/<int:n>")
    def test_cache(n):
        start = time()
        result = fibonacci(n)
        duration = round((time() - start) * 1000, 2)
        return jsonify({
            "result": result,
            "calculated_in_ms": duration
        })

    @app.route("/stats", methods=["GET"])
    @jwt_required()
    def get_stats():
        db = SessionLocal()

        total = db.query(func.count(RequestLog.id)).scalar()

        by_operation = (
            db.query(RequestLog.operation, func.count(RequestLog.id))
            .group_by(RequestLog.operation)
            .all()
        )

        avg_duration = (
            db.query(RequestLog.operation, func.avg(RequestLog.duration_ms))
            .group_by(RequestLog.operation)
            .all()
            if hasattr(RequestLog, "duration_ms") else []
        )

        db.close()

        return jsonify({
            "total": total,
            "by_operation": {op: count for op, count in by_operation},
            "avg_duration": {op: round(avg, 2) if avg is not None else None for op, avg in avg_duration}
        })