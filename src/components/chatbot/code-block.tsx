
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    toast({
        title: "Disalin!",
        description: "Kode telah disalin ke clipboard.",
    })
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-gray-800 dark:bg-gray-900 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 dark:bg-gray-800/50">
        <span className="text-xs font-sans lowercase text-gray-400">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:bg-gray-600 hover:text-white"
          onClick={handleCopy}
        >
          {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          <span className="sr-only">Salin kode</span>
        </Button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto text-white">
        <code className={`language-${language}`}>{value}</code>
      </pre>
    </div>
  );
}
