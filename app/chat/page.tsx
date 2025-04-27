"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
    text: string;
    isUser: boolean;
}

interface SentimentAnalysis {
    emotion: string;
    urgency: string;
    satisfaction: number;
}

interface QueryDetails {
    intent: string;
    sentiment: SentimentAnalysis;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! How can I assist you today?", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [queryDetails, setQueryDetails] = useState<QueryDetails | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Check API health on component mount
        checkHealth();
    }, []);

    const checkHealth = async () => {
        try {
            const response = await fetch('http://localhost:8000/health', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.status === "healthy") {
                setIsConnected(true);
            } else {
                throw new Error('API returned unhealthy status');
            }
        } catch (error) {
            console.error('API health check failed:', error);
            setIsConnected(false);
            // Retry after 5 seconds
            setTimeout(checkHealth, 5000);
            addMessage('Warning: Unable to connect to the support service. Please make sure the backend server is running on http://localhost:8000');
        }
    };

    const addMessage = (text: string, isUser: boolean = false) => {
        setMessages(prev => [...prev, { text, isUser }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isLoading) return;

        if (!isConnected) {
            addMessage('Error: Cannot send message. The support service is not connected. Please check if the backend server is running.');
            return;
        }

        // Add user message
        addMessage(text, true);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/query', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data); // Debug log
            
            // Ensure we have valid data
            if (!data || typeof data.response !== 'string') {
                throw new Error('Invalid response format from server');
            }
            
            // Add bot response
            addMessage(data.response);
            
            // Update query details if we have valid data
            if (data.intent && data.sentiment) {
                console.log('Setting query details:', data.sentiment); // Debug log
                const sentiment = data.sentiment;
                setQueryDetails({
                    intent: String(data.intent),
                    sentiment: {
                        emotion: String(sentiment.emotion || 'neutral'),
                        urgency: String(sentiment.urgency || 'medium'),
                        satisfaction: Number(sentiment.satisfaction || 5)
                    }
                });
            } else {
                console.log('Missing intent or sentiment data:', data); // Debug log
                // Set default values if missing
                setQueryDetails({
                    intent: String(data.intent || 'unknown'),
                    sentiment: {
                        emotion: 'neutral',
                        urgency: 'medium',
                        satisfaction: 5
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('I apologize, but I encountered an error while processing your request. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-4">
                <Card className="overflow-hidden">
                    <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                        <h1 className="text-2xl font-bold">AI Customer Support</h1>
                        <div className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                    </div>
                    
                    <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.isUser
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >
                                    <div className="text-sm mb-1">
                                        {message.isUser ? 'You' : 'Support Bot'}
                                    </div>
                                    <div>{message.text}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your query here..."
                                disabled={isLoading || !isConnected}
                            />
                            <Button type="submit" disabled={isLoading || !isConnected}>
                                Send
                            </Button>
                        </div>
                    </form>
                </Card>

                {queryDetails && (
                    <Card className="mt-4 p-4">
                        <h2 className="text-lg font-semibold mb-2">Query Details</h2>
                        <div className="space-y-2">
                            <p><strong>Intent:</strong> {queryDetails.intent}</p>
                            <div>
                                <strong>Sentiment Analysis:</strong>
                                <ul className="list-disc list-inside ml-4">
                                    <li>
                                        <strong>Emotion:</strong>{" "}
                                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                            queryDetails.sentiment.emotion === 'positive' ? 'bg-green-100 text-green-800' :
                                            queryDetails.sentiment.emotion === 'frustrated' ? 'bg-red-100 text-red-800' :
                                            queryDetails.sentiment.emotion === 'confused' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {queryDetails.sentiment.emotion}
                                        </span>
                                    </li>
                                    <li>
                                        <strong>Urgency Level:</strong>{" "}
                                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                            queryDetails.sentiment.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                            queryDetails.sentiment.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {queryDetails.sentiment.urgency}
                                        </span>
                                    </li>
                                    <li>
                                        <strong>Satisfaction Score:</strong>{" "}
                                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                            queryDetails.sentiment.satisfaction >= 7 ? 'bg-green-100 text-green-800' :
                                            queryDetails.sentiment.satisfaction >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {queryDetails.sentiment.satisfaction}/10
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </main>
    );
}

