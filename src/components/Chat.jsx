import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { SendIcon, BotIcon, UserIcon } from "lucide-react";

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
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now(), content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content: "This is a simulated response. In a real application, you would call your LLM API here.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
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
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 