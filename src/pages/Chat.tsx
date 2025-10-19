import { useState, useRef, useEffect } from "react";
import { Send, Mic, Settings, ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "@/utils/constant";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Chat = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! I'm so excited to chat with you 💖 How are you feeling today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const navigate = useNavigate()
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [coins, setCoins] = useState(80);
  const [timeRemaining, setTimeRemaining] = useState(240);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { characterId } = useParams<{ characterId: string }>();
  const character = location.state?.character;
  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer for coin deduction
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up, deduct coins
          setCoins(current => Math.max(0, current - 20));
          return 240; // Reset to 4 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch(`${BASE_URL}/chat/${characterId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: inputText, chatId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error from AI");
      }
      if (data.chatId && !chatId) setChatId(data.chatId)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I couldn't respond right now 😔. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chat/history/${characterId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data && data.messages?.length) {
          setChatId(data._id);
          setMessages(
            data.messages.map((m: any, index: number) => ({
              id: index.toString(),
              text: m.text,
              sender: m.role === "ai" ? "ai" : "user",
              timestamp: new Date(m.createdAt),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatHistory();
  }, [characterId]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={character.avatar} alt={character.name} />
            <AvatarFallback>{character.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{character.name}</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Coin Timer */}
          <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{coins}</span>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs font-mono">{formatTime(timeRemaining)}</span>
          </div>

          <Button onClick={()=>navigate("/setting")} variant="ghost" size="sm" className="p-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.sender === "user"
                ? "bg-gradient-to-r from-primary to-accent text-white ml-12"
                : "bg-muted/80 text-foreground mr-12 relative"
                }`}
            >
              {message.sender === "ai" && (
                <div className="absolute -top-1 -right-1 text-xs opacity-30">💖</div>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/80 text-foreground max-w-xs px-4 py-3 rounded-2xl mr-12 relative">
              <div className="typing-animation flex space-x-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              </div>
              <div className="absolute -top-1 -right-1 text-xs opacity-30">💕</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Low Coins Warning */}
      {coins < 20 && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">
              ⚠️ Low on coins! You have {coins} coins remaining.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Watch Ad (+20)
              </Button>
              <Button size="sm" className="text-xs btn-romantic">
                Buy Coins
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12 rounded-full border-border/50 focus:border-primary bg-background/80"
              disabled={coins === 0}
            />
            <Button
              variant="ghost"
              size="sm"
              className={`absolute right-1 top-1 p-2 rounded-full ${coins === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}`}
              onClick={sendMessage}
              disabled={!inputText.trim() || coins === 0}
            >
              <Send className="w-4 h-4 text-primary" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full p-3 border-primary/30 hover:bg-primary/10"
            disabled={coins === 0}
          >
            <Mic className="w-4 h-4 text-primary" />
          </Button>
        </div>

        {coins === 0 && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Out of coins! Watch an ad or buy more to continue chatting.
          </p>
        )}
      </div>

      {/* Coin Purchase Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="hidden"></div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-gradient">
              💰 Get More Coins
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Chat costs 20 coins per minute. Choose how to get more:
              </p>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between rounded-xl">
                <span>Watch Ad</span>
                <Badge variant="secondary">+20 coins</Badge>
              </Button>

              <div className="grid gap-3">
                <Button variant="outline" className="justify-between rounded-xl">
                  <span>100 Coins</span>
                  <span className="text-primary font-semibold">₹49</span>
                </Button>
                <Button variant="outline" className="justify-between rounded-xl">
                  <span>500 Coins</span>
                  <div className="text-right">
                    <div className="text-primary font-semibold">₹199</div>
                    <div className="text-xs text-green-600">Best Value!</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-between rounded-xl">
                  <span>1000 Coins</span>
                  <span className="text-primary font-semibold">₹349</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;