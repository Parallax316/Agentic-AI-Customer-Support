# ✨ AI-Powered Customer Support System ✨


**Transform your customer service with an intelligent system that understands and responds with empathy.**

A sophisticated customer support system that leverages artificial intelligence to provide intelligent, 
context-aware responses to customer queries. The system combines RAG (Retrieval-Augmented Generation), 
sentiment analysis, and intent classification to deliver personalized and empathetic customer support.




## Features

### 1. Intelligent Query Processing
- **Intent Classification**: Automatically categorizes customer queries into:
  - FAQ requests
  - Complaints
  - Troubleshooting issues

### 2. Sentiment Analysis
- Analyzes customer messages to understand their emotional state
- Provides insights on:
  - Primary emotion (frustrated, confused, neutral, positive)
  - Urgency level (low, medium, high)
  - Customer satisfaction score (1-10)

### 3. Context-Aware Responses
- Uses RAG (Retrieval-Augmented Generation) to:
  - Retrieve relevant documents based on the query
  - Generate contextually appropriate responses
  - Maintain conversation coherence

### 4. Modern Web Interface
- Clean and intuitive chat interface built with **React**
- Real-time message updates
- Loading indicators for better UX
- Detailed query analysis display
- Responsive design for all devices

## 🔥 Key Features & Benefits

- **🚀 Understand Customer Needs Instantly:** Goes beyond keywords. Our **Intent Classification** identifies if a customer needs help with FAQs, has a complaint, or requires troubleshooting.
- **😊 Gauge Customer Emotions:** The **Sentiment Analysis** engine detects emotions (frustrated, confused, positive), urgency, and satisfaction levels, allowing for tailored, empathetic responses.
- **🧠 Provide Context-Aware Solutions:** Using **Retrieval-Augmented Generation (RAG)**, the system accesses relevant knowledge and crafts responses that are not just accurate but also maintain conversational flow.
- **💻 Sleek & Modern Interface:** A clean, real-time chat UI built with **React** ensures a smooth user experience on any device.

## 🛠️ Technologies Powering the System

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **CrewAI**: Framework for creating and managing AI agents
- **RAG Pipeline**: Custom implementation for document retrieval and response generation

### Frontend
- **React**: JavaScript library for building user interfaces
- **Fetch API / Axios**: Asynchronous API communication (or similar)

### AI/ML Components
- **Intent Classification**: AI agent for query categorization
- **Sentiment Analysis**: AI agent for emotional analysis
- **RAG System**: Document retrieval and response generation

## 🚀 Getting Started

**Important:** This project relies on a local ChromaDB vector database. You need to initialize it and populate it with embeddings from the provided knowledge base data before running the main application.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Parallax316/Agentic-AI-Customer-Support.git
    cd agentic-ai-support
    ```

2.  **Set up Backend & Environment:**
    - Create and activate virtual environment:
      ```bash
      python -m venv venv
      # Windows
      .\venv\Scripts\activate
      # Linux/Mac
      source venv/bin/activate
      ```
    - Install dependencies (including those for scripts):
      ```bash
      pip install -r requirements.txt
      ```

3.  **Set up ChromaDB Vector Database:**
    - Initialize the database and collection:
      ```bash
      python scripts/chroma_setup.py
      ```
    - Generate embeddings from knowledge base documents:
      *(This script reads data from `customer_Support_bot data/knowledge_base/`)*
      ```bash
      python scripts/generate_embeddings.py
      ```

4.  **Set up Frontend (React):**
    *(Assuming your React code is in a `frontend` subdirectory)*
    - Navigate to the frontend directory:
      ```bash
      # cd frontend  <- Uncomment and adjust if you have a frontend dir
      ```
    - Install frontend dependencies:
      ```bash
      # npm install 
      # or yarn install
      ```
    - Start the React development server:
      ```bash
      # npm start
      # or yarn start
      ```

5.  **Run the Backend Server:**
    - Start the FastAPI application:
      ```bash
      uvicorn main:app --reload
      ```
      The backend will be available at `http://localhost:8000`.

6.  **Access the application:**
    - Open your browser and navigate to the frontend URL (e.g., `http://localhost:3000`).

## 🔌 API Endpoints

### `POST /api/query`

- **Purpose**: Receives customer messages for processing.
- **Request Body**: `{ "text": "Your customer's message here" }`
- **Response Body**:
  ```json
  {
    "intent": "Detected intent (e.g., FAQ, Complaint)",
    "sentiment": {
      "emotion": "Detected emotion",
      "urgency": "Urgency level",
      "satisfaction": "Score (1-10)"
    },
    "response": "AI-generated response",
    "status": "success"
  }
  ```

## ⚙️ Scripts Overview

The `scripts/` directory contains modules and utilities supporting the application. **Note:** Several scripts interact with the local ChromaDB database (`./chroma_db/`) and the knowledge base data (`./customer_Support_bot data/knowledge_base/`). Paths are relative to the project root.

-   **`rag.py`**: 
    -   **Role**: Core Runtime Component.
    -   **Purpose**: Defines the `RAGPipeline` class used by `main.py`. Handles retrieving documents from the local ChromaDB and generating responses using the OpenRouter API.
-   **`chroma_setup.py`**:
    -   **Role**: **Required One-Time Setup.**
    -   **Purpose**: Initializes the persistent ChromaDB vector database locally and creates the `customer_support_docs` collection. **Must be run once by each user.**
-   **`generate_embeddings.py`**:
    -   **Role**: **Required Data Preparation.**
    -   **Purpose**: Reads text files from `./customer_Support_bot data/knowledge_base/`, generates vector embeddings, and stores them in the local ChromaDB. **Must be run after `chroma_setup.py` and whenever knowledge base files change.**
-   **`test_retrieval.py`**:
    -   **Role**: Utility / Testing.
    -   **Purpose**: Interactive tool to test document retrieval directly from the local ChromaDB.
-   **`diagnose_chromedb.py`**:
    -   **Role**: Utility / Testing.
    -   **Purpose**: Interactive tool to test the end-to-end retrieval process (including query embedding) against the local ChromaDB.
-   **`check.py`**:
    -   **Role**: Utility / Diagnostics.
    -   **Purpose**: Verifies the existence and content of the knowledge base text files in `./customer_Support_bot data/knowledge_base/`.

**Setup Workflow:** Run `python scripts/chroma_setup.py` once, then `python scripts/generate_embeddings.py` to populate your local database.

## ✨ Features in Detail

### Intent Classification
The system uses an AI agent to analyze customer queries and classify them into appropriate categories:
- FAQ: General information requests
- Complaint: Customer grievances or issues
- Troubleshooting: Technical or product-related problems

### Sentiment Analysis
The sentiment analysis agent provides detailed insights into customer emotions:
- Primary emotion detection
- Urgency level assessment
- Satisfaction scoring

### RAG Pipeline
The Retrieval-Augmented Generation system:
1. Retrieves relevant documents based on the query
2. Processes the context
3. Generates appropriate responses

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request with your enhancements.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FastAPI team for the excellent web framework
- CrewAI for the agent management system
- All contributors and maintainers of the open-source libraries used in this project