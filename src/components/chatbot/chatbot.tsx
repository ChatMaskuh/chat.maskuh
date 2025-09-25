
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, UserRound, Loader2, PanelLeftClose, PanelLeftOpen, Menu, FolderKanban, GitBranch, BookText, Code, FileCode, Package, ComponentIcon, GraduationCap, FileQuestion, Star, Video, BookOpen, AlertTriangle } from "lucide-react";
import { chat } from "@/ai/flows/chatbot";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

type DocContent = {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const documentationContent: Record<string, DocContent> = {
    // Maskuh Learning Content
    'learning-getting-started': {
      title: 'Getting Started',
      icon: <GraduationCap className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Selamat datang di Chat.Maskuh! Ini adalah asisten AI yang dirancang untuk membantu Anda dalam berbagai tugas. Anda dapat berinteraksi dengannya layaknya mengobrol dengan teman.</p>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Cara Memulai:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-semibold">Ketik Pertanyaan:</span> Cukup ketik pesan atau pertanyaan Anda di kolom input di bagian bawah dan tekan Enter atau klik tombol kirim.</li>
              <li><span className="font-semibold">Tunggu Jawaban:</span> Chat.Maskuh akan memproses permintaan Anda dan memberikan respons dalam sekejap.</li>
              <li><span className="font-semibold">Jelajahi Personanya:</span> Coba ajukan pertanyaan matematika, sejarah, atau sekadar sapaan santai untuk melihat bagaimana ia merespons dengan persona yang berbeda.</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">Eksperimen adalah kunci! Jangan ragu untuk mencoba berbagai jenis pertanyaan.</p>
        </div>
      ),
    },
     'learning-basic-concepts': {
      title: 'Basic Concepts',
      icon: <FileQuestion className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Chat.Maskuh dibangun di atas beberapa teknologi modern. Memahami konsep dasarnya akan membantu Anda mengapresiasi cara kerjanya.</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Code className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Genkit Flow</h4>
                <p className="text-muted-foreground">Inti dari chatbot ini. Sebuah *flow* adalah serangkaian langkah yang dijalankan di server. Saat Anda mengirim pesan, Anda sebenarnya memanggil sebuah *flow* yang memproses pesan Anda dan menghasilkan respons dari model AI.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ComponentIcon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Prompt Engineering</h4>
                <p className="text-muted-foreground">Ini adalah seni merancang instruksi (prompt) untuk model AI. Prompt di `chatbot.ts` dirancang sedemikian rupa agar Chat.Maskuh memiliki persona yang unik dan dapat beralih peran sesuai konteks pertanyaan.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Server Actions (Next.js)</h4>
                <p className="text-muted-foreground">Aplikasi ini tidak memerlukan API Route tradisional. Fungsi `chat()` diekspor sebagai Server Action, memungkinkan komponen di sisi klien (`'use client'`) memanggil fungsi di sisi server secara langsung dan aman.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    'learning-tutorials': {
      title: 'Tutorials',
      icon: <Video className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm text-center">
          <Video className="h-16 w-16 mx-auto text-muted-foreground" />
          <h4 className="font-semibold">Segera Hadir!</h4>
          <p>Bagian ini akan berisi video tutorial langkah-demi-langkah tentang cara membangun, memodifikasi, dan memperluas fungsionalitas Chat.Maskuh.</p>
          <p className="text-xs text-muted-foreground">Nantikan pembaruan di masa mendatang.</p>
        </div>
      ),
    },
    'learning-case-studies': {
      title: 'Case Studies',
      icon: <BookOpen className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Chatbot seperti Chat.Maskuh memiliki banyak penerapan di dunia nyata. Berikut beberapa contoh kasus penggunaannya:</p>
          <ul className="list-disc list-inside space-y-3">
            <li><span className="font-semibold">Customer Service Otomatis:</span> Menjawab pertanyaan umum pelanggan 24/7, mengurangi beban tim support.</li>
            <li><span className="font-semibold">Asisten Pengembang:</span> Membantu developer dengan menjawab pertanyaan tentang kode, dokumentasi API, atau memberikan cuplikan kode.</li>
            <li><span className="font-semibold">Alat Edukasi Interaktif:</span> Menjadi tutor virtual yang dapat menjelaskan konsep-konsep kompleks dengan cara yang mudah dipahami.</li>
            <li><span className="font-semibold">Onboarding Karyawan Baru:</span> Memberikan informasi tentang perusahaan, kebijakan, dan tugas-tugas awal kepada karyawan baru.</li>
          </ul>
        </div>
      ),
    },
    'learning-tips-tricks': {
      title: 'Tips & Tricks',
      icon: <Star className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Maksimalkan pengalaman Anda dengan Chat.Maskuh menggunakan tips berikut:</p>
           <div className="p-3 bg-muted rounded-lg">
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-semibold">Jadilah Spesifik:</span> Semakin detail pertanyaan Anda, semakin akurat jawaban yang akan Anda dapatkan. Contoh: "Berapa hasil dari 15 dikali 24?" lebih baik daripada "Tolong hitung".</li>
              <li><span className="font-semibold">Berikan Konteks:</span> Jika pertanyaan Anda adalah lanjutan dari obrolan sebelumnya, coba ulangi sedikit konteksnya agar AI tidak bingung.</li>
              <li><span className="font-semibold">Gunakan Persona:</span> Jangan ragu untuk meminta AI bertindak sebagai seseorang. Contoh: "Jelaskan fotosintesis seolah-olah saya anak SD".</li>
              <li><span className="font-semibold">Periksa Fakta Penting:</span> Meskipun cerdas, AI bisa membuat kesalahan. Untuk informasi yang sangat krusial (seperti data sejarah), selalu baik untuk melakukan verifikasi silang.</li>
            </ul>
          </div>
          <div className="p-4 border border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
             <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Mengatasi Error "Too Many Requests"</h4>
                    <p className="text-yellow-700 dark:text-yellow-300/90 mt-1">Jika Anda mengirim terlalu banyak pesan dalam waktu singkat, terkadang Anda bisa melihat pesan error "429 Too Many Requests".</p>
                    <p className="text-yellow-700 dark:text-yellow-300/90 mt-2"><strong>Solusi:</strong> Cukup tunggu beberapa saat (sekitar 15-30 detik) sebelum mengirim pesan lagi. Ini akan memberi waktu bagi sistem untuk siap menerima permintaan Anda kembali.</p>
                </div>
            </div>
          </div>
        </div>
      ),
    },
    // Maskuh Documentation Content
    'app-menu': {
      title: 'APP MENU',
      icon: <Menu className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Chatbot ini dilatih dan dikembangkan oleh Arlan Saputra. Menu aplikasi dirancang untuk navigasi utama dan fungsionalitas. Saat ini, fokus utama adalah antarmuka chat, namun seiring berkembangnya aplikasi, menu-menu baru dapat ditambahkan di sidebar.</p>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Item Saat Ini:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-semibold">Dashboard:</span> Panel utama yang berisi dokumentasi dan riwayat (fitur mendatang).</li>
              <li><span className="font-semibold">Chat Interface:</span> Area utama tempat Anda berinteraksi dengan Chat.Maskuh.</li>
            </ul>
          </div>
        </div>
      ),
    },
    'structure': {
      title: 'STRUCTURE',
      icon: <FolderKanban className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Proyek ini dibangun menggunakan Next.js dengan App Router, yang memberikan struktur yang terorganisir dan skalabel.</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileCode className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">src/app/</h4>
                <p className="text-muted-foreground">Direktori utama untuk semua halaman dan rute aplikasi. `page.tsx` adalah halaman utama, dan `layout.tsx` adalah tata letak global.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ComponentIcon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">src/components/</h4>
                <p className="text-muted-foreground">Berisi semua komponen React yang dapat digunakan kembali, termasuk komponen UI dari `shadcn/ui`.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Code className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">src/ai/flows/</h4>
                <p className="text-muted-foreground">Logika utama untuk Generative AI menggunakan Genkit. `chatbot.ts` menangani alur percakapan.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">package.json</h4>
                <p className="text-muted-foreground">Mendefinisikan semua dependensi proyek (seperti React, Next.js, Tailwind CSS, Genkit) dan skrip (seperti `dev`, `build`).</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    'version': {
      title: 'Maskuh Version',
      icon: <GitBranch className="h-6 w-6" />,
      content: (
         <div className="space-y-2 text-sm">
          <p>Informasi versi dan teknologi yang digunakan dalam aplikasi ini.</p>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="font-semibold">Chat.Maskuh Version:</span>
            <span className="font-mono text-primary bg-primary-foreground/20 px-2 py-1 rounded-md">1.0.0</span>
          </div>
           <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="font-semibold">Next.js Version:</span>
            <span className="font-mono text-primary bg-primary-foreground/20 px-2 py-1 rounded-md">15.3.3</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="font-semibold">Genkit Version:</span>
            <span className="font-mono text-primary bg-primary-foreground/20 px-2 py-1 rounded-md">latest</span>
          </div>
        </div>
      ),
    },
    'api-docs': {
      title: 'API Route Documentation',
      icon: <BookText className="h-6 w-6" />,
      content: (
        <div className="space-y-4 text-sm">
          <p>Aplikasi ini tidak menggunakan API Route tradisional Next.js. Sebagai gantinya, ia menggunakan **Genkit Flows** yang diekspos sebagai Server Actions.</p>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Code className="h-5 w-5" /> `src/ai/flows/chatbot.ts`</h4>
            <p className="mb-2">File ini mendefinisikan logika inti dari chatbot:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold">`chatFlow`</span>: Sebuah alur Genkit yang menerima pesan pengguna, memanggil model Gemini dengan prompt yang telah ditentukan, dan mengembalikan respons teks.
              </li>
               <li>
                <span className="font-semibold">`chat(message)`</span>: Fungsi `async` yang diekspor dan dapat dipanggil langsung dari komponen klien (`'use client'`). Fungsi ini bertindak sebagai Server Action yang menjalankan `chatFlow` di sisi server.
              </li>
            </ul>
             <p className="mt-3 text-xs text-muted-foreground">Pendekatan ini menyederhanakan arsitektur dengan menghilangkan kebutuhan untuk membuat dan mengelola endpoint API secara manual.</p>
          </div>
        </div>
      ),
    },
  };

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
      let errorMessageText = "Maaf, terjadi kesalahan. Silakan coba lagi nanti.";
      if (error instanceof Error && error.message.includes("429")) {
        errorMessageText = "Waduh, sepertinya terlalu banyak permintaan dalam waktu singkat. Coba lagi dalam beberapa detik ya. Aku butuh sedikit waktu buat napas 😅.";
      }
      
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: errorMessageText,
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

  const renderDialog = () => {
    if (!activeDialog) return null;
    const doc = documentationContent[activeDialog];
    if (!doc) return null;

    return (
      <Dialog open={!!activeDialog} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {doc.icon}
              {doc.title}
            </DialogTitle>
            <DialogDescription>
              Berikut adalah detail dokumentasi untuk {doc.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {doc.content}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex w-full h-full bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      {renderDialog()}
      {/* Kolom Sidebar Internal */}
      <div
        className={cn(
          "border-r dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-1/3" : "w-0 p-0 border-none"
        )}
      >
        <div className={cn("p-4 border-b dark:border-gray-700 whitespace-nowrap overflow-hidden", !isSidebarOpen && "hidden")}>
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <ScrollArea className={cn("flex-1 p-4", !isSidebarOpen && "hidden")}>
          <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                Maskuh Learning
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div onClick={() => setActiveDialog('learning-getting-started')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Getting Started</span>
                    </div>
                    <div onClick={() => setActiveDialog('learning-basic-concepts')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <FileQuestion className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Basic Concepts</span>
                    </div>
                    <div onClick={() => setActiveDialog('learning-tutorials')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Tutorials</span>
                    </div>
                    <div onClick={() => setActiveDialog('learning-case-studies')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Case Studies</span>
                    </div>
                    <div onClick={() => setActiveDialog('learning-tips-tricks')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Tips & Tricks</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                Maskuh Documentation
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div onClick={() => setActiveDialog('app-menu')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <Menu className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">APP MENU</span>
                    </div>
                    <div onClick={() => setActiveDialog('structure')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <FolderKanban className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">STRUCTURE</span>
                    </div>
                    <div onClick={() => setActiveDialog('version')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <GitBranch className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Maskuh Version</span>
                    </div>
                    <div onClick={() => setActiveDialog('api-docs')} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md">
                      <BookText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">API Route Documentation</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>

      {/* Kolom Chat Utama */}
      <div className={cn("flex flex-col transition-all duration-300 ease-in-out", isSidebarOpen ? "w-2/3" : "w-full")}>
        <div className="p-8 border-b dark:border-gray-700 flex items-center gap-6 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          >
            {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <Avatar className="h-16 w-16 ml-12">
            <AvatarImage src="https://cdn-icons-png.flaticon.com/128/3273/3273828.png" alt="Chat.Maskuh" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
                Chat.Maskuh
            </h2>
            <p className="text-base text-muted-foreground mt-1">Powered by Arlan Saputra</p>
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
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm ${
                  message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
              >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, '')}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
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

    

    