import chromadb
import os
import json
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

class RAGPipeline:  
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Configuration
        # Use relative path for portability
        self.DB_PATH = os.path.join('..', 'chroma_db') # Changed from absolute path
        self.OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
        self.OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(path=self.DB_PATH)
        self.collection = self.client.get_collection("customer_support_docs")

        # Initialize embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def retrieve_documents(self, query: str, n_results: int = 3) -> list:
        """Retrieve relevant context from ChromaDB"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode(query).tolist()
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            # Format results
            context = []
            for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
                context.append({
                    'source': meta['source'],
                    'content': doc
                })
            return context
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return []

    def generate_response(self, query: str, context: list) -> str:
        """Generate response using OpenRouter's API"""
        if not self.OPENROUTER_API_KEY:
            return "Error: OPENROUTER_API_KEY not found in environment variables"

        system_prompt = """You are a customer support assistant. Answer the query using the provided context. \
            If unsure, say you don't know. Keep responses concise and helpful."""

        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Query: {query}\nContext: {json.dumps(context)}"}
            ]

            payload = {
                "model":"openai/gpt-4o-mini",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500
            }

            headers = {
                "Authorization": f"Bearer {self.OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://github.com/your-repository",
                "X-Title": "Customer Support Bot"
            }

            response = requests.post(self.OPENROUTER_URL, json=payload, headers=headers)
            response.raise_for_status()
            
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Error generating response: {str(e)}"

    def interactive_query(self):
        """Interactive query interface"""
        print("\n=== Customer Support RAG System ===")
        print("Type 'exit' to quit\n")

        while True:
            query = input("Customer query: ")
            if query.lower() == 'exit':
                break

            # Get relevant context
            context = self.retrieve_documents(query)
            if not context:
                print("No relevant documents found\n")
                continue

            # Generate and display response
            response = self.generate_response(query, context)
            print("\nAssistant:", response)
            print("\n" + "="*50 + "\n")

if __name__ == '__main__':
    rag = RAGPipeline()
    if not rag.OPENROUTER_API_KEY:
        print("Error: OPENROUTER_API_KEY not found in .env file")
    else:
        rag.interactive_query()