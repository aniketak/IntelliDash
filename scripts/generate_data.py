# scripts/generate_data.py
import sys
import os
import random
from faker import Faker
import faker_commerce   # 👈 for product names
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

# This is a bit of a hack to allow the script to import from the 'backend' directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database import engine
from backend.models import User, Product, Order, OrderItem, Review

# Configuration
NUM_USERS = 200
NUM_PRODUCTS = 100
NUM_ORDERS = 1000
MAX_REVIEWS_PER_PRODUCT = 5

fake = Faker()
fake.add_provider(faker_commerce.Provider)  # 👈 add the ecommerce provider

# Create a new session
Session = sessionmaker(bind=engine)
session = Session()

def generate_data():
    print("Deleting old data...")
    session.query(Review).delete()
    session.query(OrderItem).delete()
    session.query(Order).delete()
    session.query(Product).delete()
    session.query(User).delete()
    session.commit()
    print("Old data deleted.")

    # 1. Generate Users
    print("Generating users...")
    users = []
    for _ in range(NUM_USERS):
        user = User(
            email=fake.unique.email(),
            created_at=fake.date_time_between(start_date="-2y", end_date="now"),
            country=fake.country(),
            age=random.randint(18, 70),
            gender=random.choice(['male', 'female', 'other'])
        )
        users.append(user)
    session.add_all(users)
    session.commit()

    # 2. Generate Products
    print("Generating products...")
    products = []
    product_categories = ['Electronics', 'Books', 'Home & Kitchen', 'Apparel', 'Sports']
    for _ in range(NUM_PRODUCTS):
        product = Product(
            name=fake.ecommerce_name(),   # 👈 now works with faker-commerce
            category=random.choice(product_categories),
            price=round(random.uniform(5.0, 500.0), 2),
            created_at=fake.date_time_between(start_date="-3y", end_date="-1y")
        )
        products.append(product)
    session.add_all(products)
    session.commit()

    # 3. Generate Orders and OrderItems
    print("Generating orders and order items...")
    user_ids = [user.user_id for user in session.query(User).all()]
    product_list = session.query(Product).all()

    for _ in range(NUM_ORDERS):
        order_user = random.choice(user_ids)
        order_date = fake.date_time_between(start_date="-1y", end_date="now")
        order = Order(
            user_id=order_user,
            status=random.choice(['completed', 'shipped', 'cancelled', 'pending']),
            created_at=order_date
        )
        session.add(order)
        session.commit()  # Commit to get the order_id

        # Add items to this order
        num_items = random.randint(1, 5)
        for _ in range(num_items):
            product = random.choice(product_list)
            order_item = OrderItem(
                order_id=order.order_id,
                product_id=product.product_id,
                quantity=random.randint(1, 3),
                price_at_purchase=product.price
            )
            session.add(order_item)
    session.commit()

    # 4. Generate Reviews
    print("Generating reviews...")
    for product in product_list:
        num_reviews = random.randint(0, MAX_REVIEWS_PER_PRODUCT)
        # Avoid duplicate reviews from the same user for the same product
        review_user_ids = random.sample(user_ids, k=num_reviews) if num_reviews <= len(user_ids) else user_ids
        for review_user_id in review_user_ids:
            review = Review(
                product_id=product.product_id,
                user_id=review_user_id,
                rating=random.randint(1, 5),
                review_text=fake.paragraph(nb_sentences=3),
                created_at=fake.date_time_between(start_date=product.created_at, end_date="now")
            )
            session.add(review)
    session.commit()

    print("Data generation complete!")


if __name__ == "__main__":
    generate_data()
    session.close()
