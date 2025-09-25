import os
import json
import time
from pymongo import MongoClient
import google.generativeai as genai
from dotenv import load_dotenv

# --- Configuration & Initialization ---

# 1. Load environment variables once from .env file
load_dotenv()

# 2. Configure API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

# 3. Configure Database connection
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI environment variable not set.")
DB_NAME = "farmers"
COLLECTION_NAME = "schemes"

# 4. ✅ FIXED: Configure the Gemini Model and instantiate it ONCE
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')
print("Gemini model initialized successfully.")

# --- Main Logic ---

def get_structured_documents(document_text, gemini_model):
    """
    Calls the Gemini API to parse the document text string using a pre-initialized model.
    """
    prompt = f"""
    Analyze the following text which lists required documents for a scheme. Your task is to extract each document and classify it.

    **Instructions:**
    1. Identify each distinct document mentioned.
    2. Determine if a document is "Required" or "Optional". A document is "Optional" ONLY if the text explicitly states a condition like "(if applicable)", "(only for...)", or "(wherever applicable)". All other documents are "Required".
    3. Provide a brief, clean description for each document.
    4. Return your response as a valid JSON array of objects. Each object must have three keys: "name", "status", and "description".
    5. **IMPORTANT**: Do not add any text, explanation, or markdown formatting (like ```json) before or after the JSON array. Your entire output must be only the JSON array.

    **Text to Analyze:**
    "{document_text}"

    **Example Output Format:**
    [
      {{"name": "Aadhaar Card", "status": "Required", "description": "Copy of Aadhaar Card"}},
      {{"name": "Disability Certificate", "status": "Optional", "description": "Issued by Competent Authority (only for PWDs, if applicable)"}}
    ]
    """
    try:
        # Call the API using the provided model object
        response = gemini_model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"Error processing text: '{document_text}'. Error: {e}")
        return None


def process_all_schemes():
    """
    Connects to MongoDB, fetches schemes, processes them, and updates them.
    """
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    schemes_to_process = collection.find({"documents_structured": {"$exists": False}})

    print("Starting to process schemes...")
    for scheme in schemes_to_process:
        scheme_id = scheme["_id"]
        original_doc_text = scheme.get("documents", "")

        if not original_doc_text:
            print(f"Skipping scheme {scheme_id} due to empty 'documents' field.")
            continue

        print(f"Processing scheme: {scheme.get('scheme_name', 'N/A')}")
        
        # ✅ FIXED: Pass the initialized model into the function
        structured_data = get_structured_documents(original_doc_text, model)

        if structured_data:
            collection.update_one(
                {"_id": scheme_id},
                {"$set": {"documents_structured": structured_data}}
            )
            print(f"  ✅ Successfully updated scheme {scheme_id}")
        else:
            print(f"  ❌ Failed to process scheme {scheme_id}")

        time.sleep(1)

    print("Processing complete.")
    client.close()

# --- Run the Script ---
if __name__ == "__main__":
    process_all_schemes()