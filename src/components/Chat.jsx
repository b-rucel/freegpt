import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SendIcon,
  Sparkles,
  User2,
  Maximize2,
  Minimize2
} from "lucide-react";

// Import the CSS file
import "@/styles/chat.css";

// Message component to display individual messages
const Message = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
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
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
            <User2 className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Colorful typing indicator component
const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <Sparkles className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="px-4 py-2 rounded-lg bg-muted rounded-tl-none flex items-center">
        <div className="typing-dots-container">
          <div className="typing-dot typing-dot-1"></div>
          <div className="typing-dot typing-dot-2"></div>
          <div className="typing-dot typing-dot-3"></div>
        </div>
      </div>
    </div>
  );
};

// Helper function to handle browser prefixes for fullscreen API
const getFullscreenAPI = () => {
  const doc = document;
  
  return {
    requestFullscreen: element => {
      if (element.requestFullscreen) return element.requestFullscreen();
      if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
      if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
      if (element.msRequestFullscreen) return element.msRequestFullscreen();
    },
    exitFullscreen: () => {
      if (doc.exitFullscreen) return doc.exitFullscreen();
      if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
      if (doc.mozCancelFullScreen) return doc.mozCancelFullScreen();
      if (doc.msExitFullscreen) return doc.msExitFullscreen();
    },
    fullscreenElement: () => {
      return doc.fullscreenElement || 
             doc.webkitFullscreenElement || 
             doc.mozFullScreenElement || 
             doc.msFullscreenElement;
    }
  };
};

export function Chat() {
  // Initialize with a welcome message
  const [messages, setMessages] = useState([
    { id: "initial-message", content: "Hello! How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollAreaRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Prevent auto-scrolling to bottom on initial render
  const initialRenderComplete = useRef(false);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenAPI = getFullscreenAPI();
      setIsFullscreen(!!fullscreenAPI.fullscreenElement());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const fullscreenAPI = getFullscreenAPI();
    
    if (!isFullscreen) {
      if (chatContainerRef.current) {
        fullscreenAPI.requestFullscreen(chatContainerRef.current);
      }
    } else {
      fullscreenAPI.exitFullscreen();
    }
  };

  // Disable auto-scroll on initial render, but enable it for new messages
  useEffect(() => {
    if (!initialRenderComplete.current) {
      initialRenderComplete.current = true;
      return;
    }
    
    // Only auto-scroll for new messages (not on initial render)
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      // Find the actual scrollable element within the ScrollArea component
      const scrollableElement = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement && messages.length > 1) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [messages]);

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

  return (
    <Card 
      ref={chatContainerRef}
      className={`w-full max-w-3xl mx-auto h-[600px] flex flex-col shadow-lg ${isFullscreen ? 'chat-fullscreen' : ''}`}
    >
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          AI Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="ml-auto"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pt-4">
        <ScrollArea 
          ref={scrollAreaRef}
          className={`h-[calc(600px-8rem)] pr-4 ${isFullscreen ? 'scroll-area-fullscreen' : ''}`}
          scrollHideDelay={100}
          type="always"
          style={{ scrollBehavior: "auto" }}
        >
          {messages.map((message) => (
            <Message key={message.id} message={message} isUser={message.isUser} />
          ))}
          {isTyping && <TypingIndicator />}
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