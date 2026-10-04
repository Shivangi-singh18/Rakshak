from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ComplaintCreate(BaseModel):
    category: str
    raw_story: str
    user_id: int | None = 1


class ComplaintResponse(BaseModel):
    id: int
    category: str
    status: str
    formatted_petition: str | None
    created_at: datetime
    message: str

    model_config = ConfigDict(from_attributes=True)
