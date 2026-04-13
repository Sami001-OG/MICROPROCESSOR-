import React, { useState, useEffect } from 'react';
import { Play, Code, Cpu, RotateCcw, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

const snippets8085 = [
  { name: 'সাধারণ যোগ', code: 'MVI A, 05H\nMVI B, 03H\nADD B\nHLT' },
  { name: 'ডেটা ট্রান্সফার', code: 'MVI C, 10H\nMOV A, C\nSTA 2000H\nHLT' },
  { name: 'লজিক্যাল AND', code: 'MVI A, 0FH\nMVI B, 05H\nANA B\nHLT' }
];

const snippets8086 = [
  { name: 'সাধারণ যোগ', code: 'MOV AX, 0005H\nMOV BX, 0003H\nADD AX, BX\nHLT' },
  { name: 'ডেটা ট্রান্সফার', code: 'MOV CX, 1000H\nMOV DX, CX\nMOV [2000H], DX\nHLT' },
  { name: 'গুণ', code: 'MOV AL, 05H\nMOV BL, 04H\nMUL BL\nHLT' }
];

export default function Emulator() {
  const [emuType, setEmuType] = useState<'8085' | '8086'>('8086');
  const snippets = emuType === '8085' ? snippets8085 : snippets8086;
  const [code, setCode] = useState(snippets[0].code);
  const [registers, setRegisters] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const resetRegisters = () => {
    setRegisters(
      emuType === '8085' 
        ? { A: '00', B: '00', C: '00', D: '00', E: '00', H: '00', L: '00', PC: '0000', SP: 'FFFF' }
        : { AX: '0000', BX: '0000', CX: '0000', DX: '0000', SI: '0000', DI: '0000', IP: '0000', SP: 'FFFF' }
    );
  };

  useEffect(() => {
    setCode(snippets[0].code);
    resetRegisters();
    setOutput([]);
  }, [emuType]);

  const runSimulation = () => {
    setIsRunning(true);
    setOutput(prev => [...prev, `[${emuType}] এক্সিকিউশন শুরু হচ্ছে...`]);
    
    setTimeout(() => {
      const lines = code.split('\\n');
      
      if (emuType === '8085') {
        if (code.includes('ADD B')) {
          setRegisters(prev => ({ ...prev, A: '08', B: '03', PC: '0004' }));
          setOutput(prev => [...prev, ...lines, 'A-তে ফলাফল: 08H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        } else if (code.includes('STA')) {
          setRegisters(prev => ({ ...prev, A: '10', C: '10', PC: '0004' }));
          setOutput(prev => [...prev, ...lines, 'মেমরি [2000H] <- 10H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        } else {
          setRegisters(prev => ({ ...prev, A: '05', B: '05', PC: '0004' }));
          setOutput(prev => [...prev, ...lines, 'A-তে ফলাফল: 05H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        }
      } else {
        if (code.includes('ADD AX')) {
          setRegisters(prev => ({ ...prev, AX: '0008', BX: '0003', IP: '0006' }));
          setOutput(prev => [...prev, ...lines, 'AX-এ ফলাফল: 0008H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        } else if (code.includes('MOV [2000H]')) {
          setRegisters(prev => ({ ...prev, CX: '1000', DX: '1000', IP: '0006' }));
          setOutput(prev => [...prev, ...lines, 'মেমরি [2000H] <- 1000H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        } else {
          setRegisters(prev => ({ ...prev, AX: '0014', BX: '0004', IP: '0006' }));
          setOutput(prev => [...prev, ...lines, 'AX-এ ফলাফল: 0014H', 'HLT - এক্সিকিউশন শেষ হয়েছে।']);
        }
      }
      setIsRunning(false);
    }, 1500);
  };

  const reset = () => {
    resetRegisters();
    setOutput([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="tech-card flex-1 flex flex-col min-h-[300px]">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Code size={18} className="text-slate-600 dark:text-slate-400" />
              <span className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">এডিটর</span>
              <div className="relative ml-2">
                <select 
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded px-2 py-1 pr-6 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                  value={emuType}
                  onChange={(e) => setEmuType(e.target.value as '8085' | '8086')}
                >
                  <option value="8085">8085</option>
                  <option value="8086">8086</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select 
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded px-2 py-1.5 pr-6 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                  onChange={(e) => {
                    const snippet = snippets.find(s => s.name === e.target.value);
                    if (snippet) {
                      setCode(snippet.code);
                      reset();
                    }
                  }}
                >
                  {snippets.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button onClick={reset} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors" title="Reset">
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={runSimulation} 
                disabled={isRunning}
                className="tech-button tech-button-primary py-1 px-3 text-xs"
              >
                <Play size={14} /> রান
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-base md:text-lg bg-slate-900 text-slate-100 outline-none resize-none"
            spellCheck={false}
          />
        </div>

        <div className="tech-card h-48 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 transition-colors duration-300">
            <Cpu size={18} className="text-slate-600 dark:text-slate-400" />
            <span className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">আউটপুট কনসোল</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm md:text-base bg-black text-green-400 overflow-y-auto">
            {output.map((line, i) => (
              <div key={i} className="mb-1">{`> ${line}`}</div>
            ))}
            {isRunning && <div className="animate-pulse">_</div>}
          </div>
        </div>
      </div>

      <div className="tech-card p-4 md:p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto transition-colors duration-300">
        <h3 className="font-bold text-lg mb-4 md:mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <Cpu className="text-slate-900 dark:text-slate-100" />
          রেজিস্টার স্ট্যাটাস
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {Object.entries(registers).map(([reg, val]) => (
            <div key={reg} className="flex items-center justify-between p-2 md:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors duration-300">
              <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-sm md:text-base">{reg}</span>
              <motion.span 
                key={val}
                initial={{ scale: 1.2, color: '#0f172a' }}
                animate={{ scale: 1, color: 'inherit' }}
                className="font-mono text-base md:text-lg font-bold text-slate-700 dark:text-slate-200"
              >
                {val}
              </motion.span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 md:mt-8 p-5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-lg transition-colors duration-300">
          <h4 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">প্রো টিপ:</h4>
          <p className="text-sm md:text-base text-blue-800 dark:text-blue-200/80 leading-relaxed">
            {emuType === '8085' ? '8085' : '8086'}-এ, {emuType === '8085' ? 'Accumulator (A)' : 'AX register'} হলো গাণিতিক ক্রিয়াকলাপের জন্য প্রাথমিক রেজিস্টার। 
            লক্ষ্য করুন কিভাবে যোগফল সেখানে সংরক্ষিত হয়।
          </p>
        </div>
      </div>
    </div>
  );
}
