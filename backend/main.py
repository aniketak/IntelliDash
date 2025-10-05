# backend/main.py
import strawberry
from fastapi import FastAPI, Depends # <-- Import Depends
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.orm import Session # <-- Import Session
from fastapi.middleware.cors import CORSMiddleware
from .queries import Query
from .database import get_db # <-- Import get_db

# This is the function that will provide the context for each request
async def get_context(db: Session = Depends(get_db)):
    # It uses FastAPI's dependency injection to get a db session
    # and returns it in a dictionary.
    return {"db": db}

# Create the GraphQL schema
schema = strawberry.Schema(query=Query)

# Create the GraphQL router, passing in the schema AND our new context_getter
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context, # <-- This is the crucial line
)

# Create the main FastAPI app
app = FastAPI()

origins = [
    "http://localhost:5173",  # Example frontend development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],     # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allow all headers
)
# Add a root endpoint for basic health checks
@app.get("/")
def read_root():
    return {"message": "Welcome to the IntelliDash API!"}

# Add the GraphQL endpoint
app.include_router(graphql_app, prefix="/graphql")