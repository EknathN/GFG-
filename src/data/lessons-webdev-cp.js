export const webdevTrack = {
  id: 'webdev', title: 'Web Development', icon: '🌐',
  color: 'bg-orange-100 text-orange-700 border-orange-200',
  headerColor: 'from-orange-500 to-orange-700',
  lessons: [
    {
      id: 'js-basics', title: 'JavaScript Fundamentals', difficulty: 'Beginner', duration: '15 min',
      theory: `## JavaScript Basics\nJS is the language of the web. It runs in the browser and on servers (Node.js).\n\n### Variables\n- \`const\` — block-scoped, can't reassign\n- \`let\` — block-scoped, reassignable\n- \`var\` — function-scoped (avoid)\n\n### Key features\n- Dynamic typing\n- First-class functions\n- Prototype-based OOP\n- Event-driven, async-friendly`,
      starterCode: {
        python: ``, cpp: ``,
        javascript: `// Types and coercion
console.log(typeof "hello", typeof 42, typeof true, typeof undefined);
console.log(typeof null);    // "object" — historic JS quirk
console.log(typeof function(){}); // "function"

// Truthy / Falsy
const falsy = [false, 0, "", null, undefined, NaN];
falsy.forEach(v => console.log(v, "→", Boolean(v)));

// Template literals
const name = "GFG Coder", score = 9.2;
console.log(\`\\nHello \${name}! Your score is \${score}\`);
console.log(\`Grade: \${score >= 9 ? "Distinction" : "First Class"}\`);

// Destructuring
const [a, b, ...rest] = [1,2,3,4,5];
console.log("\\na:", a, "b:", b, "rest:", rest);
const { x=0, y=0, z=0 } = { x:10, y:20 };
console.log("x:", x, "y:", y, "z:", z);

// Spread
const arr1=[1,2,3], arr2=[4,5,6];
console.log("\\nMerged:", [...arr1,...arr2]);
const obj = { name:"Alice", ...{ age:20, grade:"A"} };
console.log("Merged obj:", JSON.stringify(obj));`,
      },
      challenge: { title: '🎯 Array Flattening', description: 'Flatten a deeply nested array [[1,[2,3]],[4,[5,[6]]]] into [1,2,3,4,5,6] without using .flat()', hint: 'Use recursion: for each element, if it\'s an array recurse, else push to result.' },
    },
    {
      id: 'js-arrays', title: 'Array Methods Mastery', difficulty: 'Beginner', duration: '15 min',
      theory: `## JavaScript Array Methods\nThese are must-know for interviews and real-world coding.\n\n| Method | Purpose | Returns |\n|---|---|---|\n|map|Transform elements|New array|\n|filter|Keep matching|New array|\n|reduce|Accumulate|Single value|\n|find|First match|Element|\n|some/every|Test condition|Boolean|\n|flat/flatMap|Flatten|New array|`,
      starterCode: {
        python: ``, cpp: ``,
        javascript: `const students = [
  {name:"Arjun", score:92, branch:"CSE"},
  {name:"Priya", score:88, branch:"ECE"},
  {name:"Rohan", score:95, branch:"CSE"},
  {name:"Ananya", score:78, branch:"IT"},
  {name:"Karthik", score:85, branch:"CSE"},
];

// map — transform
const names = students.map(s => s.name);
console.log("Names:", names.join(", "));

// filter — keep matching
const cse = students.filter(s => s.branch === "CSE");
console.log("CSE:", cse.map(s=>s.name).join(", "));

// reduce — accumulate
const avg = students.reduce((sum,s)=>sum+s.score,0)/students.length;
console.log("Average score:", avg.toFixed(1));

// find
const topper = students.reduce((a,b)=>a.score>b.score?a:b);
console.log("Topper:", topper.name, "with", topper.score);

// sort + chaining
const ranked = [...students]
  .sort((a,b)=>b.score-a.score)
  .map((s,i)=>\`\${i+1}. \${s.name} (\${s.score})\`);
console.log("\\nRanking:");
ranked.forEach(r=>console.log(" ",r));

// some / every
console.log("\\nAny score > 90?", students.some(s=>s.score>90));
console.log("All score > 70?", students.every(s=>s.score>70));`,
      },
      challenge: { title: '🎯 Group by Branch', description: 'Using reduce, group students by their branch into an object {CSE:[...], ECE:[...]}.', hint: 'In the reducer, check if acc[branch] exists; if not create empty array, then push student.' },
    },
    {
      id: 'js-async', title: 'Async JS — Promises & Async/Await', difficulty: 'Intermediate', duration: '20 min',
      theory: `## Asynchronous JavaScript\nJS is single-threaded but handles async ops via the **event loop**.\n\n### Evolution\n1. **Callbacks** — nested, leads to "callback hell"\n2. **Promises** — chainable .then()/.catch()\n3. **async/await** — looks synchronous, is async\n\n### Promise states\n- **Pending** → **Fulfilled** (resolve) or **Rejected** (reject)\n\n### Error handling\nAlways use \`.catch()\` or \`try/catch\` with async/await!`,
      starterCode: {
        python: ``, cpp: ``,
        javascript: `// Simulate API calls
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: \`User_\${id}\`, score: id * 10 });
      else reject(new Error("Invalid user ID"));
    }, 100);
  });
}

function fetchPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([\`Post by User \${userId} #1\`, \`Post by User \${userId} #2\`]);
    }, 100);
  });
}

// Promise chaining
fetchUser(1)
  .then(user => { console.log("User:", user.name); return fetchPosts(user.id); })
  .then(posts => console.log("Posts:", posts))
  .catch(err => console.error("Error:", err.message));

// Async/Await
async function main() {
  try {
    const user = await fetchUser(2);
    console.log("\\nAsync User:", user.name, "score:", user.score);
    const posts = await fetchPosts(user.id);
    console.log("Posts:", posts.join(", "));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();

// Promise.all — parallel requests
Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)])
  .then(users => console.log("\\nAll users:", users.map(u=>u.name).join(", ")));`,
      },
      challenge: { title: '🎯 Retry Mechanism', description: 'Write an async function retry(fn, times) that retries a failed async function up to n times before throwing.', hint: 'Use a for loop with try/catch. Only throw the error after all retries are exhausted.' },
    },
    {
      id: 'js-classes', title: 'ES6 Classes & Modules', difficulty: 'Intermediate', duration: '18 min',
      theory: `## ES6 Classes\nES6 introduced \`class\` syntax — syntactic sugar over prototype-based inheritance.\n\n### Key features\n- \`constructor()\` — initializer\n- \`extends\` — inheritance\n- \`super()\` — call parent\n- \`static\` — class-level method\n- \`get\`/\`set\` — computed properties\n- \`#private\` — private fields (ES2022)`,
      starterCode: {
        python: ``, cpp: ``,
        javascript: `class Shape {
  #color;
  constructor(color){ this.#color = color; }
  get color(){ return this.#color; }
  area(){ return 0; }
  toString(){ return \`\${this.constructor.name}[\${this.#color}] area=\${this.area().toFixed(2)}\`; }
  static compare(a, b){ return a.area() - b.area(); }
}

class Circle extends Shape {
  constructor(r, color){ super(color); this.r = r; }
  area(){ return Math.PI * this.r ** 2; }
}

class Rectangle extends Shape {
  constructor(w, h, color){ super(color); this.w=w; this.h=h; }
  area(){ return this.w * this.h; }
}

class Square extends Rectangle {
  constructor(s, color){ super(s, s, color); }
}

const shapes = [
  new Circle(5, "red"),
  new Rectangle(4, 6, "blue"),
  new Square(4, "green"),
  new Circle(3, "yellow"),
];

shapes.forEach(s => console.log(s.toString()));
const sorted = [...shapes].sort(Shape.compare);
console.log("\\nSmallest:", sorted[0].toString());
console.log("Largest:", sorted[sorted.length-1].toString());`,
      },
      challenge: { title: '🎯 Iterator Pattern', description: 'Create a Range class that is iterable (implements [Symbol.iterator]). for(const n of new Range(1,5)) should print 1 2 3 4 5.', hint: 'Return an object with a next() method from [Symbol.iterator]. Track current value.' },
    },
    {
      id: 'js-functional', title: 'Functional Programming', difficulty: 'Advanced', duration: '22 min',
      theory: `## Functional Programming in JS\nFP treats computation as evaluation of **pure functions** — no side effects, same input = same output.\n\n### Core concepts\n- **Pure functions** — no side effects\n- **Immutability** — don't mutate data\n- **Higher-order functions** — take/return functions\n- **Currying** — fn(a)(b) instead of fn(a,b)\n- **Composition** — compose(f,g)(x) = f(g(x))`,
      starterCode: {
        python: ``, cpp: ``,
        javascript: `// Pure function
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Currying
const curry = fn => a => b => fn(a, b);
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
console.log("add5(3):", add5(3));
console.log("add5(10):", add5(10));

// Composition
const compose = (...fns) => x => fns.reduceRight((v,f)=>f(v), x);
const pipe    = (...fns) => x => fns.reduce((v,f)=>f(v), x);

const double = x => x * 2;
const square = x => x ** 2;
const addOne = x => x + 1;

const transform = pipe(addOne, double, square);
console.log("pipe(addOne,double,square)(3):", transform(3)); // (3+1)*2=8, 8^2=64

// Immutable operations
const users = [{name:"Alice",score:80},{name:"Bob",score:90}];
const updated = users.map(u => u.name==="Alice" ? {...u, score:95} : u);
console.log("\\nOriginal:", JSON.stringify(users));
console.log("Updated:", JSON.stringify(updated));

// Monad-like Maybe
const Maybe = val => ({
  map: fn => val == null ? Maybe(null) : Maybe(fn(val)),
  getOrElse: def => val ?? def,
});
const result = Maybe({user:{profile:{score:85}}})
  .map(r=>r.user).map(u=>u.profile).map(p=>p.score)
  .getOrElse(0);
console.log("\\nSafe nested access:", result);`,
      },
      challenge: { title: '🎯 Memoize HOF', description: 'Write a memoize(fn) higher-order function that caches results. Test it with a slow Fibonacci.', hint: 'Create a cache Map. Return a wrapper that checks cache before calling fn.' },
    },
  ],
};

export const cpTrack = {
  id: 'cp', title: 'Competitive Programming', icon: '⚡',
  color: 'bg-purple-100 text-purple-700 border-purple-200',
  headerColor: 'from-purple-600 to-purple-800',
  lessons: [
    {
      id: 'complexity', title: 'Time & Space Complexity', difficulty: 'Beginner', duration: '20 min',
      theory: `## Big O Notation\nDescribes how runtime scales with input size n.\n\n| O | Name | Example |\n|---|---|---|\n|O(1)|Constant|Array access|\n|O(log n)|Logarithmic|Binary search|\n|O(n)|Linear|Linear search|\n|O(n log n)|Linearithmic|Merge sort|\n|O(n²)|Quadratic|Bubble sort|\n|O(2ⁿ)|Exponential|Naive Fibonacci|\n\n**Rules:** Drop constants (O(2n)→O(n)), drop lower terms (O(n²+n)→O(n²)).`,
      starterCode: {
        python: `import time

def measure(fn, *args):
    t = time.perf_counter()
    r = fn(*args)
    return r, (time.perf_counter()-t)*1000

# O(1)
def first(arr): return arr[0]

# O(n)
def linear_sum(arr): return sum(arr)

# O(log n)
def binary_search(arr, t):
    l,r = 0,len(arr)-1
    while l<=r:
        mid=(l+r)//2
        if arr[mid]==t: return mid
        elif arr[mid]<t: l=mid+1
        else: r=mid-1
    return -1

# O(n^2)
def bubble_sort(arr):
    a=arr[:]
    for i in range(len(a)):
        for j in range(len(a)-i-1):
            if a[j]>a[j+1]: a[j],a[j+1]=a[j+1],a[j]
    return a

n = 5000
arr = list(range(n))
_, t1 = measure(first, arr)
_, t2 = measure(linear_sum, arr)
_, t3 = measure(binary_search, arr, n//2)
_, t4 = measure(bubble_sort, arr)
print(f"n = {n}")
print(f"O(1)      first():          {t1:.4f}ms")
print(f"O(n)      linear_sum():     {t2:.4f}ms")
print(f"O(log n)  binary_search():  {t3:.4f}ms")
print(f"O(n^2)    bubble_sort():    {t4:.2f}ms")`,
        javascript: `function measure(fn,...args){const t=performance.now();const r=fn(...args);return{r,t:performance.now()-t};}
const n=5000, arr=Array.from({length:n},(_,i)=>i);
const t1=measure(a=>a[0],arr);
const t2=measure(a=>a.reduce((s,x)=>s+x,0),arr);
function bs(arr,t){let l=0,r=arr.length-1;while(l<=r){const m=(l+r)>>1;if(arr[m]===t)return m;arr[m]<t?l=m+1:r=m-1;}return -1;}
const t3=measure(bs,arr,n/2);
function bubble(arr){const a=[...arr];for(let i=0;i<a.length;i++)for(let j=0;j<a.length-i-1;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];return a;}
const t4=measure(bubble,arr);
console.log(\`n = \${n}\`);
console.log(\`O(1)      first:         \${t1.t.toFixed(4)}ms\`);
console.log(\`O(n)      reduce sum:    \${t2.t.toFixed(4)}ms\`);
console.log(\`O(log n)  binary search: \${t3.t.toFixed(4)}ms\`);
console.log(\`O(n^2)    bubble sort:   \${t4.t.toFixed(2)}ms\`);`,
        cpp: `#include<iostream>
#include<vector>
#include<algorithm>
#include<chrono>
using namespace std;
using ms=chrono::duration<double,milli>;
auto now=[](){return chrono::high_resolution_clock::now();};
int main(){
  int n=5000; vector<int>arr(n); iota(arr.begin(),arr.end(),0);
  auto t1=now(); int f=arr[0]; double d1=ms(now()-t1).count();
  auto t2=now(); int s=0;for(int x:arr)s+=x; double d2=ms(now()-t2).count();
  auto t3=now(); auto it=lower_bound(arr.begin(),arr.end(),n/2); double d3=ms(now()-t3).count();
  cout<<"n="<<n<<endl;
  cout<<"O(1)     first:         "<<d1<<"ms"<<endl;
  cout<<"O(n)     sum:           "<<d2<<"ms"<<endl;
  cout<<"O(log n) binary_search: "<<d3<<"ms"<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Analyze Your Code', description: 'Find duplicates in an array. First write O(n²) brute force, then optimize to O(n) using a set.', hint: 'O(n): iterate once, if element in seen set → duplicate. Else add to seen.' },
    },
    {
      id: 'two-pointers', title: 'Two Pointers & Sliding Window', difficulty: 'Intermediate', duration: '25 min',
      theory: `## Two Pointers\nUse two indices moving toward each other or in the same direction to solve array/string problems in O(n).\n\n### Classic problems\n- Two Sum in sorted array\n- Valid Palindrome\n- Container with Most Water\n\n## Sliding Window\nMaintain a window (subarray) that expands/contracts to find an optimal subarray.\n\n### Pattern\nMax/Min subarray of size k, longest substring with constraint.`,
      starterCode: {
        python: `# Two Pointers: Two Sum in sorted array
def two_sum_sorted(arr, target):
    l, r = 0, len(arr)-1
    while l < r:
        s = arr[l] + arr[r]
        if s == target: return (l, r)
        elif s < target: l += 1
        else: r -= 1
    return None

arr = [1,2,4,6,8,11,15]
print("Two Sum target=9:", two_sum_sorted(arr, 9))

# Two Pointers: Valid Palindrome (ignore non-alnum)
def is_palindrome(s):
    l, r = 0, len(s)-1
    while l < r:
        while l<r and not s[l].isalnum(): l+=1
        while l<r and not s[r].isalnum(): r-=1
        if s[l].lower() != s[r].lower(): return False
        l+=1; r-=1
    return True

tests = ["A man, a plan, a canal: Panama","race a car","Was it a car or a cat I saw?"]
for t in tests: print(f"'{t[:20]}...' → {is_palindrome(t)}")

# Sliding Window: Max sum subarray of size k
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr2 = [2,1,5,1,3,2,7,1]
print(f"\\nMax sum of k=3 in {arr2}:", max_subarray_sum(arr2, 3))`,
        javascript: `// Two Pointers: Two Sum sorted
function twoSumSorted(arr, target){
  let l=0, r=arr.length-1;
  while(l<r){
    const s=arr[l]+arr[r];
    if(s===target) return [l,r];
    s<target?l++:r--;
  }
  return null;
}
console.log("Two Sum target=9:", twoSumSorted([1,2,4,6,8,11,15],9));

// Sliding Window: Max sum of k elements
function maxWindowSum(arr, k){
  let sum=arr.slice(0,k).reduce((a,b)=>a+b,0), max=sum;
  for(let i=k;i<arr.length;i++){sum+=arr[i]-arr[i-k];max=Math.max(max,sum);}
  return max;
}
console.log("Max window k=3:", maxWindowSum([2,1,5,1,3,2,7,1],3));

// Longest substring without repeating chars
function longestUnique(s){
  const map=new Map(); let l=0,max=0;
  for(let r=0;r<s.length;r++){
    if(map.has(s[r])) l=Math.max(l,map.get(s[r])+1);
    map.set(s[r],r);
    max=Math.max(max,r-l+1);
  }
  return max;
}
console.log("Longest unique 'abcabcbb':", longestUnique("abcabcbb"));`,
        cpp: `#include<iostream>
#include<vector>
#include<string>
#include<unordered_map>
using namespace std;
pair<int,int>twoSum(vector<int>&arr,int t){
  int l=0,r=arr.size()-1;
  while(l<r){int s=arr[l]+arr[r];if(s==t)return{l,r};s<t?l++:r--;}
  return{-1,-1};
}
int maxWindow(vector<int>&arr,int k){
  int sum=0,mx=0;
  for(int i=0;i<k;i++)sum+=arr[i]; mx=sum;
  for(int i=k;i<arr.size();i++){sum+=arr[i]-arr[i-k];mx=max(mx,sum);}
  return mx;
}
int main(){
  vector<int>arr={1,2,4,6,8,11,15};
  auto[l,r]=twoSum(arr,9); cout<<"Two Sum ["<<l<<","<<r<<"]"<<endl;
  vector<int>arr2={2,1,5,1,3,2,7,1};
  cout<<"Max window k=3: "<<maxWindow(arr2,3)<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Container With Most Water', description: 'Given an array of heights, find two lines that form a container holding the most water.', hint: 'Two pointers from both ends. Move the pointer with smaller height inward each step.' },
    },
    {
      id: 'greedy', title: 'Greedy Algorithms', difficulty: 'Intermediate', duration: '22 min',
      theory: `## Greedy Algorithms\nMake the **locally optimal** choice at each step hoping to reach a global optimum.\n\n### When greedy works\n- Greedy Choice Property: local optimal → global optimal\n- Optimal Substructure: solution uses optimal sub-solutions\n\n### Classic problems\n- Activity Selection\n- Fractional Knapsack\n- Huffman Encoding\n- Jump Game\n- Dijkstra's shortest path`,
      starterCode: {
        python: `# Activity Selection (max non-overlapping activities)
def activity_selection(activities):
    # Sort by end time
    sorted_acts = sorted(activities, key=lambda x: x[1])
    selected = [sorted_acts[0]]
    for start, end in sorted_acts[1:]:
        if start >= selected[-1][1]:
            selected.append((start, end))
    return selected

activities = [(1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14),(12,16)]
result = activity_selection(activities)
print(f"Max activities: {len(result)}")
print("Selected:", result)

# Jump Game (can you reach end?)
def can_jump(nums):
    max_reach = 0
    for i, n in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + n)
    return True

# Minimum jumps to reach end
def min_jumps(nums):
    jumps = cur_end = cur_farthest = 0
    for i in range(len(nums)-1):
        cur_farthest = max(cur_farthest, i+nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = cur_farthest
    return jumps

print("\\n[2,3,1,1,4] can jump:", can_jump([2,3,1,1,4]))
print("[3,2,1,0,4] can jump:", can_jump([3,2,1,0,4]))
print("[2,3,1,1,4] min jumps:", min_jumps([2,3,1,1,4]))`,
        javascript: `// Activity Selection
function activitySelection(acts){
  const sorted=[...acts].sort((a,b)=>a[1]-b[1]);
  const sel=[sorted[0]];
  for(const[s,e]of sorted.slice(1)) if(s>=sel[sel.length-1][1]) sel.push([s,e]);
  return sel;
}
const acts=[[1,4],[3,5],[0,6],[5,7],[3,9],[5,9],[6,10],[8,11]];
const sel=activitySelection(acts);
console.log("Max activities:", sel.length, JSON.stringify(sel));

// Jump Game
function canJump(nums){let maxR=0;for(let i=0;i<nums.length;i++){if(i>maxR)return false;maxR=Math.max(maxR,i+nums[i]);}return true;}
function minJumps(nums){let j=0,end=0,far=0;for(let i=0;i<nums.length-1;i++){far=Math.max(far,i+nums[i]);if(i===end){j++;end=far;}}return j;}
console.log("[2,3,1,1,4] canJump:", canJump([2,3,1,1,4]));
console.log("[3,2,1,0,4] canJump:", canJump([3,2,1,0,4]));
console.log("[2,3,1,1,4] minJumps:", minJumps([2,3,1,1,4]));`,
        cpp: `#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
bool canJump(vector<int>&n){int mx=0;for(int i=0;i<n.size();i++){if(i>mx)return false;mx=max(mx,i+n[i]);}return true;}
int minJumps(vector<int>&n){int j=0,end=0,far=0;for(int i=0;i<n.size()-1;i++){far=max(far,i+n[i]);if(i==end){j++;end=far;}}return j;}
int main(){
  vector<int>a={2,3,1,1,4},b={3,2,1,0,4};
  cout<<"[2,3,1,1,4] canJump: "<<canJump(a)<<endl;
  cout<<"[3,2,1,0,4] canJump: "<<canJump(b)<<endl;
  cout<<"minJumps: "<<minJumps(a)<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Minimum Platforms', description: 'Given train arrival and departure times, find minimum number of platforms needed at station.', hint: 'Sort arrivals and departures separately. Use two pointers to track simultaneous trains.' },
    },
    {
      id: 'dp-patterns', title: 'DP Patterns', difficulty: 'Advanced', duration: '35 min',
      theory: `## Dynamic Programming Patterns\n\n### 1. 0/1 Knapsack\ndp[i][w] = max value with first i items and capacity w\n\n### 2. Unbounded Knapsack\nItems can be used multiple times (Coin Change)\n\n### 3. Longest Common Subsequence\ndp[i][j]: LCS of first i chars of a and j chars of b\n\n### 4. Longest Increasing Subsequence\ndp[i] = length of LIS ending at index i\n\n### 5. Matrix Chain / Interval DP\ndp[i][j]: optimal cost for subproblem on [i,j]`,
      starterCode: {
        python: `# LIS - Longest Increasing Subsequence
def lis(arr):
    n = len(arr)
    dp = [1]*n
    for i in range(1,n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j]+1)
    return max(dp)

# 0/1 Knapsack
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1,n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][W]

# Edit Distance
def edit_distance(a, b):
    m,n = len(a),len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0]=i
    for j in range(n+1): dp[0][j]=j
    for i in range(1,m+1):
        for j in range(1,n+1):
            if a[i-1]==b[j-1]: dp[i][j]=dp[i-1][j-1]
            else: dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
    return dp[m][n]

arr = [10,9,2,5,3,7,101,18]
print(f"LIS of {arr}:", lis(arr))
w=[1,3,4,5]; v=[1,4,5,7]
print(f"Knapsack W=7:", knapsack(w,v,7))
print(f"Edit('kitten','sitting'):", edit_distance('kitten','sitting'))`,
        javascript: `function lis(arr){
  const dp=new Array(arr.length).fill(1);
  for(let i=1;i<arr.length;i++) for(let j=0;j<i;j++) if(arr[j]<arr[i]) dp[i]=Math.max(dp[i],dp[j]+1);
  return Math.max(...dp);
}
function knapsack(w,v,W){
  const n=w.length,dp=Array.from({length:n+1},()=>new Array(W+1).fill(0));
  for(let i=1;i<=n;i++) for(let c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=Math.max(dp[i][c],dp[i-1][c-w[i-1]]+v[i-1]);}
  return dp[n][W];
}
function editDist(a,b){
  const m=a.length,n=b.length,dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i||j?i?j?0:i:j:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
console.log("LIS:", lis([10,9,2,5,3,7,101,18]));
console.log("Knapsack W=7:", knapsack([1,3,4,5],[1,4,5,7],7));
console.log("Edit dist:", editDist("kitten","sitting"));`,
        cpp: `#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
int lis(vector<int>&arr){
  int n=arr.size(); vector<int>dp(n,1);
  for(int i=1;i<n;i++) for(int j=0;j<i;j++) if(arr[j]<arr[i]) dp[i]=max(dp[i],dp[j]+1);
  return *max_element(dp.begin(),dp.end());
}
int knapsack(vector<int>&w,vector<int>&v,int W){
  int n=w.size(); vector<vector<int>>dp(n+1,vector<int>(W+1,0));
  for(int i=1;i<=n;i++) for(int c=0;c<=W;c++){dp[i][c]=dp[i-1][c];if(w[i-1]<=c)dp[i][c]=max(dp[i][c],dp[i-1][c-w[i-1]]+v[i-1]);}
  return dp[n][W];
}
int main(){
  vector<int>arr={10,9,2,5,3,7,101,18};
  cout<<"LIS: "<<lis(arr)<<endl;
  vector<int>w={1,3,4,5},v={1,4,5,7};
  cout<<"Knapsack W=7: "<<knapsack(w,v,7)<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Palindrome Partitioning', description: 'Find minimum cuts to partition a string so every part is a palindrome.', hint: 'dp[i] = min cuts for s[0..i]. For each j<=i where s[j..i] is palindrome, dp[i]=min(dp[i], dp[j-1]+1).' },
    },
    {
      id: 'graph-advanced', title: 'Shortest Path Algorithms', difficulty: 'Expert', duration: '40 min',
      theory: `## Shortest Path Algorithms\n\n| Algorithm | Graph type | Complexity |\n|---|---|---|\n|BFS|Unweighted|O(V+E)|\n|Dijkstra|Non-negative weights|O((V+E)log V)|\n|Bellman-Ford|Negative weights|O(VE)|\n|Floyd-Warshall|All pairs|O(V³)|\n\n### Dijkstra's key idea\nGreedily pick the unvisited vertex with smallest distance. Use a min-heap (priority queue).`,
      starterCode: {
        python: `import heapq

def dijkstra(graph, src, n):
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist

# Graph as adjacency list: (neighbor, weight)
graph = {
    0: [(1,4),(2,1)],
    1: [(3,1)],
    2: [(1,2),(3,5)],
    3: [(4,3)],
    4: []
}
n = 5
distances = dijkstra(graph, 0, n)
print("Shortest distances from node 0:")
for i, d in enumerate(distances):
    print(f"  Node {i}: {d}")

# Detect negative cycle with Bellman-Ford
def bellman_ford(edges, n, src):
    dist=[float('inf')]*n; dist[src]=0
    for _ in range(n-1):
        for u,v,w in edges:
            if dist[u]!=float('inf') and dist[u]+w<dist[v]:
                dist[v]=dist[u]+w
    # Check for negative cycle
    for u,v,w in edges:
        if dist[u]!=float('inf') and dist[u]+w<dist[v]:
            return None  # negative cycle
    return dist

edges=[(0,1,4),(0,2,1),(2,1,2),(1,3,1),(2,3,5),(3,4,3)]
print("\\nBellman-Ford:", bellman_ford(edges,5,0))`,
        javascript: `class MinHeap{constructor(){this.h=[];}push(v){this.h.push(v);this._up(this.h.length-1);}pop(){const t=this.h[0];const l=this.h.pop();if(this.h.length){this.h[0]=l;this._down(0);}return t;}_up(i){while(i>0){const p=(i-1)>>1;if(this.h[p][0]>this.h[i][0]){[this.h[p],this.h[i]]=[this.h[i],this.h[p]];i=p;}else break;}}_down(i){const n=this.h.length;while(true){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this.h[l][0]<this.h[s][0])s=l;if(r<n&&this.h[r][0]<this.h[s][0])s=r;if(s===i)break;[this.h[s],this.h[i]]=[this.h[i],this.h[s]];i=s;}}}
function dijkstra(graph,src,n){
  const dist=new Array(n).fill(Infinity); dist[src]=0;
  const heap=new MinHeap(); heap.push([0,src]);
  while(heap.h.length){const[d,u]=heap.pop();if(d>dist[u])continue;for(const[v,w]of graph[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;heap.push([dist[v],v]);}}
  return dist;
}
const graph={0:[[1,4],[2,1]],1:[[3,1]],2:[[1,2],[3,5]],3:[[4,3]],4:[]};
const dists=dijkstra(graph,0,5);
console.log("Distances from 0:");
dists.forEach((d,i)=>console.log(\` Node \${i}: \${d}\`));`,
        cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<climits>
using namespace std;
vector<int>dijkstra(vector<vector<pair<int,int>>>&g,int s,int n){
  vector<int>dist(n,INT_MAX); dist[s]=0;
  priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>>pq;
  pq.push({0,s});
  while(!pq.empty()){
    auto[d,u]=pq.top();pq.pop();
    if(d>dist[u])continue;
    for(auto[v,w]:g[u]) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push({dist[v],v});}
  }
  return dist;
}
int main(){
  int n=5; vector<vector<pair<int,int>>>g(n);
  g[0].push_back({1,4});g[0].push_back({2,1});g[1].push_back({3,1});
  g[2].push_back({1,2});g[2].push_back({3,5});g[3].push_back({4,3});
  auto d=dijkstra(g,0,n);
  cout<<"Distances from 0:"<<endl;
  for(int i=0;i<n;i++) cout<<"  Node "<<i<<": "<<d[i]<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Network Delay Time', description: 'A network has n nodes. Given directed edges (u,v,w), find minimum time for signal from node k to reach ALL nodes. Return -1 if impossible.', hint: 'Run Dijkstra from k. Answer is max of all distances. If any is infinity, return -1.' },
    },
  ],
};
