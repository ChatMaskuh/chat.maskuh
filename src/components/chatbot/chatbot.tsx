"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, UserRound, Loader2, BotMessageSquare } from "lucide-react";
import { chat } from "@/ai/flows/chatbot";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollAreaViewport = scrollAreaRef.current.querySelector('div');
      if (scrollAreaViewport) {
        scrollAreaViewport.scrollTo({
          top: scrollAreaViewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const botResponse = await chat(input);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex w-full h-full bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      {/* Kolom Sidebar Internal */}
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Riwayat Obrolan</h2>
        </div>
        <ScrollArea className="flex-1 p-2">
          {/* Placeholder untuk daftar chat */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            Belum ada riwayat.
          </div>
        </ScrollArea>
      </div>

      {/* Kolom Chat Utama */}
      <div className="w-2/3 flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://cdn-icons-png.flaticon.com/128/3273/3273828.png" alt="Chat.Maskuh" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
                Chat.Maskuh
            </h2>
            <p className="text-sm text-muted-foreground">Powered by Arlan Saputra</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
          {messages.map((message) => (
              <div
              key={message.id}
              className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : ""
              }`}
              >
              {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://cdn-icons-png.flaticon.com/128/3273/3273828.png" alt="Chat.Maskuh" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
              )}
              <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
              >
                  <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                      <AvatarImage src="https://cdn-icons-png.flaticon.com/128/1702/1702478.png" alt="User" />
                      <AvatarFallback>
                          <UserRound />
                      </AvatarFallback>
                  </Avatar>
              )}
              </div>
          ))}
          {isLoading && (
              <div className="flex items-end gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://cdn-icons-png.flaticon.com/128/3273/3273828.png" alt="Chat.Maskuh" />
                <AvatarFallback>CM</AvatarFallback>
              </Avatar>
              <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              </div>
          )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder="Ketik pesan Anda..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Kirim</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
