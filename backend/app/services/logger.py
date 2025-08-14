from app.db import SessionLocal
from app.models import RequestLog
from datetime import datetime


def log_request(operation, input_data, result, duration_ms=None):
    db = SessionLocal()
    entry = RequestLog(
        operation=operation,
        input_data=str(input_data),
        result=str(result),
        timestamp=datetime.utcnow(),
        duration_ms=duration_ms
    )
    db.add(entry)
    db.commit()
    db.close()
