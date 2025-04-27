import chromadb
import os
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# Configuration
# Use absolute paths to avoid confusion
KNOWLEDGE_DIR = os.path.join('c:\\Users\\simar\\Desktop\\AI_powered_customer support', 'customer_Support_bot data', 'knowledge_base')
DB_PATH = os.path.join('c:\\Users\\simar\\Desktop\\AI_powered_customer support', 'chroma_db')

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=DB_PATH)
collection = client.get_or_create_collection("customer_support_docs")

def check_file_contents():
    """Check if files exist and have content."""
    if not os.path.exists(KNOWLEDGE_DIR):
        print(f"Directory {KNOWLEDGE_DIR} not found!")
        return False
    
    files = [f for f in os.listdir(KNOWLEDGE_DIR) if f.endswith('.txt')]
    
    if not files:
        print(f"No .txt files found in {KNOWLEDGE_DIR}")
        return False
    
    print(f"Found {len(files)} files:")
    for filename in files:
        file_path = os.path.join(KNOWLEDGE_DIR, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                print(f"  {filename}: {len(content)} characters")
                if content:
                    print(f"    First 50 chars: {content[:50]}")
                else:
                    print("    FILE IS EMPTY")
        except Exception as e:
            print(f"  Error reading {filename}: {str(e)}")
    
    return True

def process_documents():
    """Process each document and store its embedding in ChromaDB."""
    # First check if files exist and have content
    if not check_file_contents():
        return
    
    # Initialize the sentence transformer model
    print("\nLoading sentence transformer model (this may take a moment)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully!")
    
    files_to_process = [f for f in os.listdir(KNOWLEDGE_DIR) if f.endswith('.txt')]
    print(f"\nProcessing {len(files_to_process)} files for embedding generation...")
    
    # First clear existing collection to avoid duplicates
    try:
        collection.delete(ids=collection.get()["ids"])
        print("Cleared existing collection.")
    except:
        print("Collection was empty or couldn't be cleared.")
    
    for filename in files_to_process:
        file_path = os.path.join(KNOWLEDGE_DIR, filename)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                
                if not content:
                    print(f"Skipping {filename}: File is empty")
                    continue
                
                # Generate embedding using Sentence Transformers
                print(f"Generating embedding for {filename}...")
                embedding = model.encode(content).tolist()  # Convert to list for ChromaDB
                
                # Store in ChromaDB
                collection.add(
                    documents=[content],
                    embeddings=[embedding],
                    metadatas=[{"source": filename}],
                    ids=[filename]
                )
                print(f"✓ Successfully processed {filename}")
        
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")

if __name__ == '__main__':
    process_documents()
    print("\nEmbedding generation complete.")
    print(f"Documents stored in ChromaDB at: {DB_PATH}")