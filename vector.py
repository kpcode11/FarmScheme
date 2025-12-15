from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd

df = pd.read_csv("updated_data.csv")
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db_location = "./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []
    
    for i, row in df.iterrows():
        document = Document(
            page_content=f"Name: {row['scheme_name']}. Details: {row['details']}. Benefits: {row['benefits']}. Eligibility: {row['eligibility']}. Application: {row['application']}. Documents: {row['documents']}. Level: {row['level']}. Category: {row['schemeCategory']}.",
            metadata={"slug": row["slug"], "tags": row["tags"]},
            id=str(i)
        )
        ids.append(str(i))
        documents.append(document)
        

vector_store = Chroma(
    collection_name="schemesInfo",
    persist_directory=db_location,
    embedding_function=embeddings
)

if add_documents:
    vector_store.add_documents(documents=documents, ids=ids)
    
retriever = vector_store.as_retriever(
    search_kwargs={"k": 5}
)