import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const formatAIResponseToHTML = (text: string) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // First, handle display math $$...$$
      .replace(/\$\$(.*?)\$\$/gs, '$1') 
      // Then, handle inline math $...$
      .replace(/\$(.*?)\$/g, '$1')
      .replace(/\n/g, '<br />');
    return { __html: html };
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = createChat();
      setMessages([{ sender: 'bot', text: "Hi! How can I help you today?" }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const botMessage: Message = { sender: 'bot', text: response.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className={`fixed bottom-8 right-8 transition-all duration-300 z-40 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <button onClick={() => setIsOpen(true)} className="bg-[var(--accent)] text-[var(--text-primary)] rounded-full p-4 shadow-lg hover:scale-110 transition-transform">
          <ChatIcon />
        </button>
      </div>
      
      <div className={`fixed bottom-8 right-8 w-96 h-[600px] bg-[var(--background)] border border-[var(--accent)] rounded-lg shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b border-[var(--accent)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Anonymous Ai Assistant</h2>
          <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <CloseIcon />
          </button>
        </header>
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'user' ? (
                    <div className="max-w-[80%] p-3 rounded-lg bg-[var(--accent)] text-[var(--text-primary)]">
                        <p className="text-sm">{msg.text}</p>
                    </div>
                ) : (
                    <div 
                        className="max-w-[80%] p-3 rounded-lg bg-transparent border border-[var(--accent)]/50 shadow-md prose text-sm"
                        dangerouslySetInnerHTML={formatAIResponseToHTML(msg.text)}
                    />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-transparent border border-[var(--accent)]/50">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce"></span>
                    </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <footer className="p-4 border-t border-[var(--accent)]">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              className="form-input rounded-r-none"
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="btn-primary rounded-l-none px-4 flex items-center justify-center">
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

// Icons
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export default Chatbot;