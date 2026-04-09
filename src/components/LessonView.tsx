import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson } from '../data/curriculum';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
  onNextLesson: () => void;
}

export default function LessonView({ lesson, onComplete, onNextLesson }: LessonViewProps) {
  const [quizState, setQuizState] = useState<{
    currentQuestion: number;
    selectedOption: number | null;
    isCorrect: boolean | null;
    isFinished: boolean;
  }>({
    currentQuestion: 0,
    selectedOption: null,
    isCorrect: null,
    isFinished: false
  });

  const handleOptionClick = (index: number) => {
    if (quizState.isCorrect !== null) return;
    
    const isCorrect = index === lesson.quiz[quizState.currentQuestion].correctIndex;
    setQuizState(prev => ({
      ...prev,
      selectedOption: index,
      isCorrect
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion + 1 < lesson.quiz.length) {
      setQuizState({
        currentQuestion: quizState.currentQuestion + 1,
        selectedOption: null,
        isCorrect: null,
        isFinished: false
      });
    } else {
      setQuizState(prev => ({ ...prev, isFinished: true }));
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tech-card p-8 mb-8"
      >
        <div className="markdown-body">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="tech-card p-8 bg-slate-900 text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="text-blue-400" />
          <h3 className="text-xl font-bold">Knowledge Check</h3>
        </div>

        <AnimatePresence mode="wait">
          {!quizState.isFinished ? (
            <motion.div
              key={quizState.currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-2xl font-medium mb-8 leading-relaxed">{lesson.quiz[quizState.currentQuestion].question}</p>
              <div className="space-y-4">
                {lesson.quiz[quizState.currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    className={cn(
                      "w-full p-5 rounded-xl text-left transition-all border-2 text-lg",
                      quizState.selectedOption === i
                        ? quizState.isCorrect
                          ? "bg-green-500/20 border-green-500 text-green-100"
                          : "bg-red-500/20 border-red-500 text-red-100"
                        : "bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {quizState.selectedOption === i && (
                        quizState.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {quizState.isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-end"
                >
                  <button
                    onClick={nextQuestion}
                    className="tech-button tech-button-primary bg-blue-600 hover:bg-blue-500"
                  >
                    {quizState.currentQuestion + 1 < lesson.quiz.length ? "Next Question" : "Complete Lesson"}
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-2">Lesson Mastered!</h4>
              <p className="text-slate-400 mb-6">You've successfully completed this module. Keep going to achieve full mastery.</p>
              <button
                onClick={onNextLesson}
                className="tech-button tech-button-primary bg-blue-600 hover:bg-blue-500 mx-auto"
              >
                Next Lesson
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
