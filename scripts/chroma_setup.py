import chromadb
import os

# Configure paths
DB_PATH = os.path.join('c:\\Users\\simar\\Desktop\\AI_powered_customer support', 'chroma_db')

# Create persistent client
client = chromadb.PersistentClient(path=DB_PATH)

# Create collection with metadata
collection = client.create_collection(
    name="customer_support_docs",
    metadata={"hnsw:space": "cosine", "embedding": "text-embedding-3-small"}
)

print(f"Successfully created collection '{collection.name}'")
print(f"Database initialized at: {os.path.abspath(DB_PATH)}")