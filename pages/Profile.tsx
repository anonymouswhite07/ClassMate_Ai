import React from 'react';
import StatCard from '../components/StatCard';

// Icons for the profile page
const QuizzesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
const ScoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
);


const Profile: React.FC = () => {
  // Dummy user data
  const user = {
    name: 'Alex Doe',
    email: 'user@example.com',
    memberSince: 'July 1, 2024',
  };
  
  // Dummy stats data
  const stats = {
      quizzesTaken: 12,
      averageScore: 85,
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
            <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20 text-center">
                 <div className="w-28 h-28 rounded-full bg-[var(--accent)] flex items-center justify-center text-5xl font-bold text-[var(--text-primary)] mx-auto mb-4">
                    A
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h2>
                <p className="text-[var(--text-secondary)] mb-4">{user.email}</p>
                <p className="text-sm text-[var(--text-secondary)]/80">Member since {user.memberSince}</p>
                <button className="btn-secondary w-full mt-6 flex items-center justify-center">
                    <EditIcon /> Edit Profile
                </button>
            </div>
        </div>

        {/* Right Column: Stats and Settings */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Section */}
            <div>
                 <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Your Stats</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <StatCard title="Quizzes Taken" value={String(stats.quizzesTaken)} icon={<QuizzesIcon />} />
                     <StatCard title="Average Score" value={`${stats.averageScore}%`} icon={<ScoreIcon />} />
                 </div>
            </div>

            {/* Settings Section */}
            <div className="bg-transparent border border-[var(--accent)] p-6 rounded-lg shadow-lg shadow-[var(--accent)]/20">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-md bg-[var(--accent)]/10">
                        <label htmlFor="notifications" className="text-[var(--text-secondary)] font-medium">Enable email notifications</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" id="notifications" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--accent)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-md bg-[var(--accent)]/10">
                        <label className="text-[var(--text-secondary)] font-medium">Theme</label>
                         <p className="text-[var(--text-primary)] font-semibold">Light</p>
                    </div>
                    <button className="btn-secondary w-full sm:w-auto">Change Password</button>
                </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-transparent border border-red-500/50 p-6 rounded-lg shadow-lg shadow-red-500/10">
                <h2 className="text-xl font-semibold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-[var(--text-secondary)] mb-4">These actions are permanent and cannot be undone.</p>
                <button className="text-red-500 font-semibold hover:text-red-400 border border-red-500/50 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors">Delete Account</button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;