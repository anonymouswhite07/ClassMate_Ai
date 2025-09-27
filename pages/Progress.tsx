import React from 'react';

const Progress: React.FC = () => {
  // Dummy data for demonstration
  const progressData = {
    overallScore: 82,
    quizzes: [
      { topic: 'The Italian Renaissance', score: 90, date: '2024-07-28' },
      { topic: 'Quantum Physics Basics', score: 70, date: '2024-07-27' },
      { topic: 'World War II History', score: 85, date: '2024-07-25' },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Your Progress</h1>
      <p className="mb-8 text-[var(--text-secondary)]">
        Track your quiz scores and see how you're improving over time.
        Note: This is a demo and progress is not saved.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20 text-center">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Overall Average Score</h3>
            <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">{progressData.overallScore}%</p>
        </div>
        <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20 text-center">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Quizzes Taken</h3>
            <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">{progressData.quizzes.length}</p>
        </div>
         <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20 text-center">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">Best Score</h3>
            <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">{Math.max(...progressData.quizzes.map(q => q.score))}%</p>
        </div>
      </div>

      <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Recent Quizzes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--accent)]/50">
                <th className="p-3 text-[var(--text-primary)]">Topic</th>
                <th className="p-3 text-[var(--text-primary)]">Score</th>
                <th className="p-3 text-[var(--text-primary)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {progressData.quizzes.map((quiz, index) => (
                <tr key={index} className="border-b border-[var(--accent)]/20">
                  <td className="p-3 text-[var(--text-secondary)]">{quiz.topic}</td>
                  <td className="p-3 text-[var(--text-secondary)]">
                    <span className={quiz.score >= 80 ? 'text-green-400' : quiz.score >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                        {quiz.score}%
                    </span>
                  </td>
                  <td className="p-3 text-[var(--text-secondary)]">{quiz.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Progress;
