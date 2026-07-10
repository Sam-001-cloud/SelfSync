import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Send, Bot, User, Info } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const predefinedQuestions = [
  "How can I improve my sleep quality?",
  "What are some quick stress relief techniques?",
  "How much water should I drink daily?",
  "What are some easy healthy meal ideas?",
  "How can I start a meditation routine?",
  "What's a good beginner exercise plan?",
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I'm your wellness assistant. How can I help you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handlePredefinedQuestion = (question: string) => {
    setInput(question);
  };
  
  const generateResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('sleep') || lowerMsg.includes('insomnia')) {
      return "For better sleep quality, try to maintain a consistent sleep schedule, avoid screens 1 hour before bed, keep your bedroom cool and dark, and consider relaxation techniques like deep breathing or meditation. Also, limit caffeine and alcohol, especially in the evening.";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('anxiety')) {
      return "To relieve stress quickly, try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, and exhale for 8. Other effective methods include a short walk in nature, progressive muscle relaxation, or a quick mindfulness meditation. Regular exercise and adequate sleep are also important for long-term stress management.";
    } else if (lowerMsg.includes('water') || lowerMsg.includes('hydration')) {
      return "The standard recommendation is about 8 cups (64 ounces) of water daily, but your needs may vary based on activity level, climate, and overall health. A good rule of thumb is to drink when thirsty and aim for pale yellow urine. Remember that fruits, vegetables, and other beverages also contribute to your fluid intake.";
    } else if (lowerMsg.includes('meal') || lowerMsg.includes('diet') || lowerMsg.includes('food')) {
      return "Some easy, healthy meal ideas include: overnight oats with fruit for breakfast, grain bowls with vegetables and lean protein for lunch, and sheet pan dinners with protein and roasted vegetables for dinner. Meal prepping and keeping nutritious staples on hand can make healthy eating more convenient.";
    } else if (lowerMsg.includes('meditation') || lowerMsg.includes('mindfulness')) {
      return "To start meditating, begin with just 5 minutes daily. Find a quiet space, sit comfortably, and focus on your breath. When your mind wanders (which is normal), gently return focus to your breathing. Consider using a guided meditation app for structure. Consistency is more important than duration, so try to practice daily.";
    } else if (lowerMsg.includes('exercise') || lowerMsg.includes('workout')) {
      return "A good beginner exercise plan includes 150 minutes of moderate activity weekly (like brisk walking), plus strength training twice weekly. Start with 10-minute sessions if needed and gradually increase. Incorporate activities you enjoy, whether it's dancing, swimming, or cycling. Remember to warm up, cool down, and give your body recovery time.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return `Hello! I'm your AI wellness assistant. I can help with questions about nutrition, exercise, sleep, stress management, and other health topics. How can I assist you today?`;
    } else {
      return "Thank you for your question. As your wellness assistant, I'm here to provide general guidance on health, nutrition, exercise, sleep, and stress management. Could you provide more details so I can give you more specific advice tailored to your needs?";
    }
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Wellness Chat</h1>
          <p className="text-muted-foreground">
            Ask questions and get personalized health and wellness advice
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 to-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Your Wellness Assistant</h3>
                  <p className="opacity-90 text-muted-foreground text-sm">
                    Here to help with evidence-based wellness advice
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="border rounded-lg shadow-sm flex flex-col h-[550px]">
            <div className="flex-1 relative">
              <ScrollArea ref={scrollAreaRef} className="h-full overflow-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'flex-row-reverse'
                            : 'flex-row'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user'
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="break-words text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              message.role === 'user'
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="rounded-lg px-4 py-2 bg-muted">
                          <div className="flex items-center gap-1 h-5">
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            <div className="p-4 border-t bg-card">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {predefinedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handlePredefinedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your health and wellness questions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="shrink-0"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <span>This is a demo AI assistant. In a production app, this would connect to a real AI service.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
