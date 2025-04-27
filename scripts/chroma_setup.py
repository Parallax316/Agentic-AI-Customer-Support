import chromadb
import os

# Configure paths relative to the project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Get project root (one level up from scripts)
DB_PATH = os.path.join(PROJECT_ROOT, 'chroma_db') # Changed from absolute path

# Create persistent client
client = chromadb.PersistentClient(path=DB_PATH)

# Create collection with metadata
collection = client.create_collection(
    name="customer_support_docs",
    metadata={"hnsw:space": "cosine", "embedding": "text-embedding-3-small"}
)

print(f"Successfully created collection '{collection.name}'")
print(f"Database initialized at: {os.path.abspath(DB_PATH)}")