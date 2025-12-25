
import React, { useState, useCallback } from 'react';
import { SfiLevel, AppState } from './types';
import { generateSfiText } from './services/geminiService';
import LevelSelector from './components/LevelSelector';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    topic: '',
    level: SfiLevel.B,
    isLoading: false,
    result: null,
    error: null,
  });

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.topic.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));

    try {
      const result = await generateSfiText(state.topic, state.level);
      setState(prev => ({ ...prev, result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "Ett oväntat fel uppstod. Försök igen." 
      }));
    }
  }, [state.topic, state.level]);

  const setLevel = (level: SfiLevel) => setState(prev => ({ ...prev, level }));
  const setTopic = (topic: string) => setState(prev => ({ ...prev, topic }));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            SFI Textgenerator
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Skapa anpassade texter för SFI-studier på några sekunder.
          </p>
        </header>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div>
              <label htmlFor="topic" className="block text-sm font-bold text-slate-700 mb-2">
                Vad ska texten handla om? (Ämne)
              </label>
              <input
                type="text"
                id="topic"
                placeholder="Ex: Att söka jobb, Min familj, Sveriges natur..."
                value={state.topic}
                onChange={(e) => setTopic(e.target.value)}
                className="block w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 transition-all text-lg placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Välj SFI-nivå
              </label>
              <LevelSelector currentLevel={state.level} onSelect={setLevel} />
            </div>

            <button
              type="submit"
              disabled={state.isLoading || !state.topic.trim()}
              className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {state.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Skriver text...
                </>
              ) : (
                'Generera Text'
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {state.isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-4/6"></div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-32 bg-slate-50 rounded-xl"></div>
              <div className="h-32 bg-slate-50 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* Results */}
        {state.result && <ResultCard result={state.result} level={state.level} />}

        {/* Footer Info */}
        <footer className="mt-16 pb-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SFI Textgenerator - Utvecklad för språkinlärning</p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
              Svenska som andraspråk
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
              AI-driven pedagogik
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
