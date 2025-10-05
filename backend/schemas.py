# backend/schemas.py
import strawberry
import datetime
from typing import List, Optional

# We define the GraphQL types here. They will often mirror our SQLAlchemy models,
# but they represent the API's public-facing data shape, not the database structure.

@strawberry.type
class ProductType:
    product_id: int
    name: str
    category: str
    price: float  # GraphQL typically uses Float for numeric types
    created_at: datetime.datetime

@strawberry.type
class UserType:
    user_id: int
    email: str
    country: Optional[str] # Mark as optional if it can be null
    age: Optional[int]
    created_at: datetime.datetime

# We can add more types like OrderType, ReviewType later as we build more queries.
# Starting with these two is perfect for our first step.