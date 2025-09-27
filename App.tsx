import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QnA from './pages/QnA';
import Summarizer from './pages/Summarizer';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import { isApiKeyConfigured } from './services/geminiService';

const ApiKeyError: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)] text-[var(--text-primary)] p-4">
      <div className="w-full max-w-2xl p-8 text-center bg-transparent border-2 border-red-500/50 rounded-lg shadow-lg shadow-red-500/10">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Configuration Error</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-6">
          The application is missing the required API key for Google's Gemini AI.
        </p>
        <div className="text-left bg-[var(--accent)]/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Developer Instructions</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            To fix this, you need to set up an environment variable.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Create a <code className="bg-[var(--accent)] px-1 py-0.5 rounded font-mono">.env.local</code> file in the root of your project.</li>
            <li>Inside the file, add the following line, replacing <code className="bg-[var(--accent)] px-1 py-0.5 rounded font-mono">YOUR_API_KEY</code> with your actual Gemini API key:</li>
            <pre className="bg-gray-800 text-white p-3 rounded-md my-2 text-sm overflow-x-auto font-mono">
              VITE_API_KEY=YOUR_API_KEY
            </pre>
            <li>If you are deploying to a service like Vercel, you must add <code className="bg-[var(--accent)] px-1 py-0.5 rounded font-mono">VITE_API_KEY</code> as an environment variable in your project's settings on that platform.</li>
          </ol>
        </div>
        <p className="mt-6 text-sm text-[var(--text-secondary)]/80">
          Once the API key is set up, please restart your development server or redeploy your application.
        </p>
      </div>
    </div>
  );
};


const ProtectedRoute: React.FC = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  if (!isApiKeyConfigured) {
    return <ApiKeyError />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="qna" element={<QnA />} />
                <Route path="summarizer" element={<Summarizer />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="progress" element={<Progress />} />
                <Route path="profile" element={<Profile />} />
                <Route path="resume-builder" element={<ResumeBuilder />} />
            </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
