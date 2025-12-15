from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="llama3.2")

template = """
You are an expert in answering questions about all schemes for farmers in India.

Use the following context from the scheme database to answer the user's question.
If you don't know the answer based on the context, say so - don't make up information.

Context:
{context}

Question: {question}

Answer:
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def format_docs(docs):
    """Format retrieved documents into a readable context string."""
    return "\n\n".join([f"Scheme: {doc.page_content}" for doc in docs])

while True:
    print("\n\n-------------------------------")
    question = input("Ask your question (q to quit): ")
    print("\n\n")
    if question == "q":
        break
    
    # Retrieve relevant documents
    retrieved_docs = retriever.invoke(question)
    context = format_docs(retrieved_docs)
    
    # Generate answer using context and question
    result = chain.invoke({"context": context, "question": question})
    print("Answer:", result)
    print("\n[Retrieved", len(retrieved_docs), "relevant schemes]")