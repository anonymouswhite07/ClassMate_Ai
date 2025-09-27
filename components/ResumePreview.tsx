import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
    data: ResumeData;
}

// SVG Icon Components
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 inline-block text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 inline-block text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);


const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;

    return (
        <div id="resume-to-print">
            <div className="bg-white text-gray-800 p-8 shadow-2xl max-w-4xl mx-auto font-sans text-sm leading-relaxed">
                {/* Header */}
                <header className="flex items-start justify-between mb-8 pb-4 border-b-2 border-gray-100">
                    <div>
                        <h1 className="text-4xl font-bold text-[#34656D] tracking-tight">{personalInfo.name}</h1>
                        <p className="text-lg text-gray-500 mt-1">{experience[0]?.jobTitle || 'Aspiring Professional'}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600 space-y-1.5">
                        {personalInfo.email && <p className="flex items-center justify-end"><MailIcon />{personalInfo.email}</p>}
                        {personalInfo.phone && <p className="flex items-center justify-end"><PhoneIcon />{personalInfo.phone}</p>}
                        {personalInfo.linkedin && (
                            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-end text-blue-600 hover:underline">
                                <LinkedInIcon />{personalInfo.linkedin}
                            </a>
                        )}
                        {personalInfo.github && (
                            <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-end text-blue-600 hover:underline">
                                <GitHubIcon />{personalInfo.github}
                            </a>
                        )}
                    </div>
                </header>

                {/* Summary */}
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase text-[#34656D] tracking-[.2em] border-b-2 border-[#FAEAB1] pb-1 mb-3">Professional Summary</h2>
                    <p className="text-gray-700">{summary}</p>
                </section>

                {/* Skills */}
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase text-[#34656D] tracking-[.2em] border-b-2 border-[#FAEAB1] pb-1 mb-3">Core Competencies</h2>
                    <div className="flex flex-wrap -m-1">
                        {skills.map(skill => (
                            <span key={skill} className="m-1 bg-[#34656D]/10 text-[#34656D] text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase text-[#34656D] tracking-[.2em] border-b-2 border-[#FAEAB1] pb-1 mb-3">Professional Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base text-gray-900">{exp.jobTitle}</h3>
                                <span className="text-xs font-semibold text-gray-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-sm italic text-[#34656D]">
                                <h4>{exp.company}</h4>
                                <span>{exp.location}</span>
                            </div>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
                                {exp.description.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-xs font-bold uppercase text-[#34656D] tracking-[.2em] border-b-2 border-[#FAEAB1] pb-1 mb-3">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base text-gray-900">{edu.institution}</h3>
                                <span className="text-xs font-semibold text-gray-500">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="italic text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default ResumePreview;