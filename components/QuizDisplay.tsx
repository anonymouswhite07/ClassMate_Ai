import React, { useState } from 'react';
import { Quiz } from '../types';

interface QuizDisplayProps {
  quiz: Quiz;
  onQuizComplete: (score: number) => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onQuizComplete(calculateScore());
      setShowResults(true);
    }
  };
  
  if (showResults) {
      const score = calculateScore();
      return (
          <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20">
              <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Quiz Results for "{quiz.topic}"</h2>
              <p className="text-lg mb-4 text-[var(--text-secondary)]">You scored {score} out of {quiz.questions.length}</p>
              <button onClick={() => { setShowResults(false); setCurrentQuestionIndex(0); setSelectedAnswers([]); }} className="btn-primary">Take Again</button>
          </div>
      );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20">
      <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">{quiz.topic} Quiz</h2>
      <p className="mb-4 text-[var(--text-secondary)]">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      <h3 className="text-lg font-medium mb-4 text-[var(--text-primary)]">{currentQuestion.question}</h3>
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => (
          <label key={index} className="flex items-center p-3 rounded-lg border border-[var(--accent)]/50 cursor-pointer hover:bg-[var(--accent)]/50 has-[:checked]:bg-[var(--accent)] has-[:checked]:border-[var(--accent)] transition-colors">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={option}
              checked={selectedAnswers[currentQuestionIndex] === option}
              onChange={() => handleAnswerSelect(option)}
              className="mr-3 h-4 w-4 rounded border-[var(--accent)] bg-transparent text-[var(--text-primary)] focus:ring-[var(--accent)] focus:ring-offset-[var(--background)]"
            />
            {option}
          </label>
        ))}
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="btn-primary disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
