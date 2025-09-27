import React from 'react';
import StatCard from '../components/StatCard';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Quizzes Taken" value="12" />
        <StatCard title="Average Score" value="85%" />
        <StatCard title="Topics Studied" value="5" />
      </div>
      <div className="mt-8 bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Welcome back!</h2>
        <p className="text-[var(--text-secondary)]">
          Ready to learn something new? Use the navigation on the left to explore different tools.
          You can ask questions in Q&A, summarize long texts, or generate a quiz on any topic!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
