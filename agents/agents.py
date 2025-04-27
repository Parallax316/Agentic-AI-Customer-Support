from crewai import Agent  
from textwrap import dedent  

class SupportAgents:  
    def __init__(self):  
        # Intent Recognition Agent  
        self.intent_agent = Agent(  
            role="Intent Classifier",  
            goal="Classify user queries into FAQs, complaints, or troubleshooting.",  
            backstory="You analyze text to determine the user's intent.",  
            verbose=True  
        )  
          
        # Retrieval Agent  
        self.retrieval_agent = Agent(  
            role="Knowledge Retriever",  
            goal="Fetch relevant documents from ChromaDB based on the user's query.",  
            backstory="You use embeddings to find the best-matching support articles.",  
            verbose=True  
        )  
          
        # Response Agent  
        self.response_agent = Agent(  
            role="Support Responder",  
            goal="Generate helpful answers using RAG and escalate if needed.",  
            backstory="You craft responses using AI and company knowledge.",  
            verbose=True  
        )  
        
        # In agents.py, add:
        self.sentiment_agent = Agent(
           role="Sentiment Analyzer",
           goal="Detect customer sentiment and urgency in support queries",
           backstory="You analyze text to determine emotion, frustration level, and urgency.",
           verbose=True
        )
        
        
        