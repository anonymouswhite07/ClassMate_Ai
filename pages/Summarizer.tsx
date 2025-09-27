import React, { useState } from 'react';
import { generateText, summarizeFile } from '../services/geminiService';

const formatAIResponseToHTML = (text: string) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
};

const Summarizer: React.FC = () => {
  const [textToSummarize, setTextToSummarize] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
          'application/pdf', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setTextToSummarize('');
        setError('');
      } else {
        setError('Please select a PDF or DOCX file.');
        setFile(null);
      }
    }
  };

  const handleSummarize = async () => {
    if (!textToSummarize.trim() && !file) {
      setError('Please enter text or upload a file to summarize.');
      return;
    }
    setIsLoading(true);
    setSummary('');
    setError('');
    try {
      let result = '';
      if (file) {
        result = await summarizeFile(file);
      } else {
        result = await generateText(`Summarize the following text into a few key points:\n\n${textToSummarize}`);
      }
      setSummary(result);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Text Summarizer</h1>
      <p className="mb-6 text-[var(--text-secondary)]">
        Upload a document or paste any long article, paper, or document below, and the AI will generate a concise summary for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your Content</h2>
          
          <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--accent)] border-dashed rounded-lg cursor-pointer bg-transparent hover:bg-[var(--accent)]/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-[var(--text-primary)]/80" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                      <p className="mb-2 text-sm text-[var(--text-secondary)]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-[var(--text-secondary)]/80">PDF or DOCX</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={isLoading} accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              </label>
          </div> 
          {file && (
            <div className="flex items-center justify-between p-2 text-sm rounded-lg bg-[var(--accent)]/20 text-[var(--text-primary)]">
                <span className="truncate pr-2">{file.name}</span>
                <button onClick={clearFile} disabled={isLoading} className="text-red-500 hover:text-red-400 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          )}

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-[var(--accent)]/50"></div>
            <span className="flex-shrink mx-4 text-xs uppercase text-[var(--text-secondary)]">Or</span>
            <div className="flex-grow border-t border-[var(--accent)]/50"></div>
          </div>

          <textarea
            value={textToSummarize}
            onChange={(e) => { setTextToSummarize(e.target.value); if(file) clearFile(); }}
            className="form-input w-full h-64 md:h-80"
            placeholder="Paste your text here..."
            disabled={isLoading || !!file}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || (!textToSummarize.trim() && !file)}
            className="btn-primary w-full disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Summary</h2>
          <div className="w-full h-full min-h-[20rem] p-4 bg-transparent border border-[var(--accent)] rounded-lg shadow-inner overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-[var(--accent)] rounded-full animate-pulse"></div>
                      <div className="h-3 w-3 bg-[var(--accent)] rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="h-3 w-3 bg-[var(--accent)] rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      <span className="text-[var(--text-secondary)]">Generating summary...</span>
                  </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {summary && !isLoading && (
              <div 
                className="text-[var(--text-secondary)] prose max-w-none" 
                dangerouslySetInnerHTML={formatAIResponseToHTML(summary)} 
              />
            )}
            {!summary && !isLoading && !error && (
                <p className="text-gray-500 text-center flex items-center justify-center h-full">Your summary will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;