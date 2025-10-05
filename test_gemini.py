# test_gemini.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

print("--- Starting Gemini Sanity Check ---")

try:
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        print("ERROR: GOOGLE_API_KEY not found in .env file.")
    else:
        print("API Key found. Configuring...")
        genai.configure(api_key=api_key)

        print("Listing available models...")
        # This loop will print every model your API key can actually see.
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)

        print("\nAttempting to create a model instance...")
        # We will use the most basic, stable model.
        # test_gemini.py (corrected line)
        model = genai.GenerativeModel('models/gemini-pro-latest')
        print("Model instance created successfully!")

        print("\nSending a test prompt...")
        response = model.generate_content("What is the capital of France?")
        print("Response received successfully!")
        print("\nGemini Response:", response.text)
        print("\n--- Sanity Check PASSED ---")

except Exception as e:
    print("\n--- Sanity Check FAILED ---")
    print("An error occurred:", e)