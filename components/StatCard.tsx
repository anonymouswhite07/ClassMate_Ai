import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-transparent p-6 rounded-lg border border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 flex items-center">
      {icon && <div className="mr-4 text-3xl text-[var(--text-primary)]">{icon}</div>}
      <div>
        <h3 className="text-[var(--text-secondary)] text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
