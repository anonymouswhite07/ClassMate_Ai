import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import { Quiz, ResumeData } from "../types";

export const isApiKeyConfigured = !!process.env.API_KEY;

// Initialize the client only if the API key is available to prevent crashing.
const ai = isApiKeyConfigured ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const apiKeyMissingError = "Application is not configured correctly. The API key is missing.";

export const createChat = (): Chat => {
  if (!ai) {
    // This should ideally not be reached if App.tsx prevents rendering, but it's a safeguard.
    throw new Error("Gemini AI client is not initialized. API key might be missing.");
  }
  // Fix: Use the 'gemini-2.5-flash' model for chat.
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: "You are Anonymous Ai, a helpful and friendly AI assistant for students. Your name is Anonymous Ai. If asked about your name or who you are, you must respond that you are Anonymous Ai. Do not mention Gemini or Google. Keep your answers concise and helpful."
    }
  });
};

export const generateText = async (prompt: string): Promise<string> => {
  if (!ai) {
      console.error(apiKeyMissingError);
      return "Sorry, the application is not configured correctly. Please contact the administrator.";
  }
  try {
    // Fix: Use ai.models.generateContent for single-turn text generation.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    // Fix: Directly access the .text property for the response.
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};


const quizSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer"]
            }
        }
    },
    required: ["topic", "questions"]
};


export const generateQuiz = async (topic: string, numQuestions: number): Promise<Quiz | null> => {
    if (!ai) {
        console.error(apiKeyMissingError);
        return null;
    }
    const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions on the topic of "${topic}". Each question should have 4 options. Ensure one of the options is the correct answer.`;

    try {
        // Fix: Use responseSchema to get a structured JSON output for the quiz.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });

        const jsonText = response.text;
        const quizData = JSON.parse(jsonText);
        
        if (quizData && quizData.questions && Array.isArray(quizData.questions)) {
            return quizData as Quiz;
        } else {
            console.error("Generated quiz data is not in the expected format:", quizData);
            return null;
        }

    } catch (error) {
        console.error("Error generating quiz:", error);
        return null;
    }
};

export const improveResumeText = async (text: string): Promise<string> => {
    const prompt = `You are an expert career coach specializing in resume writing. Revise the following text for a resume to make it more compelling and professional. Focus on using action-oriented language, quantifying achievements where possible, and aligning the content with modern resume standards. Only revise the given text, do not add new information. Here is the text: "${text}"`;
    return generateText(prompt);
};

// Helper to convert a File object to a GoogleGenAI.Part object
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // The result includes the Base64 prefix `data:mime/type;base64,`, remove it.
        resolve(result.split(',')[1]);
      }
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export const summarizeFile = async (file: File): Promise<string> => {
    if (!ai) {
        console.error(apiKeyMissingError);
        return "Sorry, the application is not configured correctly. Please contact the administrator.";
    }
    const prompt = "Summarize this document into a few key points. Provide a concise and easy-to-understand summary.";
    try {
        const filePart = await fileToGenerativePart(file);
        const textPart = { text: prompt };
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [ filePart, textPart ] },
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing file:", error);
        return "Sorry, I encountered an error while processing your file.";
    }
};

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Full name of the person." },
                email: { type: Type.STRING, description: "Email address." },
                phone: { type: Type.STRING, description: "Phone number." },
                linkedin: { type: Type.STRING, description: "URL to LinkedIn profile (e.g., 'linkedin.com/in/username')." },
                github: { type: Type.STRING, description: "URL to GitHub profile (e.g., 'github.com/username')." },
            },
            required: ['name', 'email', 'phone']
        },
        summary: { type: Type.STRING, description: "A professional summary of 2-4 sentences." },
        experience: {
            type: Type.ARRAY,
            description: "A list of professional experiences.",
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING, description: "e.g., 'May 2023'" },
                    endDate: { type: Type.STRING, description: "e.g., 'Aug 2023' or 'Present'" },
                    description: { 
                        type: Type.ARRAY, 
                        description: "A list of accomplishments or responsibilities as bullet points.",
                        items: { type: Type.STRING } 
                    },
                },
                required: ['jobTitle', 'company', 'startDate', 'endDate', 'description']
            }
        },
        education: {
            type: Type.ARRAY,
            description: "A list of educational qualifications.",
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING, description: "e.g., 'Bachelor of Science'" },
                    fieldOfStudy: { type: Type.STRING, description: "e.g., 'Computer Science'" },
                    startDate: { type: Type.STRING, description: "e.g., 'Aug 2020'" },
                    endDate: { type: Type.STRING, description: "e.g., 'May 2024'" },
                },
                required: ['institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate']
            }
        },
        skills: {
            type: Type.ARRAY,
            description: "A list of relevant skills.",
            items: { type: Type.STRING }
        }
    },
    required: ['personalInfo', 'summary', 'experience', 'education', 'skills']
};

export const generateResumeFromPrompt = async (prompt: string): Promise<ResumeData | null> => {
    if (!ai) {
        console.error(apiKeyMissingError);
        return null;
    }
    const fullPrompt = `You are an expert career coach and resume writer. Based on the following information, generate a complete and professional resume in JSON format. The information is: "${prompt}". Make sure the descriptions for experiences are action-oriented and highlight achievements.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });

        const jsonText = response.text;
        const resumeData = JSON.parse(jsonText);

        if (resumeData && resumeData.personalInfo) {
            return resumeData as ResumeData;
        } else {
            console.error("Generated resume data is not in the expected format:", resumeData);
            return null;
        }

    } catch (error) {
        console.error("Error generating resume:", error);
        return null;
    }
};
