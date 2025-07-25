from app.db import SessionLocal
from app.models import User, RequestLog

db = SessionLocal()

print("=== Utilizatori ===")
for user in db.query(User).all():
    print(f"{user.id}: {user.name} - {user.email}")

print("\n=== Logs ===")
for log in db.query(RequestLog).all():
    print(f"[{log.timestamp}] {log.operation}({log.input_data}) = {log.result}")

db.close()
