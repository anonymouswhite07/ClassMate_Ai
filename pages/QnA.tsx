import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/geminiService';

interface Conversation {
  question: string;
  answer: string;
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

const QnA: React.FC = () => {
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleAsk = async () => {
    if (!currentQuestion.trim()) {
      setError('Please enter a question.');
      return;
    }
    const questionToAsk = currentQuestion;
    setCurrentQuestion('');
    setIsLoading(true);
    setError('');

    try {
      const result = await generateText(`You are Anonymous Ai, an expert tutor. If asked your name, say it is Anonymous Ai. Answer the following question clearly and concisely: ${questionToAsk}`);
      setConversation(prev => [...prev, { question: questionToAsk, answer: result }]);
    } catch (err) {
      setError('Failed to get an answer. Please try again.');
      setCurrentQuestion(questionToAsk); // Restore question on error
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Q&A Tutor</h1>
          <p className="text-[var(--text-secondary)]">
            Have a question about a topic you're studying? Ask away, and Anonymous Ai will provide a clear, concise answer.
          </p>
        </header>

        {conversation.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full text-center text-[var(--text-secondary)] -mt-16">
            <p>Your conversation with Anonymous Ai will appear here.</p>
          </div>
        )}

        <div className="space-y-6">
          {conversation.map((qa, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-end">
                <div className="bg-[var(--accent)] text-[var(--text-primary)] rounded-lg p-3 max-w-2xl shadow-md">
                  {qa.question}
                </div>
              </div>
              <div className="flex justify-start">
                <div 
                    className="bg-transparent border border-[var(--accent)]/50 rounded-lg p-3 max-w-2xl shadow-md prose" 
                    style={{color: 'var(--text-secondary)'}}
                    dangerouslySetInnerHTML={formatAIResponseToHTML(qa.answer)}
                >
                </div>
              </div>
            </React.Fragment>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-md p-3 rounded-lg bg-transparent border border-[var(--accent)]/50">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-[var(--accent)] rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={conversationEndRef} />
      </div>

      <footer className="p-4 border-t border-[var(--accent)] bg-[var(--background)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-2">
            <textarea
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey && !isLoading) { e.preventDefault(); handleAsk(); } }}
              className="form-input resize-none"
              placeholder="Type your question here..."
              rows={1}
              disabled={isLoading}
              style={{ overflow: 'hidden' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              onClick={handleAsk}
              disabled={isLoading || !currentQuestion.trim()}
              className="btn-primary p-3 h-full flex items-center justify-center disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
              aria-label="Ask question"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </footer>
    </div>
  );
};

export default QnA;