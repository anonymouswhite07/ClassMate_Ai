import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz as QuizType } from '../types';
import QuizDisplay from '../components/QuizDisplay';

const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setQuiz(null);
    setError('');
    try {
      const generatedQuiz = await generateQuiz(topic, numQuestions);
      if (generatedQuiz) {
        setQuiz(generatedQuiz);
      } else {
        setError('Failed to generate quiz. The AI might have returned an unexpected format. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the quiz. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuizComplete = (score: number) => {
      console.log(`Quiz completed with score: ${score}/${quiz?.questions.length}`);
      // Here you could save the progress
  };

  const startNewQuiz = () => {
    setQuiz(null);
    setTopic('');
    setError('');
  }

  if (isLoading) {
    return (
       <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Quiz Generator</h1>
         <div className="flex flex-col items-center justify-center text-center p-8 bg-transparent border border-[var(--accent)] rounded-lg shadow-lg shadow-[var(--accent)]/20">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Generating Your Quiz...</h2>
              <p className="text-[var(--text-secondary)] mb-4">Please wait while our AI creates questions on "{topic}".</p>
              <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-4 w-4 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-4 w-4 bg-[var(--accent)] rounded-full animate-bounce"></div>
              </div>
         </div>
       </div>
    );
  }

  if (quiz) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Quiz Time!</h1>
                <button onClick={startNewQuiz} className="btn-secondary">Create New Quiz</button>
            </div>
            <QuizDisplay quiz={quiz} onQuizComplete={handleQuizComplete} />
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Quiz Generator</h1>
      <p className="mb-6 text-[var(--text-secondary)]">
        Enter any topic and the number of questions to generate a multiple-choice quiz and test your knowledge.
      </p>

      <form onSubmit={handleGenerateQuiz} className="max-w-lg mx-auto bg-transparent border border-[var(--accent)] p-8 rounded-lg shadow-lg shadow-[var(--accent)]/20">
        <div className="space-y-6">
            <div>
                <label htmlFor="topic" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-input w-full"
                  placeholder="e.g., The Italian Renaissance"
                />
            </div>
            <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Number of Questions: {numQuestions}</label>
                 <input
                    id="numQuestions"
                    type="range"
                    min="3"
                    max="10"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                 />
            </div>
        </div>
        
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        
        <div className="mt-8">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              Generate Quiz
            </button>
        </div>
      </form>
    </div>
  );
};

export default Quiz;
