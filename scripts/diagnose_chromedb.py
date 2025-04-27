import chromadb
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# Configuration
# Use relative path for portability
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, 'chroma_db') # Changed from absolute path

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=DB_PATH)
collection = client.get_collection("customer_support_docs")

# Load the model once at startup
print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")

def query_documents(query_text, n_results=3):
    """
    Query the ChromaDB collection and return relevant documents.
    
    Args:
        query_text (str): The search query
        n_results (int): Number of results to return
        
    Returns:
        list: Relevant documents and their metadata
    """
    # Generate embedding for the query
    query_embedding = model.encode(query_text).tolist()
    
    # Query using the embedding
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    return format_results(results)

def format_results(results):
    """Format the query results into a more readable structure"""
    formatted_results = []
    
    # Extract the results
    documents = results.get('documents', [[]])[0]
    metadatas = results.get('metadatas', [[]])[0]
    distances = results.get('distances', [[]])[0]
    
    # Format each result
    for i, (doc, meta, distance) in enumerate(zip(documents, metadatas, distances)):
        # Calculate relevance score (1 - distance, since smaller distance means higher relevance)
        relevance = round((1 - distance) * 100, 2) if distance <= 1 else 0
        
        # Extract a short snippet from the document (first 150 chars)
        snippet = doc[:150] + "..." if len(doc) > 150 else doc
        
        # Add to formatted results
        formatted_results.append({
            "rank": i + 1,
            "source": meta.get('source', 'Unknown'),
            "relevance_score": f"{relevance}%",
            "snippet": snippet,
            "raw_distance": distance
        })
    
    return formatted_results

def interactive_testing():
    """Interactive testing interface for retrieval functionality"""
    print("\n===== ChromaDB Retrieval Testing =====")
    print("Type 'exit' to quit the program")
    
    while True:
        query = input("\nEnter your query: ").strip()
        
        if query.lower() == 'exit':
            print("Exiting program...")
            break
            
        # Get the number of results to return
        try:
            n_results = int(input("Number of results to return (default 3): ") or 3)
        except ValueError:
            n_results = 3
            
        # Query the database
        results = query_documents(query, n_results)
        
        # Display results
        print("\n----- Search Results -----")
        if not results:
            print("No matching documents found.")
        else:
            for result in results:
                print(f"\nRank: {result['rank']} - {result['source']} (Relevance: {result['relevance_score']})")
                print(f"Raw distance: {result.get('raw_distance')}")
                print(f"Snippet: {result['snippet']}")
                
        print("\n---------------------------")

if __name__ == '__main__':
    try:
        # Check if collection exists
        collections = client.list_collections()
        collection_names = [col.name for col in collections]
        
        if "customer_support_docs" not in collection_names:
            print(f"Error: 'customer_support_docs' collection not found!")
            print(f"Available collections: {collection_names}")
            exit(1)
            
        # Print collection info
        collection_info = collection.get(include=[])
        doc_count = len(collection_info['ids'])
        print(f"Connected to ChromaDB at {DB_PATH}")
        print(f"Collection 'customer_support_docs' contains {doc_count} documents")
        
        # Run the interactive testing
        interactive_testing()
        
    except Exception as e:
        print(f"Error: {str(e)}")