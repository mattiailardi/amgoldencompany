
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "assistant" | "user";
  timestamp: Date;
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Ciao! Sono il tuo assistente. Posso aiutarti a trovare informazioni, analizzare dati o eseguire operazioni nel sistema. Come posso aiutarti oggi?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // For now, we'll use a simulated response
      // In the future, this would call an AI assistant API
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateSimpleResponse(input),
          role: "assistant",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Errore",
        description: "Non è stato possibile elaborare la richiesta",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const generateSimpleResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("ciao") || lowerInput.includes("salve")) {
      return "Ciao! Come posso aiutarti oggi?";
    } else if (lowerInput.includes("vendite") || lowerInput.includes("incassi")) {
      return "Posso aiutarti ad analizzare le vendite. Vuoi vedere un riepilogo delle vendite recenti?";
    } else if (lowerInput.includes("magazzino") || lowerInput.includes("prodotti")) {
      return "Posso mostrarti informazioni sul magazzino. Vuoi vedere i prodotti con scorte basse?";
    } else if (lowerInput.includes("menu") || lowerInput.includes("piatti")) {
      return "Posso aiutarti a gestire il menu. Vuoi vedere i piatti più venduti?";
    } else if (lowerInput.includes("clienti") || lowerInput.includes("customer")) {
      return "Posso aiutarti a trovare informazioni sui clienti. Vuoi un elenco dei clienti più frequenti?";
    } else {
      return "Non sono sicuro di aver capito la tua richiesta. Puoi chiedere informazioni su vendite, magazzino, menu o clienti?";
    }
  };

  return (
    <div className="container py-6 h-screen flex flex-col">
      <div className="flex items-center mb-6">
        <Bot className="h-8 w-8 text-purple-600 mr-3" />
        <h1 className="text-2xl font-bold">Assistente IA</h1>
      </div>
      
      <Card className="flex-1 mb-4 border-gray-200">
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div 
                    className={`
                      flex items-start gap-2 max-w-[80%] rounded-lg p-3
                      ${message.role === "assistant" 
                        ? "bg-gray-100 text-gray-800" 
                        : "bg-purple-600 text-white"}
                    `}
                  >
                    {message.role === "assistant" && (
                      <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <User className="h-5 w-5 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Scrivi un messaggio..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              L'assistente può aiutarti a cercare dati, analizzare informazioni e gestire le operazioni nel sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
