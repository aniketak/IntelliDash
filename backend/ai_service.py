# backend/ai_service.py - THE FINAL VERSION

import os
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.agent_toolkits import create_sql_agent

load_dotenv()

if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL not found in environment variables.")

db = SQLDatabase.from_uri(db_url)

# This is the configuration we know works.
# We are using the exact model name that our sanity check just validated.
llm = ChatGoogleGenerativeAI(
    model="gemini-pro-latest", # <-- The proven model name
    temperature=0,
    convert_system_message_to_human=True, # Keep this for agent compatibility
)

# Use the most robust and compatible agent type.
sql_agent_executor = create_sql_agent(
    llm=llm,
    db=db,
    agent_type="tool-calling",
    verbose=True
)

def query_with_langchain(prompt: str):
    print(f"AI Service: Received prompt -> {prompt}")
    try:
        # Use a more robust invocation method for agents
        result = sql_agent_executor.invoke({"input": prompt})
        print(f"AI Service: Agent result -> {result}")
        return {"success": True, "data": result['output']}
    except Exception as e:
        print(f"AI Service: Error -> {e}")
        return {"success": False, "error": str(e)}