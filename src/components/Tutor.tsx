import React, { useState } from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { askTutor } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_details?: any;
}

interface TutorProps {
  context: string;
  onClose?: () => void;
}

export default function Tutor({ context, onClose }: TutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with system prompt and context when context changes
  React.useEffect(() => {
    setMessages([]);
  }, [context]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    
    // Prepare the full message history to send to the API
    let apiMessages = [...messages];
    
    // If this is the first message, prepend the system instruction and context
    if (apiMessages.length === 0) {
      const systemInstruction = "You are a world-class expert on Intel 8085 and 8086 microprocessors. You help students achieve mastery by explaining complex concepts simply, providing assembly code examples, and correcting misunderstandings. YOU MUST ALWAYS RESPOND IN BENGALI (বাংলা).";
      const promptContext = `You are an expert microprocessor professor specializing in 8085 and 8086 architectures. 
Answer the following question based on the provided context or your general expertise.
Keep the tone educational, clear, and professional. YOU MUST ANSWER IN BENGALI (বাংলা).

Context: ${context}`;
      
      apiMessages.push({ role: 'system', content: systemInstruction });
      // We modify the first user message to include the context
      apiMessages.push({ role: 'user', content: `${promptContext}\n\nQuestion: ${input}` });
    } else {
      apiMessages.push(userMessage);
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await askTutor(apiMessages);
    
    const assistantMessage: Message = { 
      role: 'assistant', 
      content: response.text,
      reasoning_details: response.reasoning_details
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-slate-900 dark:text-slate-100" />
          <h3 className="font-bold text-slate-900 dark:text-white">এআই মাইক্রো টিউটর</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg sm:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
            <Bot size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">৮০৮৫ বা ৮০৮৬ আর্কিটেকচার, ইনস্ট্রাকশন বা অ্যাসেম্বলি কোড সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন!</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-slate-900 dark:bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-base leading-relaxed",
                msg.role === 'user' 
                  ? "bg-slate-900 dark:bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Loader2 size={16} className="animate-spin text-slate-500 dark:text-slate-400" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none flex flex-col gap-2">
              <div className="flex gap-1 items-center h-6">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">গভীরভাবে চিন্তা করছে (এই রিজনিং মডেলটি ৬০ সেকেন্ড পর্যন্ত সময় নিতে পারে)...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 transition-colors duration-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="একটি প্রশ্ন করুন..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 dark:focus:ring-blue-500 outline-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="tech-button tech-button-primary p-2 shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
