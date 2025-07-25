from pydantic import BaseModel, Field

class PowerInput(BaseModel):
    base: int = Field(..., description="Base number")
    exp: int = Field(..., description="Exponent")
