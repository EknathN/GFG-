import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../context/AuthContext';

// Mock practice problems
const practiceProblems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 100,
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    hint: 'You can use a Hash Map to store the numbers you have seen so far.',
    starterCode: {
      python: 'def two_sum(nums, target):\n    # Write your code here\n    pass\n',
      javascript: 'function twoSum(nums, target) {\n    // Write your code here\n}\n',
      cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}\n'
    }
  },
  {
    id: 2,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    points: 100,
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    hint: 'Use three pointers: prev, curr, and next.',
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef reverse_list(head):\n    # Write your code here\n    pass\n',
      javascript: '/*\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction reverseList(head) {\n    // Write your code here\n}\n',
      cpp: '/**\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\n\nListNode* reverseList(ListNode* head) {\n    // Write your code here\n    return NULL;\n}\n'
    }
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    points: 250,
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    hint: 'Use a sliding window approach with a Set or Map to keep track of characters.',
    starterCode: {
      python: 'def length_of_longest_substring(s: str) -> int:\n    # Write your code here\n    pass\n',
      javascript: 'function lengthOfLongestSubstring(s) {\n    // Write your code here\n}\n',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Write your code here\n    return 0;\n}\n'
    }
  },
  {
    id: 4,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    points: 500,
    description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    hint: 'You can use a Min-Heap (Priority Queue) to always get the smallest element among all the heads of the lists.',
    starterCode: {
      python: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef merge_k_lists(lists):\n    # Write your code here\n    pass\n',
      javascript: '/*\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction mergeKLists(lists) {\n    // Write your code here\n}\n',
      cpp: '/**\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\n\nListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your code here\n    return NULL;\n}\n'
    }
  }
];

const difficultyBadge = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

export default function Practice() {
  const [activeProblem, setActiveProblem] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPoints } = useAuth();

  const handleEarnPoints = async () => {
    if (!activeProblem) return;
    setIsSubmitting(true);
    try {
      // Simulate verifying the code against test cases
      await new Promise(r => setTimeout(r, 1500));
      
      await addPoints(activeProblem.points);
      
      setSolvedProblems(prev => new Set([...prev, activeProblem.id]));
      alert(`🎉 Correct! You've earned ${activeProblem.points} Global Leaderboard points!`);
    } catch (err) {
      alert('Error updating points: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* ── TOP HEADER BAR ── */}
      <div className="bg-gradient-to-r from-gfg-green-dark to-gfg-green sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-white font-black text-xl leading-tight">💻 Practice Problems</h1>
            <p className="text-gfg-green-pale text-sm hidden sm:block">Solve coding challenges, run your code, and climb the Global Leaderboard.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
                <p className="text-white font-bold text-sm">{solvedProblems.size} / {practiceProblems.length}</p>
                <p className="text-gfg-green-pale text-xs">Solved</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* ── LEFT: PROBLEM LIST ── */}
        <div className="w-full lg:w-1/3 space-y-3">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Problem List</h2>
          {practiceProblems.map(problem => {
            const isSolved = solvedProblems.has(problem.id);
            const isActive = activeProblem?.id === problem.id;
            
            return (
              <button
                key={problem.id}
                onClick={() => setActiveProblem(problem)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  isActive 
                    ? 'bg-gfg-green-pale border-gfg-green shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${isActive ? 'text-gfg-green-dark' : 'text-gray-900'} truncate mr-2`}>
                    {problem.title}
                  </h3>
                  {isSolved && <span className="text-gfg-green bg-green-100 rounded-full px-2 py-0.5 text-xs font-bold shrink-0">✓</span>}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`px-2 py-0.5 rounded-full ${difficultyBadge[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    ⭐ {problem.points} pts
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── RIGHT: WORKSPACE ── */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            {!activeProblem ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-3xl p-10"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 text-gray-400 border border-gray-100">
                  ⌨️
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Problem</h2>
                <p className="text-gray-500 max-w-sm">Choose a problem from the list on the left to start coding and earning points.</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeProblem.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Problem Description */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex justify-between flex-wrap gap-4 items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">{activeProblem.title}</h2>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className={`px-3 py-1 rounded-full ${difficultyBadge[activeProblem.difficulty]}`}>
                          {activeProblem.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                          ⭐ Earn {activeProblem.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p className="leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 font-medium">
                      {activeProblem.description.split('`').map((text, i) => 
                        i % 2 === 1 ? <code key={i} className="text-gfg-green bg-gfg-green-pale px-1 rounded">{text}</code> : text
                      )}
                    </p>
                    <details className="cursor-pointer">
                      <summary className="text-gray-500 font-semibold text-sm hover:text-gray-800 transition-colors select-none w-max">
                        💡 Show Hint
                      </summary>
                      <p className="mt-2 text-sm text-gray-500 bg-gray-50 border-l-4 border-gfg-green p-3 rounded-r-lg">
                        {activeProblem.hint}
                      </p>
                    </details>
                  </div>
                </div>

                {/* Editor */}
                <CodeEditor 
                  starterCode={activeProblem.starterCode} 
                  defaultLang="python"
                />

                {/* Submit Action */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 max-w-xs">
                    Satisfied with your output? Submit your solution to claim your leaderboard points.
                  </div>
                  <button 
                    onClick={handleEarnPoints}
                    disabled={solvedProblems.has(activeProblem.id) || isSubmitting}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      solvedProblems.has(activeProblem.id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-200'
                        : 'bg-gfg-green hover:bg-gfg-green-dark text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                       <><span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Running Tests...</>
                    ) : solvedProblems.has(activeProblem.id) ? (
                       '✅ Completed'
                    ) : (
                       `Submit & Claim ${activeProblem.points} pts`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
