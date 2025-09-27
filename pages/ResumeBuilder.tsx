import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '../types';
import ResumePreview from '../components/ResumePreview';
import { improveResumeText, generateResumeFromPrompt } from '../services/geminiService';

const initialResumeData: ResumeData = {
    personalInfo: {
        name: 'Alex Doe',
        email: 'alex.doe@email.com',
        phone: '123-456-7890',
        linkedin: 'linkedin.com/in/alexdoe',
        github: 'github.com/alexdoe',
    },
    summary: 'A highly motivated and detail-oriented computer science graduate with a passion for developing innovative software solutions. Seeking a challenging role as a software engineer to apply my skills in web development, machine learning, and problem-solving.',
    experience: [
        {
            id: uuidv4(),
            jobTitle: 'Software Engineer Intern',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            startDate: 'May 2023',
            endDate: 'Aug 2023',
            description: ['Developed and maintained web applications using React and Node.js.', 'Collaborated with a team of developers to implement new features.', 'Fixed bugs and improved application performance.'],
        },
    ],
    education: [
        {
            id: uuidv4(),
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: 'Aug 2020',
            endDate: 'May 2024',
        },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Docker'],
};

const stripMarkdown = (text: string): string => {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
};

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ResumeBuilder: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Failed to parse saved resume data", e);
                return initialResumeData;
            }
        }
        return initialResumeData;
    });

    const [improvingField, setImprovingField] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [jobTarget, setJobTarget] = useState<string>('');
    const [keyAchievements, setKeyAchievements] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const debounceTimeout = useRef<number | null>(null);

    // Auto-save to localStorage with debounce
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = window.setTimeout(() => {
            localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        }, 3000); // 3-second delay

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [resumeData]);

    const handleImproveText = async (fieldName: string, text: string, experienceId?: string, descriptionIndex?: number) => {
        setImprovingField(experienceId ? `${fieldName}-${experienceId}-${descriptionIndex}` : fieldName);
        try {
            const improvedText = await improveResumeText(text);
            const strippedText = stripMarkdown(improvedText);
            
            if (fieldName === 'experienceDescription' && experienceId !== undefined && descriptionIndex !== undefined) {
                setResumeData(prev => ({
                    ...prev,
                    experience: prev.experience.map(exp => {
                        if (exp.id === experienceId) {
                            const newDescription = [...exp.description];
                            newDescription[descriptionIndex] = strippedText;
                            return {...exp, description: newDescription};
                        }
                        return exp;
                    })
                }));
            }
        } catch (error) {
            console.error("Failed to improve text:", error);
        } finally {
            setImprovingField(null);
        }
    };

    const handleGenerateResume = async () => {
        if (!prompt.trim() && !keyAchievements.trim() && !jobTarget.trim()) return;
        setIsGenerating(true);
        
        const detailedPrompt = `
            Generate a professional resume based on the following details.
            The user is targeting the job title: "${jobTarget}".
            Here are some of their key achievements and projects: "${keyAchievements}".
            Here is the general information they provided about their background, education, past jobs, and skills: "${prompt}".
            
            Please create a complete resume from this information in the required JSON format. Ensure the summary is compelling, and the experience descriptions use action verbs and quantify results where possible.
        `;

        try {
            const generatedData = await generateResumeFromPrompt(detailedPrompt);
            if (generatedData) {
                const newExperience = generatedData.experience.map(exp => ({ ...exp, id: uuidv4() }));
                const newEducation = generatedData.education.map(edu => ({ ...edu, id: uuidv4() }));
                setResumeData({ ...generatedData, experience: newExperience, education: newEducation });
            }
        } catch (error) {
            console.error("Failed to generate resume:", error);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="resume-editor-pane p-4 overflow-y-auto border-r border-[var(--accent)]">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Resume Builder</h1>

                {/* Resume Generation Section */}
                <div className="mb-6 p-4 border border-[var(--accent)]/50 rounded-lg bg-[var(--accent)]/10">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Generate with AI</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">Provide more details for a tailored, AI-generated resume. The AI will use this information to craft a professional document for you.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target Job Title</label>
                            <input 
                                type="text"
                                value={jobTarget}
                                onChange={(e) => setJobTarget(e.target.value)}
                                className="form-input"
                                placeholder="e.g., Senior Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Key Achievements / Projects</label>
                            <textarea 
                                value={keyAchievements}
                                onChange={(e) => setKeyAchievements(e.target.value)}
                                className="form-input w-full"
                                rows={4}
                                placeholder="Describe 2-3 of your most impressive accomplishments. Use metrics where possible."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">General Information</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="form-input w-full"
                                rows={6}
                                placeholder="Provide any other relevant details: your education, past jobs, skills, and the type of role you're looking for."
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleGenerateResume}
                        disabled={isGenerating}
                        className="btn-primary mt-4 w-full"
                    >
                        {isGenerating ? 'Generating...' : '✨ Generate New Resume'}
                    </button>
                </div>
                
                {/* Experience Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Work Experience</h2>
                    {resumeData.experience.map(exp => (
                        <div key={exp.id} className="mb-4 p-4 border border-[var(--accent)]/50 rounded-lg">
                            <p className="font-bold">{exp.jobTitle} at {exp.company}</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                {exp.description.map((desc, index) => (
                                    <li key={index} className="flex items-center">
                                       <span className="flex-1">{desc}</span>
                                       <button 
                                            onClick={() => handleImproveText('experienceDescription', desc, exp.id, index)}
                                            disabled={!!improvingField}
                                            className="ml-2 text-xs btn-secondary p-1"
                                            title="Improve with AI"
                                        >
                                           {improvingField === `experienceDescription-${exp.id}-${index}` ? '...' : '✨'}
                                       </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
            <div className="flex flex-col h-full bg-gray-200">
                <div className="resume-preview-header flex justify-between items-center p-4 border-b border-gray-300 bg-gray-100">
                    <h2 className="text-xl font-bold text-gray-700">Preview</h2>
                    <button
                        onClick={handlePrint}
                        className="btn-primary flex items-center"
                        title="Use the print dialog to 'Save as PDF'"
                    >
                        <DownloadIcon />
                        Download / Export
                    </button>
                </div>
                <div className="overflow-y-auto p-4">
                    <ResumePreview data={resumeData} />
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;