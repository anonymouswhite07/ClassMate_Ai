import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Q&A Tutor', path: '/qna' },
    { name: 'Summarizer', path: '/summarizer' },
    { name: 'Quiz Generator', path: '/quiz' },
    { name: 'Progress', path: '/progress' },
    { name: 'Resume Builder', path: '/resume-builder' },
];

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <nav className="w-64 bg-transparent border-r border-[var(--accent)] p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center text-[var(--text-primary)]">ClassMate AI</h1>
            </div>
            <ul className="flex-1 space-y-2">
                {navItems.map(item => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[var(--accent)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent)]/30'}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="mt-auto">
                <div className="border-t border-[var(--accent)] pt-4 space-y-2">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[var(--accent)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent)]/30'}`
                        }
                    >
                        Profile
                    </NavLink>
                    <button onClick={handleLogout} className="w-full text-left flex items-center p-3 rounded-lg hover:bg-[var(--accent)]/30">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
