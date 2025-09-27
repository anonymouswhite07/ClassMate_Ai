export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  topic: string;
  questions: Question[];
}

export interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export interface ResumeData {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
    };
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}
