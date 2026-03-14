import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/CodeEditor';
import { tracks } from '../data/lessons';

const difficultyBadge = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-red-100 text-red-700',
};

export default function Learn() {
  const [activeTrack, setActiveTrack]   = useState(tracks[0]);
  const [activeLesson, setActiveLesson] = useState(tracks[0].lessons[0]);
  const [tab, setTab] = useState('theory'); // 'theory' | 'code' | 'challenge'
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const markComplete = () => {
    setCompletedLessons(prev => new Set([...prev, activeLesson.id]));
  };

  const totalLessons = tracks.reduce((sum, t) => sum + t.lessons.length, 0);
  const progressPct = Math.round((completedLessons.size / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* ── TOP HEADER BAR ── */}
      <div className="bg-gradient-to-r from-gfg-green-dark to-gfg-green sticky top-16 z-30 shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Toggle sidebar"
            >
              ☰
            </button>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">🎓 Learning Hub</h1>
              <p className="text-gfg-green-pale text-xs">{activeLesson.title}</p>
            </div>
          </div>

          {/* Global progress */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gfg-green-pale">Overall Progress</p>
              <p className="text-white font-bold text-sm">{completedLessons.size}/{totalLessons} Lessons</p>
            </div>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-white font-bold text-sm">{progressPct}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto flex h-[calc(100vh-8rem)]">
        {/* ── LEFT SIDEBAR ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden"
            >
              <div className="p-4 space-y-4 min-w-[288px]">
                {tracks.map((track) => {
                  const trackDone = track.lessons.filter(l => completedLessons.has(l.id)).length;
                  const isActiveTrack = activeTrack.id === track.id;
                  return (
                    <div key={track.id}>
                      {/* Track Header */}
                      <button
                        onClick={() => { setActiveTrack(track); setActiveLesson(track.lessons[0]); setTab('theory'); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                          isActiveTrack ? 'bg-gfg-green-pale border border-gfg-green/20' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{track.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${isActiveTrack ? 'text-gfg-green' : 'text-gray-800'}`}>
                            {track.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gfg-green rounded-full transition-all"
                                style={{ width: `${track.lessons.length > 0 ? (trackDone / track.lessons.length) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{trackDone}/{track.lessons.length}</span>
                          </div>
                        </div>
                      </button>

                      {/* Lessons */}
                      {isActiveTrack && (
                        <div className="ml-4 pl-3 border-l-2 border-gfg-green/20 mt-1 space-y-1">
                          {track.lessons.map((lesson, idx) => {
                            const done = completedLessons.has(lesson.id);
                            const isActive = activeLesson.id === lesson.id;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => { setActiveLesson(lesson); setTab('theory'); }}
                                className={`w-full text-left p-2.5 rounded-lg transition-all ${
                                  isActive ? 'bg-gfg-green text-white' : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    done ? (isActive ? 'bg-white/20 text-white' : 'bg-gfg-green text-white') :
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                                  }`}>
                                    {done ? '✓' : idx + 1}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate leading-tight">{lesson.title}</p>
                                    <p className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                                      {lesson.duration}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-5xl mx-auto">
            {/* Lesson Header */}
            <motion.div
              key={activeLesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${activeTrack.color}`}>
                      {activeTrack.icon} {activeTrack.title}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyBadge[activeLesson.difficulty]}`}>
                      {activeLesson.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">🕐 {activeLesson.duration}</span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">{activeLesson.title}</h2>
                </div>
                {!completedLessons.has(activeLesson.id) ? (
                  <button onClick={markComplete} className="btn-primary text-sm flex-shrink-0">
                    ✓ Mark Complete
                  </button>
                ) : (
                  <span className="text-gfg-green font-bold text-sm flex items-center gap-1.5 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
                    ✅ Completed
                  </span>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                {[
                  { key: 'theory',    label: '📖 Theory' },
                  { key: 'code',      label: '💻 Code & Run' },
                  { key: 'challenge', label: '🎯 Challenge' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      tab === key ? 'bg-white shadow-sm text-gfg-green' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── THEORY TAB ── */}
              <AnimatePresence mode="wait">
                {tab === 'theory' && (
                  <motion.div
                    key="theory"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                      <div className="prose prose-gray max-w-none">
                        {activeLesson.theory.split('\n').map((line, i) => {
                          if (line.startsWith('## '))
                            return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{line.slice(3)}</h2>;
                          if (line.startsWith('### '))
                            return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
                          if (line.startsWith('```'))
                            return null;
                          if (line.startsWith('| '))
                            return null; // table handled below
                          if (line.trim() === '')
                            return <br key={i} />;
                          // Bold + inline code
                          const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                          return (
                            <p key={i} className="text-gray-600 leading-relaxed mb-1">
                              {parts.map((p, j) => {
                                if (p.startsWith('**') && p.endsWith('**'))
                                  return <strong key={j} className="text-gray-900 font-semibold">{p.slice(2, -2)}</strong>;
                                if (p.startsWith('`') && p.endsWith('`'))
                                  return <code key={j} className="bg-gray-100 text-gfg-green font-mono text-sm px-1.5 py-0.5 rounded">{p.slice(1, -1)}</code>;
                                return p;
                              })}
                            </p>
                          );
                        })}
                      </div>
                      {/* Code blocks from theory */}
                      {activeLesson.theory.split('```').filter((_, i) => i % 2 === 1).map((block, i) => {
                        const lines = block.split('\n');
                        const lang = lines[0];
                        const code = lines.slice(1).join('\n').trim();
                        return (
                          <div key={i} className="mt-4 bg-gray-900 rounded-xl overflow-hidden">
                            {lang && <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 font-mono">{lang || 'code'}</div>}
                            <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre">{code}</pre>
                          </div>
                        );
                      })}

                      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => setTab('code')}
                          className="btn-primary flex items-center gap-2"
                        >
                          Continue to Code Editor →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── CODE TAB ── */}
                {tab === 'code' && (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="bg-gfg-green-pale border border-gfg-green/20 rounded-xl px-5 py-3 text-sm text-gfg-green-dark font-medium flex items-center gap-2">
                      💡 Edit the code below, then click <strong>▶ Run Code</strong> to see the live output.
                      Powered by <a href="https://piston.emkc.org" target="_blank" rel="noreferrer" className="underline">Piston API</a>.
                    </div>
                    <CodeEditor starterCode={activeLesson.starterCode} defaultLang={
                      activeLesson.starterCode.python ? 'python' :
                      activeLesson.starterCode.javascript ? 'javascript' : 'cpp'
                    } />

                    <div className="flex justify-end">
                      <button onClick={() => setTab('challenge')} className="btn-primary flex items-center gap-2">
                        Try the Challenge →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── CHALLENGE TAB ── */}
                {tab === 'challenge' && (
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Challenge Card */}
                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
                      <h3 className="font-black text-xl mb-2">{activeLesson.challenge.title}</h3>
                      <p className="text-purple-100 leading-relaxed mb-4">{activeLesson.challenge.description}</p>
                      <details className="cursor-pointer">
                        <summary className="text-purple-200 text-sm font-semibold hover:text-white transition-colors select-none">
                          💡 Show Hint
                        </summary>
                        <p className="mt-2 text-purple-100 text-sm bg-white/10 rounded-lg p-3 leading-relaxed">
                          {activeLesson.challenge.hint}
                        </p>
                      </details>
                    </div>

                    {/* Blank editor for the challenge */}
                    <CodeEditor
                      starterCode={{
                        python: `# Your solution here\n# ${activeLesson.challenge.title}\n\n`,
                        javascript: `// Your solution here\n// ${activeLesson.challenge.title}\n\n`,
                        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}\n`,
                        java: '',
                      }}
                      defaultLang="python"
                    />

                    {!completedLessons.has(activeLesson.id) && (
                      <div className="flex justify-end">
                        <button onClick={markComplete} className="btn-primary flex items-center gap-2">
                          ✓ I solved it! Mark Complete
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
