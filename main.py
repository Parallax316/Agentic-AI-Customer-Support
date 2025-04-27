from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel  
from scripts.rag import RAGPipeline
from agents.agents import SupportAgents
from textwrap import dedent
from crewai import Task, Crew
import json
from typing import Dict, Any
import re

app = FastAPI(title="AI Customer Support API")

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600  # Cache preflight requests for 1 hour
)  

# Initialize components
rag = RAGPipeline()  
agents = SupportAgents()  

class QueryRequest(BaseModel):  
    text: str  

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"

@app.get("/health")
async def health_check():
    return HealthResponse(status="healthy")

@app.post("/api/query")  
async def handle_query(request: QueryRequest) -> Dict[str, Any]:
    try:
        # Step 1: Classify intent using Task and Crew
        intent_task = Task(
            description=dedent(f"""
                Classify this query: {request.text}  
                Options: faq, complaint, troubleshooting
            """),
            expected_output="The category of the query: either 'faq', 'complaint', or 'troubleshooting'",
            agent=agents.intent_agent
        )
        
        intent_crew = Crew(
            agents=[agents.intent_agent],
            tasks=[intent_task]
        )
        
        intent = intent_crew.kickoff()
        print(f"Intent result: {intent}")  # Debug log
        
        # Step 2: Analyze sentiment
        sentiment_task = Task(
            description=dedent(f"""
                Analyze the sentiment of this query: {request.text}
                
                Return a single word for each category:
                1. Emotion: frustrated, confused, neutral, or positive
                2. Urgency: low, medium, or high
                3. Satisfaction: a number from 1 to 10
                
                Format your response exactly like this:
                Emotion: [word]
                Urgency: [word]
                Satisfaction: [number]
            """),
            expected_output="Three lines with emotion, urgency, and satisfaction values",
            agent=agents.sentiment_agent
        )

        sentiment_crew = Crew(
            agents=[agents.sentiment_agent],
            tasks=[sentiment_task]
        )

        sentiment_result = sentiment_crew.kickoff()
        print(f"Raw sentiment result: {sentiment_result}")  # Debug log
        
        # Parse sentiment result
        sentiment_analysis = {
            "emotion": "neutral",
            "urgency": "medium",
            "satisfaction": 5
        }
        
        try:
            # Extract values using regex
            emotion_match = re.search(r'Emotion:\s*(\w+)', sentiment_result)
            urgency_match = re.search(r'Urgency:\s*(\w+)', sentiment_result)
            satisfaction_match = re.search(r'Satisfaction:\s*(\d+)', sentiment_result)
            
            if emotion_match:
                sentiment_analysis["emotion"] = emotion_match.group(1).lower()
            if urgency_match:
                sentiment_analysis["urgency"] = urgency_match.group(1).lower()
            if satisfaction_match:
                satisfaction = int(satisfaction_match.group(1))
                sentiment_analysis["satisfaction"] = max(1, min(10, satisfaction))  # Clamp between 1-10
                
            print(f"Parsed sentiment analysis: {sentiment_analysis}")  # Debug log
        except Exception as e:
            print(f"Error parsing sentiment: {e}")  # Debug log
        
        # Step 3: Retrieve documents and generate response
        context = rag.retrieve_documents(request.text)  
        response = rag.generate_response(request.text, context)  
        
        # Ensure response is a string
        if isinstance(response, dict):
            response = response.get('response', str(response))
        else:
            response = str(response)
        
        result = {
            "intent": str(intent),  # Ensure intent is a string
            "sentiment": sentiment_analysis,
            "response": response,
            "status": "success"
        }
        print(f"Final response: {result}")  # Debug log
        return result
        
    except Exception as e:
        print(f"Error in handle_query: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your query: {str(e)}"
        )