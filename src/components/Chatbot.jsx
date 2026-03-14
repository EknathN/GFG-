import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Club Knowledge Base ────────────────────────────────────────────────────────
const BOT_RESPONSES = [
  {
    keywords: ['join', 'membership', 'become member', 'sign up', 'enroll', 'register club'],
    answer: `To join the GFG Campus Club @ RIT:\n\n1. Go to the **Contact** page and fill out the "Join Club" form\n2. Or email us at **gfgclub@rit.edu.in**\n3. Join our WhatsApp & Discord communities (links on the Contact page)\n\nWe welcome all branches and years! 🚀`,
  },
  {
    keywords: ['event', 'upcoming', 'schedule', 'workshop', 'session', 'bootcamp', 'contest', 'activity'],
    answer: `📅 **Upcoming Events:**\n\n1. **DSA Bootcamp – Arrays & Strings** — Mar 20 | 5–7 PM | CLT 2108 (Offline)\n2. **Resume & LinkedIn Review** — Mar 25 | 3–5 PM | Google Meet (Online)\n3. **GFG POTD Contest** — Apr 1 | 10 AM–12 PM | Online\n4. **Graph Theory Masterclass** — Apr 8 | 6–8 PM | LHC 101 (Offline)\n5. **Mock Placement Interviews** — Apr 15 | 2–6 PM | CLT Labs (Offline)\n6. **Hackathon Prep Sprint** — Apr 22 | 4–7 PM | Google Meet (Online)\n\nRegister on the Events page! 🎉`,
  },
  {
    keywords: ['mock interview', 'placement interview', 'interview prep'],
    answer: `🎯 **Mock Placement Interviews**\n\nDate: **April 15, 2026**\nTime: 2:00 PM – 6:00 PM\nVenue: CLT Labs, RIT (Offline)\nSeats: 20 (limited!)\n\nOne-on-one mock interviews simulating top product company rounds, with guaranteed feedback. Register on the Events page before seats fill up!`,
  },
  {
    keywords: ['dsa', 'data structure', 'algorithm', 'improve', 'learn coding', 'practice', 'prepare'],
    answer: `💡 **How to improve your DSA skills:**\n\n1. **Start with:** Striver's A2Z DSA Sheet (450+ problems)\n2. **Practice daily:** GFG Problem of the Day\n3. **Contest weekly:** Codeforces Div 3/4 → Div 2\n4. **Use our Learning Hub:** built-in code editor for Python, C++, JS, Java\n5. **Attend:** our weekly DSA workshop sessions\n\nCheck the Resources page for all curated links! 📚`,
  },
  {
    keywords: ['resource', 'material', 'sheet', 'link', 'study', 'leetcode', 'striver', 'blind 75'],
    answer: `📚 **Club Resources (all on Resources page):**\n\n**DSA Sheets:** Striver's A2Z, GFG 450, Blind 75 LeetCode\n**Learning Paths:** GFG Self-Paced, CS50 Harvard, The Odin Project\n**Competitive Programming:** Codeforces, CodeChef, AtCoder\n**Interview Prep:** LeetCode, InterviewBit, Pramp (free mock interviews)\n\nAll links are curated and handpicked by the club! 🎯`,
  },
  {
    keywords: ['leaderboard', 'top', 'rank', 'ranking', 'best', 'topper', 'points', 'streak'],
    answer: `🏆 **March 2026 Leaderboard (Top 5):**\n\n🥇 Arjun Sharma — 4,820 pts | 312 problems | 45-day streak\n🥈 Priya Nair — 4,510 pts | 290 problems | 38-day streak\n🥉 Rohan Kulkarni — 4,280 pts | 271 problems | 30-day streak\n⭐ Ananya Desai — 3,940 pts | 248 problems\n⭐ Karthik Rao — 3,720 pts | 235 problems\n\nCheck the Community page for the full leaderboard! 🚀`,
  },
  {
    keywords: ['contact', 'email', 'reach', 'location', 'address', 'whatsapp', 'discord', 'instagram', 'linkedin', 'social'],
    answer: `📬 **Contact the Club:**\n\n📧 Email: **gfgclub@rit.edu.in**\n📍 Office: CLT 2108, RIT Campus, Bangalore\n🕐 Response: within 24–48 hours\n\n**Community Groups:**\n💼 LinkedIn · 💬 WhatsApp · 🎮 Discord · 📸 Instagram @gfgclub_rit\n\nAll links are on the Contact page!`,
  },
  {
    keywords: ['hackathon', 'hack', 'team', 'project'],
    answer: `💻 **Hackathon Prep Sprint**\n\nDate: **April 22, 2026**\nTime: 4:00 PM – 7:00 PM\nMode: Online (Google Meet)\nSeats: 60\n\nCovers team formation, ideation, and full-stack tech stack selection for upcoming hackathons. Register on the Events page! 🚀`,
  },
  {
    keywords: ['blog', 'article', 'post', 'write', 'share', 'story'],
    answer: `📝 **Club Blog Section:**\n\nOur members share their journeys on the Community page! Recent posts:\n\n• "How I cracked my first SDE Internship" – Arjun Sharma\n• "Dynamic Programming Patterns Every Coder Should Know" – Priya Nair\n• "A Beginner's Guide to CP at RIT" – Rohan Kulkarni\n• "Building a Full-Stack Project That Impressed Interviewers" – Ananya Desai\n\nWant to submit your blog post? Email **gfgclub@rit.edu.in**! ✍️`,
  },
  {
    keywords: ['member', 'how many', 'size', 'count', 'stat', 'achievement', 'placed', 'placement'],
    answer: `📊 **GFG Club @ RIT Stats:**\n\n👥 **200+** Active Members\n📅 **45+** Events Hosted\n💻 **10,000+** Problems Solved Collectively\n🏆 **80+** Members Placed in Top Companies\n\nWe're growing every semester — and you should be part of it! 🚀`,
  },
  {
    keywords: ['learn', 'learning hub', 'code editor', 'compiler', 'run code', 'execute'],
    answer: `🎓 **Learning Hub** (our best feature!):\n\nHead to the **Learn** page in the navbar. You get:\n\n• **4 Learning Tracks:** DSA, Python, Web Dev, Competitive Programming\n• **Interactive lessons** with theory + code editor in-browser\n• **Live code execution:** write & run Python, C++, JavaScript, Java\n• **Challenges** at the end of every lesson\n• **Progress tracking** — mark lessons complete!\n\nNo installation needed — code right in your browser! 💻`,
  },
  {
    keywords: ['graph', 'tree', 'bfs', 'dfs', 'dijkstra'],
    answer: `🕸️ **Graph Theory Masterclass**\n\nDate: **April 8, 2026**\nTime: 6:00 PM – 8:00 PM\nVenue: LHC 101, RIT (Offline)\nSeats: 35\n\nTopics: BFS, DFS, Dijkstra's algorithm, and real-world graph problems. Aimed at intermediate programmers.\n\nRegister on the Events page! Also, check the DSA track in our Learning Hub. 📚`,
  },
  {
    keywords: ['resume', 'linkedin', 'cv', 'job', 'career', 'internship'],
    answer: `💼 **Career Support:**\n\n**Resume & LinkedIn Review Drive:**\nDate: March 25 | 3–5 PM | Google Meet\n\nSenior members and alumni will review your resume and LinkedIn profile one-on-one and give personalized feedback.\n\nAlso check the **Mock Placement Interviews** on April 15 for full interview prep! Register on the Events page. 🎯`,
  },
  {
    keywords: ['python', 'beginner', 'start', 'new', 'newbie', 'zero'],
    answer: `🐍 **New to coding? Start here:**\n\n1. **Learning Hub →** Python for Beginners track\n   - Variables & basics, Functions & Recursion\n   - Run real Python code in your browser!\n2. **Resources →** CS50 (Harvard free course), GFG Self-Paced\n3. **Attend:** our beginner-friendly DSA Bootcamp (Mar 20)\n\nEveryone starts somewhere — the club is here to help! 💚`,
  },
  {
    keywords: ['competitive programming', 'cp', 'codeforces', 'codechef', 'atcoder', 'competitive'],
    answer: `⚡ **Competitive Programming @ GFG Club:**\n\n**Platforms we recommend:**\n• Codeforces — start at Div 4, aim for Div 2\n• CodeChef — monthly long challenges\n• AtCoder — great quality problems\n• GFG POTD — daily practice\n\n**Club Activities:**\n• Weekly POTD discussions\n• GFG POTD Contest — April 1 (online)\n• Hackathon Prep Sprint — April 22\n\nAlso check the **Competitive Programming** track in our Learning Hub! 🏆`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'sup', 'hii'],
    answer: `Hey there! 👋 I'm **GFG Bot**, the official assistant for the GFG Campus Club @ RIT!\n\nI can help you with:\n• 📅 Upcoming events & registration\n• 🏆 Leaderboard & community\n• 📚 Learning resources\n• 🎓 Learning Hub & code editor\n• 📬 How to join & contact info\n\nWhat would you like to know? 💚`,
  },
  {
    keywords: ['thank', 'thanks', 'helpful', 'great', 'awesome', 'nice'],
    answer: `You're welcome! 😊 Happy to help!\n\nKeep coding and don't forget to check out upcoming events. See you at the next session! 💚🚀`,
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'cya', 'later'],
    answer: `Goodbye! 👋 Keep coding and stay curious!\n\nRemember: **consistency > intensity** in DSA prep. See you at the next club event! 💚`,
  },
];

const FALLBACK = `I'm not sure about that specific question 🤔\n\nI specialize in GFG Campus Club @ RIT info. Try asking about:\n• **Events** — upcoming workshops and contests\n• **Resources** — DSA sheets and learning paths\n• **Learning Hub** — in-browser code editor\n• **Leaderboard** — top club members\n• **How to join** the club\n\nOr email us: **gfgclub@rit.edu.in** 📧`;

const QUICK_QUESTIONS = [
  'How do I join the club?',
  'What events are coming up?',
  'Who is on top of the leaderboard?',
  'What resources does the club provide?',
  'Tell me about the Learning Hub',
  'How can I improve my DSA skills?',
];

function getBotReply(userText) {
  const lower = userText.toLowerCase();
  for (const entry of BOT_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return FALLBACK;
}

// Simple bold+newline markdown renderer
function RenderText({ text }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j}>{p.slice(2, -2)}</strong>
                : p
            )}
            {i < arr.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [messages, setMessages]   = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **GFG Bot** 🤖 — your guide to everything about the GFG Campus Club @ RIT!\n\nAsk me about events, resources, how to join, the leaderboard, or our Learning Hub. I'm here to help! 💚",
    },
  ]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    setShowQuick(false);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    // Simulate a brief "thinking" delay for natural feel
    setTimeout(() => {
      const reply = getBotReply(userText);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared! Ask me anything about the GFG Campus Club @ RIT 💚" }]);
    setShowQuick(true);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gfg-green rounded-full shadow-2xl flex items-center justify-center hover:bg-gfg-green-dark transition-colors"
        aria-label="Open Club Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-xl font-bold">✕</motion.span>
            : <motion.span key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-2xl">🤖</motion.span>
          }
        </AnimatePresence>
        {!isOpen && <span className="absolute w-14 h-14 rounded-full bg-gfg-green opacity-30 animate-ping" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gfg-green-dark to-gfg-green px-4 py-3.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">GFG Bot</p>
                  <p className="text-gfg-green-pale text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    Online · GFG Campus Club @ RIT
                  </p>
                </div>
              </div>
              <button onClick={clearChat} className="text-white/60 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors">
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-gfg-green rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[78%] ${
                    msg.role === 'user'
                      ? 'bg-gfg-green text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}>
                    <RenderText text={msg.content} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 bg-gfg-green rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 bg-gfg-green rounded-full" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick questions */}
              {showQuick && messages.length === 1 && !isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                  <p className="text-xs text-gray-400 font-medium px-1">Quick questions:</p>
                  {QUICK_QUESTIONS.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs bg-white border border-gray-200 hover:border-gfg-green hover:bg-gfg-green-pale text-gray-600 hover:text-gfg-green px-3 py-2 rounded-xl transition-all">
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-gfg-green focus-within:ring-2 focus-within:ring-gfg-green/20 transition-all px-3 py-2">
                <textarea ref={inputRef} rows={1} value={input}
                  onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Ask about the club, events, resources…"
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed max-h-24"
                  style={{ minHeight: '24px' }}
                />
                <button onClick={() => sendMessage()} disabled={isTyping || !input.trim()}
                  className="w-8 h-8 bg-gfg-green rounded-lg flex items-center justify-center text-white hover:bg-gfg-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 text-center">GFG Club AI Assistant · Always Online</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
