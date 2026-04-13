/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import Emulator from './components/Emulator';
import Tutor from './components/Tutor';
import { curriculum, Module, Lesson } from './data/curriculum';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Cpu, GraduationCap, ArrowRight, Sparkles, MessageSquare, CheckCircle2, Menu, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>(curriculum[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<'curriculum' | 'emulator' | 'dashboard'>('dashboard');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showTutor, setShowTutor] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('micromaster_progress');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const handleLessonComplete = () => {
    if (activeLesson && !completedLessons.includes(activeLesson.id)) {
      const newProgress = [...completedLessons, activeLesson.id];
      setCompletedLessons(newProgress);
      localStorage.setItem('micromaster_progress', JSON.stringify(newProgress));
    }
  };

  const handleNextLesson = () => {
    if (!activeLesson || !activeModule) return;
    
    const currentLessonIndex = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentLessonIndex < activeModule.lessons.length - 1) {
      setActiveLesson(activeModule.lessons[currentLessonIndex + 1]);
    } else {
      const currentModuleIndex = curriculum.findIndex(m => m.id === activeModule.id);
      if (currentModuleIndex < curriculum.length - 1) {
        const nextModule = curriculum[currentModuleIndex + 1];
        setActiveModule(nextModule);
        setActiveLesson(nextModule.lessons[0]);
      } else {
        setView('dashboard');
      }
    }
  };

  const selectLesson = (module: Module, lesson: Lesson) => {
    setActiveModule(module);
    setActiveLesson(lesson);
    setView('curriculum');
  };

  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-full",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          activeModule={activeModule}
          activeLesson={activeLesson}
          onSelectLesson={selectLesson}
          onSelectDashboard={() => {
            setActiveLesson(null);
            setView('dashboard');
          }}
          completedLessons={completedLessons}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate text-base md:text-lg">
              {view === 'dashboard' ? 'লার্নিং ড্যাশবোর্ড' : activeLesson?.title || 'মাইক্রোপ্রসেসর ল্যাব'}
            </h2>
            {view !== 'dashboard' && (
              <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg ml-3 shrink-0">
                <button 
                  onClick={() => setView('curriculum')}
                  className={cn(
                    "px-4 py-1.5 text-sm font-bold rounded-md transition-all",
                    view === 'curriculum' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  থিওরি
                </button>
                <button 
                  onClick={() => setView('emulator')}
                  className={cn(
                    "px-4 py-1.5 text-sm font-bold rounded-md transition-all",
                    view === 'emulator' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  ল্যাব
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 md:w-32 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-slate-900 dark:bg-blue-500"
                />
              </div>
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{progressPercent}%</span>
            </div>
            <button 
              onClick={() => setShowTutor(!showTutor)}
              className={cn(
                "p-2 rounded-full transition-all relative",
                showTutor ? "bg-slate-900 dark:bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <MessageSquare size={18} />
              {!showTutor && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
            </button>
          </div>
        </header>

        {/* Mobile View Toggle (Visible only on small screens when not on dashboard) */}
        {view !== 'dashboard' && (
          <div className="sm:hidden flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 shrink-0 transition-colors duration-300">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
              <button 
                onClick={() => setView('curriculum')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                  view === 'curriculum' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                থিওরি
              </button>
              <button 
                onClick={() => setView('emulator')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                  view === 'emulator' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                ল্যাব
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 md:p-10 max-w-6xl mx-auto"
              >
                <div className="mb-8 md:mb-12">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded">কোর্স কোড: ৫২০২২৩</span>
                    <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded">ক্রেডিট: ৩</span>
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-bold px-2.5 py-0.5 rounded">ক্লাস আওয়ার: ৪৫</span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-2.5 py-0.5 rounded">মার্কস: ৮০</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3 md:mb-4">মাইক্রোপ্রসেসর এবং অ্যাসেম্বলি ল্যাঙ্গুয়েজ</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl">মাইক্রোপ্রসেসর, অ্যাডভান্সড আর্কিটেকচার এবং অ্যাসেম্বলি ল্যাঙ্গুয়েজ প্রোগ্রামিং সহ সম্পূর্ণ কোর্স সিলেবাস।</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {curriculum.map((module) => (
                    <div key={module.id} className="tech-card group hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col">
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-slate-100 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <Cpu size={28} className="md:w-8 md:h-8" />
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">মডিউল</span>
                            <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{module.id}</p>
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{module.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed text-base md:text-lg">{module.description}</p>
                        
                        <div className="space-y-3 mb-8 flex-1">
                          {module.lessons.slice(0, 4).map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between text-base text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                              <div className="flex items-center gap-3 truncate pr-4">
                                <BookOpen size={18} className="text-slate-400 dark:text-slate-500 shrink-0" />
                                <span className="truncate font-medium">{lesson.title}</span>
                              </div>
                              {completedLessons.includes(lesson.id) && <CheckCircle2 size={18} className="text-green-500 dark:text-green-400 shrink-0" />}
                            </div>
                          ))}
                          {module.lessons.length > 4 && (
                            <div className="text-sm text-slate-400 dark:text-slate-500 font-medium text-center pt-2">
                              + আরও {module.lessons.length - 4} টি লেসন
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => selectLesson(module, module.lessons[0])}
                          className="w-full tech-button tech-button-primary justify-center py-3 mt-auto"
                        >
                          পড়া চালিয়ে যান
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 md:mt-12 tech-card p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="text-blue-400" size={16} />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400">রেফারেন্স বইসমূহ</span>
                    </div>
                    <ul className="text-slate-300 text-sm md:text-base space-y-2 list-disc list-inside">
                      <li>D.V Hall, <i>Microprocessors and Interfacing</i>, McGraw-Hill</li>
                      <li>M. Rafiquzzaman, <i>Microprocessors and Microprocessor Based System Design</i></li>
                      <li>Y. Liu and G.A. Ginson, <i>Microcomputer System: 8086/8088 Family</i></li>
                    </ul>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                    <GraduationCap size={160} />
                  </div>
                </div>
              </motion.div>
            ) : view === 'curriculum' ? (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeLesson && (
                  <LessonView 
                    lesson={activeLesson} 
                    onComplete={handleLessonComplete} 
                    onNextLesson={handleNextLesson}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="emulator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 md:p-8 h-full"
              >
                <Emulator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Tutor Drawer */}
        <AnimatePresence>
          {showTutor && (
            <>
              {/* Mobile Overlay for Tutor */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/20 z-20 sm:hidden backdrop-blur-sm"
                onClick={() => setShowTutor(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-full sm:w-96 z-30 shadow-2xl bg-white border-l border-slate-200"
              >
                <Tutor context={activeLesson?.content || "General microprocessor architecture"} onClose={() => setShowTutor(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
