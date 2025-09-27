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

const ProtectedRoute: React.FC = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
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