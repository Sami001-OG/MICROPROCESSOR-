import React from 'react';
import { curriculum, Module, Lesson } from '../data/curriculum';
import { BookOpen, Cpu, ChevronRight, CheckCircle2, LayoutDashboard, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeModule: Module;
  activeLesson: Lesson | null;
  onSelectLesson: (module: Module, lesson: Lesson) => void;
  onSelectDashboard: () => void;
  completedLessons: string[];
  onClose?: () => void;
}

export default function Sidebar({ 
  activeModule, 
  activeLesson, 
  onSelectLesson, 
  onSelectDashboard,
  completedLessons,
  onClose
}: SidebarProps) {
  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none dark:text-white">MICROMASTER</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">8085 & 8086 Mastery</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <button
          onClick={() => { onSelectDashboard(); onClose?.(); }}
          className={cn(
            "w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-colors",
            !activeLesson ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        {curriculum.map((module) => (
          <div key={module.id} className="mt-6">
            <div className="px-6 mb-2">
              <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{module.title}</h2>
            </div>
            <div className="space-y-1">
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => { onSelectLesson(module, lesson); onClose?.(); }}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-2.5 text-sm transition-all group",
                    activeLesson?.id === lesson.id 
                      ? "bg-slate-900 dark:bg-blue-600 text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <BookOpen size={16} className={cn(
                      "shrink-0",
                      activeLesson?.id === lesson.id ? "text-blue-400 dark:text-blue-200" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )} />
                    <span className="truncate text-left">{lesson.title}</span>
                  </div>
                  {completedLessons.includes(lesson.id) && (
                    <CheckCircle2 size={14} className="text-green-500 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Master Candidate</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">tontonsing17@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
