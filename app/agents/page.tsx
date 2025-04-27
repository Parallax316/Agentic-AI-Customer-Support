"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Brain, Database, Gauge, Search, Settings, Zap } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  name: string
  role: string
  description: string
  icon: React.ElementType
  status: "active" | "idle" | "offline"
  performance: number
  queries: number
  specialization: string[]
}

const agents: Agent[] = [
  {
    id: "coordinator",
    name: "Coordinator",
    role: "Lead Agent",
    description: "Manages conversation flow and delegates tasks to specialized agents",
    icon: Bot,
    status: "active",
    performance: 95,
    queries: 1024,
    specialization: ["Task Management", "Delegation", "Conversation Flow"],
  },
  {
    id: "search",
    name: "Search Agent",
    role: "Information Retrieval",
    description: "Specialized in finding relevant information from knowledge base",
    icon: Search,
    status: "active",
    performance: 92,
    queries: 876,
    specialization: ["Information Retrieval", "Document Search", "Relevance Ranking"],
  },
  {
    id: "knowledge",
    name: "Knowledge Agent",
    role: "Domain Expert",
    description: "Provides deep domain knowledge and technical expertise",
    icon: Brain,
    status: "active",
    performance: 88,
    queries: 654,
    specialization: ["Technical Support", "Product Knowledge", "Troubleshooting"],
  },
  {
    id: "resolver",
    name: "Resolver Agent",
    role: "Solution Provider",
    description: "Formulates comprehensive solutions based on gathered information",
    icon: Zap,
    status: "idle",
    performance: 90,
    queries: 789,
    specialization: ["Problem Solving", "Solution Formulation", "Action Planning"],
  },
  {
    id: "sentiment",
    name: "Sentiment Agent",
    role: "Emotion Analyzer",
    description: "Analyzes user sentiment and adjusts response tone accordingly",
    icon: Gauge,
    status: "active",
    performance: 87,
    queries: 543,
    specialization: ["Sentiment Analysis", "Emotion Detection", "Tone Adjustment"],
  },
  {
    id: "database",
    name: "Database Agent",
    role: "Data Manager",
    description: "Handles database operations and customer record management",
    icon: Database,
    status: "offline",
    performance: 85,
    queries: 432,
    specialization: ["Data Retrieval", "Record Management", "Query Processing"],
  },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Management</h1>
          <p className="text-muted-foreground">Monitor and configure your multi-agent system</p>
        </div>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Active: 4
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              Idle: 1
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-500"></span>
              Offline: 1
            </Badge>
          </div>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <AvatarFallback>
                          <agent.icon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.role}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          agent.status === "active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : agent.status === "idle"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }
                      `}
                    >
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span className="font-medium">{agent.performance}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {agent.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="text-sm text-muted-foreground">{agent.queries.toLocaleString()} queries handled</div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedAgent(agent)}>
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 bg-primary/10">
                        <AvatarFallback>
                          <agent.icon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{agent.performance}%</span>
                          <Progress value={agent.performance} className="h-2 w-24" />
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            agent.status === "active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : agent.status === "idle"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          }
                        `}
                      >
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedAgent(agent)}>
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedAgent && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback>
                    <selectedAgent.icon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedAgent.name} Configuration</CardTitle>
                  <CardDescription>{selectedAgent.role}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Agent Status</h3>
                    <div className="flex gap-2">
                      <Button variant={selectedAgent.status === "active" ? "default" : "outline"} size="sm">
                        Active
                      </Button>
                      <Button variant={selectedAgent.status === "idle" ? "default" : "outline"} size="sm">
                        Idle
                      </Button>
                      <Button variant={selectedAgent.status === "offline" ? "default" : "outline"} size="sm">
                        Offline
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Response Priority</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Low
                      </Button>
                      <Button variant="default" size="sm">
                        Medium
                      </Button>
                      <Button variant="outline" size="sm">
                        High
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6">
                      + Add
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Integration Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Knowledge Base</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Connected</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">API Access</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Limited</span>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="pt-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Response Time</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">1.2s</div>
                        <p className="text-xs text-muted-foreground">-0.3s from average</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Accuracy</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">+2% from average</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Utilization</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground">+5% from last week</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Performance Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground">Performance chart would be displayed here</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="logs" className="pt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Task #{i}</span>
                            <span className="text-muted-foreground">
                              {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1">
                            {i % 2 === 0
                              ? "Successfully processed user query and provided relevant information."
                              : "Collaborated with Knowledge Agent to resolve technical issue."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

