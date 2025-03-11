import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { SendIcon, BotIcon, UserIcon, MinimizeIcon, MaximizeIcon } from "lucide-react";

// Message component to display individual messages
const Message = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary">
          <BotIcon className="h-4 w-4 text-primary-foreground" />
        </Avatar>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-secondary">
          <UserIcon className="h-4 w-4 text-secondary-foreground" />
        </Avatar>
      )}
    </div>
  );
};

// Typing indicator component
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 text-muted-foreground text-sm ml-12 mb-4">
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full"></div>
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full animation-delay-200"></div>
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full animation-delay-400"></div>
    </div>
  );
};

export function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ensure chat visibility after initial page load
  useEffect(() => {
    // Force visibility after a short delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now(), content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Call the Cloudflare Workers AI endpoint
      const response = await fetch('https://workers-ai.brucelim.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage = {
        id: Date.now() + 1,
        content: data.response || "Sorry, I couldn't generate a response.",
        isUser: false,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  // Save chat state to localStorage to persist between page loads
  useEffect(() => {
    if (messages.length > 1) { // Only save if we have more than the initial message
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat state from localStorage on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
  }, []);

  // Save visibility state to localStorage
  useEffect(() => {
    localStorage.setItem('chatVisible', JSON.stringify(isVisible));
  }, [isVisible]);

  // Load visibility state from localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('chatVisible');
    if (savedVisibility !== null) {
      try {
        setIsVisible(JSON.parse(savedVisibility));
      } catch (e) {
        console.error('Error parsing saved visibility:', e);
      }
    }
  }, []);

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        <BotIcon className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
        >
          <MinimizeIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(600px-8rem)] pr-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} isUser={message.isUser} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 