import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Language config ────────────────────────────────────────────────────────────
const LANG_CONFIG = {
  python:     { monacoLang: 'python',     label: 'Python 3',   icon: '🐍', badge: 'WASM' },
  javascript: { monacoLang: 'javascript', label: 'JavaScript', icon: '⚡', badge: 'LIVE' },
  cpp:        { monacoLang: 'cpp',        label: 'C++ 17',     icon: '⚙️', badge: null   },
  java:       { monacoLang: 'java',       label: 'Java',       icon: '☕', badge: null   },
};

const JAVA_STARTER = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");

        int a = 0, b = 1;
        System.out.print("Fibonacci: ");
        for (int i = 0; i < 10; i++) {
            System.out.print(a + " ");
            int t = a + b; a = b; b = t;
        }
        System.out.println();
    }
}`;

const EDITOR_HEIGHT_NORMAL = '300px';
const EDITOR_HEIGHT_FULL   = 'calc(100vh - 140px)';

// ── Pyodide singleton (loads Python WebAssembly once, cached forever) ──────────
let pyodidePromise = null;

function loadPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/' })
        .then(resolve).catch(reject);
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
      s.onload = () => {
        window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/' })
          .then(resolve).catch(reject);
      };
      s.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(s);
    }
  });
  return pyodidePromise;
}

// ── Execution backends ─────────────────────────────────────────────────────────

// 1. JavaScript → runs directly in browser, captures console.log
function execJavaScript(code) {
  const logs = [];
  const origLog   = console.log;
  const origWarn  = console.warn;
  const origInfo  = console.info;
  const origError = console.error;
  const capture = (...args) =>
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
  console.log = console.warn = console.info = capture;
  console.error = (...a) => capture('[error]', ...a);
  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
    return { output: logs.length ? logs.join('\n') : '(No output — add console.log statements!)', isError: false };
  } catch (e) {
    if (logs.length) logs.push(`\n${e.name}: ${e.message}`);
    return { output: logs.length ? logs.join('\n') : `${e.name}: ${e.message}`, isError: true };
  } finally {
    console.log = origLog; console.warn = origWarn;
    console.info = origInfo; console.error = origError;
  }
}

// 2. Python → runs via Pyodide (WebAssembly in browser, no external API)
async function execPython(code, onProgress) {
  onProgress('Loading Python runtime (first time ~5s)…');
  const pyodide = await loadPyodide();
  onProgress('Running…');

  let stdout = '';
  let stderr = '';
  pyodide.setStdout({ batched: t => { stdout += t + '\n'; } });
  pyodide.setStderr({ batched: t => { stderr += t + '\n'; } });

  try {
    await pyodide.runPythonAsync(code);
    if (stderr.trim() && !stdout.trim()) {
      return { output: stderr.trim(), isError: true };
    }
    const combined = [stdout, stderr].filter(s => s.trim()).join('\n').trim();
    return {
      output: combined || '(No output — add print statements!)',
      isError: !!stderr.trim(),
    };
  } catch (e) {
    const partial = stdout.trim();
    return { output: partial ? `${partial}\n\n${e.message}` : e.message, isError: true };
  }
}

// 3. C++ → Godbolt Compiler Explorer (free, no auth, CORS-open)
async function execCpp(code) {
  const res = await fetch('https://godbolt.org/api/compiler/g132/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source: code,
      lang: 'c++',
      allowStoreCodeDebug: true,
      options: {
        userArguments: '-std=c++17 -O2',
        executeParameters: { args: [], stdin: '' },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [],
        libraries: [],
      },
    }),
  });
  if (!res.ok) throw new Error(`Godbolt responded with ${res.status}`);
  const data = await res.json();

  const exec = data?.execResult;
  if (!exec) {
    // compile-only response — extract asm output error
    const asmErr = (data?.asm || []).map(l => l.text).join('\n').trim();
    return { output: asmErr || 'Compilation failed with unknown error', isError: true };
  }

  const stdout = (exec.stdout || []).map(l => l.text).join('\n').trim();
  const stderr = (exec.stderr || []).map(l => l.text).join('\n').trim();

  if (exec.code !== 0 || stderr) {
    return { output: [stdout, stderr].filter(Boolean).join('\n').trim() || 'Runtime error', isError: true };
  }
  return { output: stdout || '(No output — add cout statements!)', isError: false };
}

// 4. Java → Godbolt with OpenJDK
async function execJava(code) {
  const res = await fetch('https://godbolt.org/api/compiler/java2100/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source: code,
      lang: 'java',
      allowStoreCodeDebug: true,
      options: {
        userArguments: '',
        executeParameters: { args: [], stdin: '' },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [],
        libraries: [],
      },
    }),
  });
  if (!res.ok) throw new Error(`Godbolt responded with ${res.status}`);
  const data = await res.json();

  const exec = data?.execResult;
  if (!exec) {
    const asmErr = (data?.asm || []).map(l => l.text).join('\n').trim();
    return { output: asmErr || 'Compilation failed', isError: true };
  }

  const stdout = (exec.stdout || []).map(l => l.text).join('\n').trim();
  const stderr = (exec.stderr || []).map(l => l.text).join('\n').trim();

  if (exec.code !== 0 || stderr) {
    return { output: [stdout, stderr].filter(Boolean).join('\n').trim() || 'Runtime error', isError: true };
  }
  return { output: stdout || '(No output — add System.out.println statements!)', isError: false };
}

// ── Master execute function ───────────────────────────────────────────────────
async function executeCode(lang, code, onProgress) {
  switch (lang) {
    case 'javascript': return execJavaScript(code);
    case 'python':     return execPython(code, onProgress);
    case 'cpp':        return execCpp(code);
    case 'java':       return execJava(code);
    default:           return { output: 'Language not supported', isError: true };
  }
}

// ── Editor Shell ──────────────────────────────────────────────────────────────
function EditorShell({
  lang, code, fontSize, statusKind, output, running, progressMsg,
  isFullscreen, editorHeight, availableLangs,
  onLangChange, onCodeChange, onRun, onReset, onCopy,
  onFontInc, onFontDec, onToggleFullscreen, onClearOutput,
}) {
  const cfg = LANG_CONFIG[lang];
  return (
    <div className={`flex flex-col bg-gray-950 ${isFullscreen ? 'h-full' : 'rounded-2xl overflow-hidden shadow-2xl'}`}>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex-wrap gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 flex-wrap">
          {availableLangs.map(l => {
            const c = LANG_CONFIG[l];
            return (
              <button key={l} onClick={() => onLangChange(l)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === l ? 'bg-gfg-green text-white shadow-md' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}>
                {c.icon} {c.label}
                {c.badge && (
                  <span className="text-[9px] bg-blue-600 text-white px-1 py-0.5 rounded leading-none">{c.badge}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onFontDec} className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs bg-gray-800">A-</button>
          <span className="text-gray-500 text-xs w-8 text-center">{fontSize}px</span>
          <button onClick={onFontInc} className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs bg-gray-800">A+</button>
          <button onClick={onCopy}  title="Copy"  className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs bg-gray-800">📋</button>
          <button onClick={onReset} title="Reset" className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs bg-gray-800">↺</button>
          <button onClick={onToggleFullscreen} className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs bg-gray-800">
            {isFullscreen ? '⊡ Exit' : '⛶ Full'}
          </button>
        </div>
      </div>

      {/* Monaco — explicit px height prevents blank collapse */}
      <div style={{ height: editorHeight, flexShrink: 0 }}>
        <Editor
          height="100%"
          language={cfg.monacoLang}
          value={code}
          onChange={v => onCodeChange(v ?? '')}
          theme="vs-dark"
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono','Fira Code',Consolas,monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 14, bottom: 14 },
            lineNumbers: 'on',
            wordWrap: 'on',
            tabSize: 4,
          }}
        />
      </div>

      {/* Run bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="text-xs flex items-center gap-2">
          {statusKind === 'success' && <span className="text-green-400 font-semibold">✅ Ran successfully</span>}
          {statusKind === 'error'   && <span className="text-red-400   font-semibold">❌ Error detected</span>}
          {running && progressMsg   && <span className="text-yellow-400 font-semibold animate-pulse">{progressMsg}</span>}
        </div>
        <button onClick={onRun} disabled={running}
          className="btn-primary text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[115px] justify-center">
          {running
            ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Running…</>
            : <>▶ Run Code</>}
        </button>
      </div>

      {/* Output panel */}
      <AnimatePresence>
        {(statusKind !== null || running) && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="border-t border-gray-800 overflow-hidden flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-b border-gray-800">
              <span className="text-gray-400 text-xs font-mono font-semibold uppercase tracking-wider">Output</span>
              {statusKind !== null && (
                <button onClick={onClearOutput} className="text-gray-600 hover:text-gray-400 text-xs">✕ Clear</button>
              )}
            </div>
            <pre className={`px-4 py-3 text-sm font-mono overflow-auto max-h-48 leading-relaxed whitespace-pre-wrap ${
              statusKind === 'error' ? 'text-red-400' : 'text-green-300'
            }`}>
              {running
                ? <span className="text-yellow-400 animate-pulse">{progressMsg || '▶ Executing…'}</span>
                : output}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CodeEditor({ starterCode, defaultLang = 'python' }) {
  const availableLangs = Object.keys(LANG_CONFIG).filter(
    l => l === 'java' || (starterCode?.[l] && starterCode[l].trim() !== '')
  );
  const initLang = availableLangs.includes(defaultLang) ? defaultLang : (availableLangs[0] || 'python');

  const [lang, setLang]             = useState(initLang);
  const [code, setCode]             = useState(initLang === 'java' ? JAVA_STARTER : (starterCode?.[initLang] || ''));
  const [output, setOutput]         = useState('');
  const [running, setRunning]       = useState(false);
  const [statusKind, setStatusKind] = useState(null);
  const [progressMsg, setProgressMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize]     = useState(14);

  const handleLangChange = nl => {
    setLang(nl);
    setCode(nl === 'java' ? JAVA_STARTER : (starterCode?.[nl] || ''));
    setOutput(''); setStatusKind(null); setProgressMsg('');
  };

  const runCode = async () => {
    if (!code.trim()) return;
    setRunning(true); setOutput(''); setStatusKind(null); setProgressMsg('');
    try {
      const result = await executeCode(lang, code, setProgressMsg);
      setOutput(result.output);
      setStatusKind(result.isError ? 'error' : 'success');
    } catch (err) {
      setOutput(`❌ ${err.message}`);
      setStatusKind('error');
    } finally {
      setRunning(false); setProgressMsg('');
    }
  };

  const clearOutput  = () => { setOutput(''); setStatusKind(null); };
  const resetCode    = () => { setCode(lang === 'java' ? JAVA_STARTER : (starterCode?.[lang] || '')); clearOutput(); };
  const copyCode     = () => navigator.clipboard?.writeText(code);

  const shared = {
    lang, code, fontSize, statusKind, output, running, progressMsg, availableLangs,
    onLangChange: handleLangChange, onCodeChange: setCode,
    onRun: runCode, onReset: resetCode, onCopy: copyCode,
    onFontInc: () => setFontSize(f => Math.min(22, f + 2)),
    onFontDec: () => setFontSize(f => Math.max(10, f - 2)),
    onClearOutput: clearOutput,
  };

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950">
          <EditorShell {...shared} isFullscreen editorHeight={EDITOR_HEIGHT_FULL}
            onToggleFullscreen={() => setIsFullscreen(false)} />
        </div>
      )}
      <div className={isFullscreen ? 'invisible h-0 overflow-hidden' : ''}>
        <EditorShell {...shared} isFullscreen={false} editorHeight={EDITOR_HEIGHT_NORMAL}
          onToggleFullscreen={() => setIsFullscreen(true)} />
      </div>
    </>
  );
}
