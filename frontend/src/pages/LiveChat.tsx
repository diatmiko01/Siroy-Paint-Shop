import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Definisikan tipe untuk setiap pesan
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export default function LiveChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: 'Halo! Selamat datang di SiroyAuto Live Support. Ada yang bisa saya bantu?',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: Date.now() + 1,
        text: 'Baik, terima kasih atas pertanyaan Anda. Mohon tunggu sebentar, tim kami akan segera memeriksa informasi yang Anda butuhkan.',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, agentResponse]);
    }, 1500);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" alt="Agent" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Budi (Support Agent)</p>
              <div className="flex items-center space-x-1">
                <Badge className="bg-green-500 h-2 w-2 p-0"></Badge>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <X size={16} />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={16}/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
              </div>
              {msg.sender === 'user' && (
                <Avatar className="h-8 w-8">
                   <AvatarFallback><User size={16}/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ketik pesan Anda di sini..."
              className="flex-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button type="submit" onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Kirim
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}