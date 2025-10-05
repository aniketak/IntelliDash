# backend/queries.py
import strawberry
from typing import List, Any
from strawberry.types import Info
from sqlalchemy import func, desc, cast, Date  # Make sure 'desc' is imported
import decimal

from .schemas import ProductType, UserType
from . import models
from .ai_service import query_with_langchain

# Define the custom JSON scalar type
JSON = strawberry.scalar(
    Any,
    serialize=lambda v: v,
    parse_value=lambda v: v,
    description="Generic JSON scalar type for unstructured data",
)
@strawberry.type
class MonthlyRevenue:
    month: str # e.g., "2023-01"
    revenue: float
# --- CORRECT PLACEMENT OF THE NEW TYPE ---
# Define the type for our chart data at the top level of the module.
@strawberry.type
class SalesByCategory:
    category: str
    total_sales: float

# --- SINGLE, UNIFIED QUERY CLASS ---
@strawberry.type
class Query:
    @strawberry.field
    def products(self, info: Info) -> List[ProductType]:
        db = info.context["db"]
        return db.query(models.Product).all()

    @strawberry.field
    def users(self, info: Info) -> List[UserType]:
        db = info.context["db"]
        return db.query(models.User).all()

    @strawberry.field
    def product(self, product_id: int, info: Info) -> ProductType:
        db = info.context["db"]
        product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
        if not product:
            raise Exception(f"Product with ID {product_id} not found.")
        return product
    
    @strawberry.field
    def totalRevenue(self, info: Info) -> float:
        db = info.context["db"]
        total = db.query(func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity))\
                  .join(models.Order)\
                  .filter(models.Order.status == 'completed')\
                  .scalar()
        return float(total) if total is not None else 0.0

    @strawberry.field
    def totalOrders(self, info: Info) -> int:
        db = info.context["db"]
        total = db.query(func.count(models.Order.order_id)).scalar()
        return total if total is not None else 0

    @strawberry.field
    def totalCustomers(self, info: Info) -> int:
        db = info.context["db"]
        total = db.query(func.count(models.User.user_id)).scalar()
        return total if total is not None else 0

    @strawberry.field
    def averageOrderValue(self, info: Info) -> float:
        db = info.context["db"]
        completed_orders_count = db.query(func.count(models.Order.order_id))\
                                   .filter(models.Order.status == 'completed')\
                                   .scalar()
        
        if completed_orders_count is None or completed_orders_count == 0:
            return 0.0

        total_revenue_val = db.query(func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity))\
                              .join(models.Order)\
                              .filter(models.Order.status == 'completed')\
                              .scalar()

        if total_revenue_val is None:
            return 0.0
        
        return float(total_revenue_val) / completed_orders_count

    # NEW RESOLVER for the dashboard chart, now correctly placed.
    @strawberry.field
    def salesPerCategory(self, info: Info) -> List[SalesByCategory]:
        """Calculates the total sales for each product category."""
        db = info.context["db"]
        
        results = (
            db.query(
                models.Product.category,
                func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity).label("total_sales")
            )
            .join(models.OrderItem, models.Product.product_id == models.OrderItem.product_id)
            .group_by(models.Product.category)
            .order_by(desc("total_sales"))
            .all()
        )
        
        # Manually construct the result to match the Strawberry type
        return [SalesByCategory(category=row.category, total_sales=float(row.total_sales)) for row in results]

    @strawberry.field
    def queryNaturalLanguage(self, prompt: str) -> JSON:
        if not prompt:
            raise Exception("Prompt cannot be empty.")
        
        result = query_with_langchain(prompt)
        
        if result["success"]:
            return { "result": result["data"], "prompt": prompt } # Pass prompt back
        else:
            return { "error": result["error"] }
    
    @strawberry.field
    def monthlyRevenueTrend(self, info: Info) -> List[MonthlyRevenue]:
        """Calculates the total revenue for each month."""
        db = info.context["db"]
        
        # This is a more advanced query. We extract the year and month,
        # group by it, and order it to create a proper time-series.
        results = (
            db.query(
                # Truncate the date to the month and cast to string for the label
                func.to_char(models.Order.created_at, 'YYYY-MM').label("month"),
                func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity).label("revenue")
            )
            .join(models.OrderItem, models.Order.order_id == models.OrderItem.order_id)
            .filter(models.Order.status == 'completed')
            .group_by("month")
            .order_by("month")
            .all()
        )
        
        return [MonthlyRevenue(month=row.month, revenue=float(row.revenue)) for row in results]