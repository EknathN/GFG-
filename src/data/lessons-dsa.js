export const dsaTrack = {
  id: 'dsa', title: 'Data Structures & Algorithms', icon: '🧠',
  color: 'bg-green-100 text-green-700 border-green-200',
  headerColor: 'from-green-600 to-green-800',
  lessons: [
    {
      id: 'arrays', title: 'Arrays', difficulty: 'Beginner', duration: '15 min',
      theory: `## Arrays\nAn array stores elements at contiguous memory. Access is O(1), search is O(n), insert/delete O(n).\n\n### Operations\n- **Access:** arr[i] → O(1)\n- **Search:** linear scan → O(n)\n- **Insert/Delete:** shift elements → O(n)\n\n### Tips\nUse arrays when size is fixed and random access is needed frequently.`,
      starterCode: {
        python: `arr = [10, 20, 30, 40, 50]
print("Array:", arr)
print("Index 2:", arr[2])
print("Max:", max(arr))
print("Sum:", sum(arr))
arr.reverse()
print("Reversed:", arr)
arr.sort()
print("Sorted:", arr)`,
        javascript: `const arr = [10, 20, 30, 40, 50];
console.log("Array:", arr.join(", "));
console.log("Index 2:", arr[2]);
console.log("Max:", Math.max(...arr));
console.log("Sum:", arr.reduce((a,b)=>a+b,0));
console.log("Reversed:", [...arr].reverse().join(", "));
console.log("Sorted:", [...arr].sort((a,b)=>a-b).join(", "));`,
        cpp: `#include<iostream>
#include<algorithm>
using namespace std;
int main(){
  int arr[]={10,20,30,40,50}, n=5;
  cout<<"Max: "<<*max_element(arr,arr+n)<<endl;
  int sum=0; for(int x:arr) sum+=x;
  cout<<"Sum: "<<sum<<endl;
  reverse(arr,arr+n);
  cout<<"Reversed: "; for(int x:arr) cout<<x<<" "; cout<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Two Sum', description: 'Find two numbers in array that add up to a target. Print their indices.', hint: 'Use nested loops or a hashmap.' },
    },
    {
      id: 'strings', title: 'Strings', difficulty: 'Beginner', duration: '12 min',
      theory: `## Strings\nA string is a sequence of characters. Strings are **immutable** in Python and Java.\n\n### Key Operations\n- **Length:** O(1)\n- **Slicing:** O(k)\n- **Concatenation:** O(n)\n- **Search (find):** O(n)\n\n### Common Tricks\nReverse a string: \`s[::-1]\` in Python. Check palindrome by comparing with reversed.`,
      starterCode: {
        python: `s = "GeeksForGeeks"
print("Original:", s)
print("Uppercase:", s.upper())
print("Length:", len(s))
print("Reversed:", s[::-1])
print("Is palindrome:", s == s[::-1])
print("Count 'e':", s.lower().count('e'))
words = "Hello World Python"
print("Words:", words.split())
print("Joined:", "-".join(words.split()))`,
        javascript: `const s = "GeeksForGeeks";
console.log("Original:", s);
console.log("Uppercase:", s.toUpperCase());
console.log("Length:", s.length);
const rev = s.split("").reverse().join("");
console.log("Reversed:", rev);
console.log("Is palindrome:", s === rev);
const words = "Hello World JavaScript";
console.log("Words:", words.split(" "));
console.log("Joined:", words.split(" ").join("-"));`,
        cpp: `#include<iostream>
#include<algorithm>
#include<string>
using namespace std;
int main(){
  string s="GeeksForGeeks";
  cout<<"Length: "<<s.length()<<endl;
  string rev=s; reverse(rev.begin(),rev.end());
  cout<<"Reversed: "<<rev<<endl;
  cout<<"Palindrome: "<<(s==rev?"Yes":"No")<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Anagram Check', description: 'Check if two strings are anagrams of each other.', hint: 'Sort both strings and compare, or count character frequencies.' },
    },
    {
      id: 'linkedlist', title: 'Linked Lists', difficulty: 'Beginner', duration: '20 min',
      theory: `## Linked Lists\nEach node holds data and a pointer to the next node. Dynamic size; O(1) insert at head.\n\n### Types\n1. Singly — each node points forward\n2. Doubly — each node has prev and next\n3. Circular — tail points back to head\n\n### Complexity\n| Op | Time |\n|---|---|\n|Insert at head|O(1)|\n|Search|O(n)|\n|Delete at head|O(1)|`,
      starterCode: {
        python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self): self.head = None

    def push(self, data):
        node = Node(data)
        node.next = self.head
        self.head = node

    def display(self):
        cur, result = self.head, []
        while cur: result.append(str(cur.data)); cur = cur.next
        print(" -> ".join(result) + " -> NULL")

    def length(self):
        cur, count = self.head, 0
        while cur: count += 1; cur = cur.next
        return count

ll = LinkedList()
for v in [10,20,30,40]: ll.push(v)
ll.display()
print("Length:", ll.length())`,
        javascript: `class Node { constructor(d){this.data=d;this.next=null;} }
class LinkedList {
  constructor(){this.head=null;}
  push(d){const n=new Node(d);n.next=this.head;this.head=n;}
  display(){let c=this.head,r=[];while(c){r.push(c.data);c=c.next;}console.log(r.join(" -> ")+" -> NULL");}
  length(){let c=this.head,cnt=0;while(c){cnt++;c=c.next;}return cnt;}
}
const ll=new LinkedList();
[10,20,30,40].forEach(v=>ll.push(v));
ll.display();
console.log("Length:", ll.length());`,
        cpp: `#include<iostream>
using namespace std;
struct Node{int data;Node*next;Node(int d):data(d),next(nullptr){}};
void push(Node*&h,int d){Node*n=new Node(d);n->next=h;h=n;}
void display(Node*h){while(h){cout<<h->data<<" -> ";h=h->next;}cout<<"NULL"<<endl;}
int main(){
  Node*head=nullptr;
  for(int v:{10,20,30,40}) push(head,v);
  display(head);
  return 0;
}`,
      },
      challenge: { title: '🎯 Reverse Linked List', description: 'Write code to reverse a linked list in-place.', hint: 'Use three pointers: prev, curr, next.' },
    },
    {
      id: 'stackqueue', title: 'Stacks & Queues', difficulty: 'Beginner', duration: '18 min',
      theory: `## Stacks & Queues\n**Stack** = LIFO (Last In First Out). Push/pop from top.\n**Queue** = FIFO (First In First Out). Enqueue at rear, dequeue from front.\n\n### Applications\n- Stack: undo operations, function call stack, balanced brackets\n- Queue: BFS, task scheduling, print queue\n\n### Complexity\nBoth have O(1) push/pop/enqueue/dequeue.`,
      starterCode: {
        python: `from collections import deque

# Stack using list
stack = []
stack.append(1); stack.append(2); stack.append(3)
print("Stack:", stack)
print("Pop:", stack.pop())
print("Stack after pop:", stack)

# Queue using deque
queue = deque()
queue.append("A"); queue.append("B"); queue.append("C")
print("\\nQueue:", list(queue))
print("Dequeue:", queue.popleft())
print("Queue after dequeue:", list(queue))

# Balanced brackets using stack
def balanced(s):
    st, pairs = [], {')':'(',']':'[','}':'{'}
    for c in s:
        if c in '([{': st.append(c)
        elif c in ')]}':
            if not st or st[-1]!=pairs[c]: return False
            st.pop()
    return len(st)==0

print("\\n'([{}])' balanced:", balanced('([{}])'))
print("'([)]' balanced:", balanced('([)]'))`,
        javascript: `// Stack
const stack = [];
stack.push(1); stack.push(2); stack.push(3);
console.log("Stack:", stack.join(", "));
console.log("Pop:", stack.pop());
// Queue
const queue = [];
queue.push("A"); queue.push("B"); queue.push("C");
console.log("Queue:", queue.join(", "));
console.log("Dequeue:", queue.shift());
// Balanced brackets
function balanced(s){
  const st=[], m={')':'(',']':'[','}':'{'};
  for(const c of s){
    if("([{".includes(c)) st.push(c);
    else if(!st.length||st[st.length-1]!==m[c]) return false;
    else st.pop();
  }
  return st.length===0;
}
console.log("'([{}])' balanced:", balanced("([{}])"));
console.log("'([)]' balanced:", balanced("([)]"));`,
        cpp: `#include<iostream>
#include<stack>
#include<queue>
#include<string>
using namespace std;
bool balanced(string s){
  stack<char>st;
  for(char c:s){
    if(c=='('||c=='['||c=='{') st.push(c);
    else{
      if(st.empty()) return false;
      if(c==')'&&st.top()!='(') return false;
      if(c==']'&&st.top()!='[') return false;
      if(c=='}'&&st.top()!='{') return false;
      st.pop();
    }
  }
  return st.empty();
}
int main(){
  stack<int>sk; sk.push(1);sk.push(2);sk.push(3);
  cout<<"Stack top: "<<sk.top()<<endl; sk.pop();
  queue<string>q; q.push("A");q.push("B");q.push("C");
  cout<<"Queue front: "<<q.front()<<endl;
  cout<<"([{}]) balanced: "<<balanced("([{}])")<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Next Greater Element', description: 'For each element, find the next greater element using a stack.', hint: 'Traverse right to left, use stack to track candidates.' },
    },
    {
      id: 'hashing', title: 'Hash Maps & Sets', difficulty: 'Intermediate', duration: '20 min',
      theory: `## Hashing\nA hash map (dictionary) stores key-value pairs with **O(1) average** lookup, insert, delete.\n\n### When to use\n- Count frequencies\n- Check if element exists quickly\n- Group elements\n- Two Sum / Subarray problems\n\n### Hash Set\nStores unique elements only. O(1) average lookup. Great for tracking "visited" elements.`,
      starterCode: {
        python: `# Frequency count
words = ["apple","banana","apple","cherry","banana","apple"]
freq = {}
for w in words:
    freq[w] = freq.get(w, 0) + 1
print("Frequencies:", freq)
print("Most common:", max(freq, key=freq.get))

# Two Sum using hashmap O(n)
def two_sum(arr, target):
    seen = {}
    for i, v in enumerate(arr):
        complement = target - v
        if complement in seen:
            return (seen[complement], i)
        seen[v] = i
    return None

arr = [2, 7, 11, 15]
print("\\nTwo Sum [2,7,11,15] target=9:", two_sum(arr, 9))

# Hash Set for duplicates
nums = [1,2,3,2,4,3,5]
seen = set()
duplicates = [x for x in nums if x in seen or seen.add(x)]
print("Duplicates:", list(set(duplicates)))`,
        javascript: `// Frequency map
const words = ["apple","banana","apple","cherry","banana","apple"];
const freq = {};
for(const w of words) freq[w] = (freq[w]||0)+1;
console.log("Frequencies:", JSON.stringify(freq));

// Two Sum O(n)
function twoSum(arr, target){
  const seen = new Map();
  for(let i=0;i<arr.length;i++){
    const comp = target - arr[i];
    if(seen.has(comp)) return [seen.get(comp), i];
    seen.set(arr[i], i);
  }
  return null;
}
console.log("Two Sum:", twoSum([2,7,11,15], 9));

// Set for unique check
const nums = [1,2,3,2,4,3,5];
const uniq = [...new Set(nums)];
console.log("Unique:", uniq.join(", "));`,
        cpp: `#include<iostream>
#include<unordered_map>
#include<vector>
using namespace std;
int main(){
  vector<string> words={"apple","banana","apple","cherry","banana","apple"};
  unordered_map<string,int> freq;
  for(auto&w:words) freq[w]++;
  for(auto&[k,v]:freq) cout<<k<<": "<<v<<endl;

  vector<int> arr={2,7,11,15};
  int target=9;
  unordered_map<int,int> seen;
  for(int i=0;i<arr.size();i++){
    int comp=target-arr[i];
    if(seen.count(comp)) cout<<"TwoSum: ["<<seen[comp]<<","<<i<<"]"<<endl;
    seen[arr[i]]=i;
  }
  return 0;
}`,
      },
      challenge: { title: '🎯 Longest Consecutive Sequence', description: 'Given unsorted array, find length of longest consecutive sequence. Must be O(n).', hint: 'Use a hash set. For each number, check if it\'s a sequence start (num-1 not in set).' },
    },
    {
      id: 'binarysearch', title: 'Binary Search', difficulty: 'Intermediate', duration: '18 min',
      theory: `## Binary Search\nSearch a **sorted** array by halving the search space each step.\n\n### Algorithm\n1. left=0, right=n-1\n2. mid = (left+right)//2\n3. If arr[mid]==target → found\n4. If arr[mid]<target → left=mid+1\n5. Else → right=mid-1\n\n### Complexity\nTime: O(log n) | Space: O(1)\n\n### Applications\nSearch problems, finding boundaries, sqrt, monotonic functions.`,
      starterCode: {
        python: `def binary_search(arr, target):
    l, r = 0, len(arr)-1
    while l <= r:
        mid = (l+r)//2
        if arr[mid] == target: return mid
        elif arr[mid] < target: l = mid+1
        else: r = mid-1
    return -1

def first_occurrence(arr, target):
    l, r, res = 0, len(arr)-1, -1
    while l <= r:
        mid = (l+r)//2
        if arr[mid] == target: res = mid; r = mid-1
        elif arr[mid] < target: l = mid+1
        else: r = mid-1
    return res

arr = [1,3,5,7,9,11,13,15,17]
print("Array:", arr)
print("Search 11:", binary_search(arr, 11))
print("Search 6:", binary_search(arr, 6))
dup = [1,2,2,2,3,4,5]
print("First 2 in [1,2,2,2,3,4,5]:", first_occurrence(dup, 2))`,
        javascript: `function binarySearch(arr, target){
  let l=0, r=arr.length-1;
  while(l<=r){
    const mid=(l+r)>>1;
    if(arr[mid]===target) return mid;
    arr[mid]<target ? l=mid+1 : r=mid-1;
  }
  return -1;
}
function firstOccurrence(arr, target){
  let l=0,r=arr.length-1,res=-1;
  while(l<=r){
    const mid=(l+r)>>1;
    if(arr[mid]===target){res=mid;r=mid-1;}
    else if(arr[mid]<target) l=mid+1;
    else r=mid-1;
  }
  return res;
}
const arr=[1,3,5,7,9,11,13,15,17];
console.log("Search 11:", binarySearch(arr,11));
console.log("Search 6:", binarySearch(arr,6));
console.log("First 2:", firstOccurrence([1,2,2,2,3],2));`,
        cpp: `#include<iostream>
#include<vector>
using namespace std;
int binarySearch(vector<int>&arr,int t){
  int l=0,r=arr.size()-1;
  while(l<=r){
    int mid=l+(r-l)/2;
    if(arr[mid]==t) return mid;
    arr[mid]<t?l=mid+1:r=mid-1;
  }
  return -1;
}
int main(){
  vector<int> arr={1,3,5,7,9,11,13,15,17};
  cout<<"Search 11: index "<<binarySearch(arr,11)<<endl;
  cout<<"Search 6: index "<<binarySearch(arr,6)<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Search in Rotated Array', description: 'A sorted array was rotated at some pivot. Search for target in O(log n).', hint: 'One half is always sorted. Check which half and recurse on it.' },
    },
    {
      id: 'trees', title: 'Trees & BST', difficulty: 'Intermediate', duration: '25 min',
      theory: `## Binary Trees & BST\nA tree is a hierarchical structure. **BST**: left < root < right.\n\n### Traversals\n- **Inorder** (L→Root→R): gives sorted order in BST\n- **Preorder** (Root→L→R): copy tree\n- **Postorder** (L→R→Root): delete tree\n\n### BST Complexity\n| Op | Average | Worst |\n|---|---|---|\n|Search|O(log n)|O(n)|\n|Insert|O(log n)|O(n)|`,
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

class BST:
    def __init__(self): self.root = None

    def insert(self, val):
        def _ins(node, val):
            if not node: return TreeNode(val)
            if val < node.val: node.left = _ins(node.left, val)
            else: node.right = _ins(node.right, val)
            return node
        self.root = _ins(self.root, val)

    def inorder(self, node, result=[]):
        if node:
            self.inorder(node.left, result)
            result.append(node.val)
            self.inorder(node.right, result)
        return result

    def height(self, node):
        if not node: return 0
        return 1 + max(self.height(node.left), self.height(node.right))

bst = BST()
for v in [5,3,7,1,4,6,8]: bst.insert(v)
print("Inorder (sorted):", bst.inorder(bst.root, []))
print("Height:", bst.height(bst.root))`,
        javascript: `class TreeNode{constructor(v){this.val=v;this.left=this.right=null;}}
class BST{
  constructor(){this.root=null;}
  insert(val){
    const ins=(n,v)=>{if(!n)return new TreeNode(v);v<n.val?n.left=ins(n.left,v):n.right=ins(n.right,v);return n;};
    this.root=ins(this.root,val);
  }
  inorder(n=[],node=this.root){if(node){this.inorder(n,node.left);n.push(node.val);this.inorder(n,node.right);}return n;}
  height(n=this.root){if(!n)return 0;return 1+Math.max(this.height(n.left),this.height(n.right));}
}
const bst=new BST();
[5,3,7,1,4,6,8].forEach(v=>bst.insert(v));
console.log("Inorder:", bst.inorder().join(", "));
console.log("Height:", bst.height());`,
        cpp: `#include<iostream>
#include<vector>
using namespace std;
struct Node{int val;Node*left,*right;Node(int v):val(v),left(nullptr),right(nullptr){}};
Node*insert(Node*n,int v){if(!n)return new Node(v);if(v<n->val)n->left=insert(n->left,v);else n->right=insert(n->right,v);return n;}
void inorder(Node*n,vector<int>&r){if(!n)return;inorder(n->left,r);r.push_back(n->val);inorder(n->right,r);}
int height(Node*n){if(!n)return 0;return 1+max(height(n->left),height(n->right));}
int main(){
  Node*root=nullptr;
  for(int v:{5,3,7,1,4,6,8}) root=insert(root,v);
  vector<int>r; inorder(root,r);
  for(int x:r) cout<<x<<" "; cout<<endl;
  cout<<"Height: "<<height(root)<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Level Order Traversal', description: 'Print a binary tree level by level (BFS order).', hint: 'Use a queue. Enqueue root, then for each node dequeue and enqueue its children.' },
    },
    {
      id: 'graphs', title: 'Graphs - BFS & DFS', difficulty: 'Advanced', duration: '30 min',
      theory: `## Graphs\nA graph has vertices (nodes) and edges (connections). Can be directed or undirected, weighted or unweighted.\n\n### Representations\n1. **Adjacency List** — space efficient for sparse graphs\n2. **Adjacency Matrix** — O(1) edge check, more memory\n\n### Traversals\n- **BFS** — level by level using queue, shortest path in unweighted\n- **DFS** — go deep using stack/recursion, detect cycles`,
      starterCode: {
        python: `from collections import deque

graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
}

def bfs(graph, start):
    visited, queue, order = set(), deque([start]), []
    visited.add(start)
    while queue:
        node = queue.popleft()
        order.append(node)
        for nbr in graph[node]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return order

def dfs(graph, node, visited=None, order=None):
    if visited is None: visited, order = set(), []
    visited.add(node)
    order.append(node)
    for nbr in graph[node]:
        if nbr not in visited:
            dfs(graph, nbr, visited, order)
    return order

print("BFS from 0:", bfs(graph, 0))
print("DFS from 0:", dfs(graph, 0))`,
        javascript: `const graph={0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1,5],5:[2,4]};
function bfs(g,start){
  const visited=new Set([start]),queue=[start],order=[];
  while(queue.length){
    const node=queue.shift(); order.push(node);
    for(const nbr of g[node]) if(!visited.has(nbr)){visited.add(nbr);queue.push(nbr);}
  }
  return order;
}
function dfs(g,node,visited=new Set(),order=[]){
  visited.add(node); order.push(node);
  for(const nbr of g[node]) if(!visited.has(nbr)) dfs(g,nbr,visited,order);
  return order;
}
console.log("BFS:", bfs(graph,0).join(" -> "));
console.log("DFS:", dfs(graph,0).join(" -> "));`,
        cpp: `#include<iostream>
#include<vector>
#include<queue>
using namespace std;
vector<vector<int>> g={{1,2},{0,3,4},{0,5},{1},{1,5},{2,4}};
void bfs(int s){
  vector<bool>vis(6,false);queue<int>q;q.push(s);vis[s]=true;
  while(!q.empty()){int n=q.front();q.pop();cout<<n<<" ";for(int nb:g[n])if(!vis[nb]){vis[nb]=true;q.push(nb);}}
  cout<<endl;
}
void dfs(int n,vector<bool>&vis){vis[n]=true;cout<<n<<" ";for(int nb:g[n])if(!vis[nb])dfs(nb,vis);}
int main(){
  cout<<"BFS: "; bfs(0);
  vector<bool>vis(6,false); cout<<"DFS: "; dfs(0,vis); cout<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Number of Islands', description: 'Given a 2D grid of 1s (land) and 0s (water), count the number of islands using DFS/BFS.', hint: 'For each unvisited land cell, run DFS to mark entire island as visited, increment counter.' },
    },
    {
      id: 'sorting', title: 'Sorting Algorithms', difficulty: 'Intermediate', duration: '22 min',
      theory: `## Sorting Algorithms\n\n| Algorithm | Best | Average | Worst | Space |\n|---|---|---|---|---|\n|Bubble Sort|O(n)|O(n²)|O(n²)|O(1)|\n|Merge Sort|O(n log n)|O(n log n)|O(n log n)|O(n)|\n|Quick Sort|O(n log n)|O(n log n)|O(n²)|O(log n)|\n|Heap Sort|O(n log n)|O(n log n)|O(n log n)|O(1)|\n\nFor most cases: use built-in sort (Timsort O(n log n)).`,
      starterCode: {
        python: `import time, random

def bubble_sort(arr):
    a = arr[:]
    n = len(a)
    for i in range(n):
        for j in range(n-i-1):
            if a[j] > a[j+1]: a[j],a[j+1] = a[j+1],a[j]
    return a

def merge_sort(arr):
    if len(arr)<=1: return arr
    mid=len(arr)//2
    L,R=merge_sort(arr[:mid]),merge_sort(arr[mid:])
    result,i,j=[],0,0
    while i<len(L) and j<len(R):
        if L[i]<=R[j]: result.append(L[i]);i+=1
        else: result.append(R[j]);j+=1
    return result+L[i:]+R[j:]

arr=random.sample(range(1,101),20)
print("Original:",arr)
t1=time.time(); b=bubble_sort(arr); t1=time.time()-t1
t2=time.time(); m=merge_sort(arr); t2=time.time()-t2
print("Bubble:", b)
print("Merge: ", m)
print(f"Bubble: {t1*1000:.4f}ms | Merge: {t2*1000:.4f}ms")`,
        javascript: `function bubbleSort(arr){
  const a=[...arr],n=a.length;
  for(let i=0;i<n;i++) for(let j=0;j<n-i-1;j++) if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];
  return a;
}
function mergeSort(arr){
  if(arr.length<=1) return arr;
  const mid=arr.length>>1;
  const L=mergeSort(arr.slice(0,mid)),R=mergeSort(arr.slice(mid));
  const res=[];let i=0,j=0;
  while(i<L.length&&j<R.length) L[i]<=R[j]?res.push(L[i++]):res.push(R[j++]);
  return res.concat(L.slice(i),R.slice(j));
}
const arr=Array.from({length:15},()=>Math.floor(Math.random()*100)+1);
console.log("Original:", arr.join(", "));
const t1=performance.now(), b=bubbleSort(arr), bt=performance.now()-t1;
const t2=performance.now(), m=mergeSort(arr), mt=performance.now()-t2;
console.log("Bubble:", b.join(", "));
console.log("Merge:", m.join(", "));
console.log(\`Bubble: \${bt.toFixed(3)}ms | Merge: \${mt.toFixed(3)}ms\`);`,
        cpp: `#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
void bubbleSort(vector<int>a){
  int n=a.size();
  for(int i=0;i<n;i++) for(int j=0;j<n-i-1;j++) if(a[j]>a[j+1]) swap(a[j],a[j+1]);
  cout<<"Bubble: "; for(int x:a) cout<<x<<" "; cout<<endl;
}
int main(){
  vector<int>arr={64,34,25,12,22,11,90,45,78,33};
  cout<<"Original: "; for(int x:arr) cout<<x<<" "; cout<<endl;
  bubbleSort(arr);
  sort(arr.begin(),arr.end());
  cout<<"std::sort: "; for(int x:arr) cout<<x<<" "; cout<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 Sort Colors (Dutch Flag)', description: 'Sort array of 0s, 1s, and 2s in one pass without extra space.', hint: 'Use three pointers: low, mid, high. Dutch National Flag algorithm.' },
    },
    {
      id: 'dp', title: 'Dynamic Programming', difficulty: 'Advanced', duration: '35 min',
      theory: `## Dynamic Programming\nSolve complex problems by breaking into overlapping subproblems and storing results (memoization/tabulation).\n\n### Two Approaches\n1. **Top-Down (Memoization):** Recursion + cache\n2. **Bottom-Up (Tabulation):** Fill table iteratively\n\n### When to apply DP\n- Optimal substructure: optimal solution uses optimal subsolutions\n- Overlapping subproblems: same subproblem solved multiple times\n\n### Classic Problems\nFibonacci, Knapsack, LCS, LIS, Coin Change`,
      starterCode: {
        python: `import time

# Fibonacci - 3 approaches
def fib_naive(n):
    if n<=1: return n
    return fib_naive(n-1)+fib_naive(n-2)

memo={}
def fib_memo(n):
    if n in memo: return memo[n]
    if n<=1: return n
    memo[n]=fib_memo(n-1)+fib_memo(n-2)
    return memo[n]

def fib_dp(n):
    if n<=1: return n
    dp=[0]*(n+1); dp[1]=1
    for i in range(2,n+1): dp[i]=dp[i-1]+dp[i-2]
    return dp[n]

# Coin Change
def coin_change(coins, amount):
    dp=[float('inf')]*(amount+1); dp[0]=0
    for i in range(1,amount+1):
        for c in coins:
            if c<=i: dp[i]=min(dp[i], dp[i-c]+1)
    return dp[amount] if dp[amount]!=float('inf') else -1

print("Fib(10) naive:", fib_naive(10))
print("Fib(40) memo:", fib_memo(40))
print("Fib(40) dp:", fib_dp(40))
print("\\nCoin change [1,5,11] target=15:", coin_change([1,5,11],15))
print("Coin change [2] target=3:", coin_change([2],3))`,
        javascript: `// Fibonacci - memoization
const memo={};
function fibMemo(n){if(n in memo)return memo[n];if(n<=1)return n;return memo[n]=fibMemo(n-1)+fibMemo(n-2);}
function fibDp(n){if(n<=1)return n;const dp=new Array(n+1).fill(0);dp[1]=1;for(let i=2;i<=n;i++)dp[i]=dp[i-1]+dp[i-2];return dp[n];}

// Coin Change
function coinChange(coins,amount){
  const dp=new Array(amount+1).fill(Infinity); dp[0]=0;
  for(let i=1;i<=amount;i++) for(const c of coins) if(c<=i) dp[i]=Math.min(dp[i],dp[i-c]+1);
  return dp[amount]===Infinity?-1:dp[amount];
}

// Longest Common Subsequence
function lcs(a,b){
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}
console.log("Fib(40):", fibDp(40));
console.log("Coin change [1,5,11] target=15:", coinChange([1,5,11],15));
console.log("LCS('ABCBDAB','BDCAB'):", lcs("ABCBDAB","BDCAB"));`,
        cpp: `#include<iostream>
#include<vector>
#include<climits>
using namespace std;
int coinChange(vector<int>&coins,int amount){
  vector<int>dp(amount+1,INT_MAX); dp[0]=0;
  for(int i=1;i<=amount;i++) for(int c:coins) if(c<=i&&dp[i-c]!=INT_MAX) dp[i]=min(dp[i],dp[i-c]+1);
  return dp[amount]==INT_MAX?-1:dp[amount];
}
int lcs(string a,string b){
  int m=a.size(),n=b.size();
  vector<vector<int>>dp(m+1,vector<int>(n+1,0));
  for(int i=1;i<=m;i++) for(int j=1;j<=n;j++) dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}
int main(){
  vector<int>coins={1,5,11}; cout<<"Coin change: "<<coinChange(coins,15)<<endl;
  cout<<"LCS: "<<lcs("ABCBDAB","BDCAB")<<endl;
  return 0;
}`,
      },
      challenge: { title: '🎯 0/1 Knapsack', description: 'Given weights and values of n items, find maximum value achievable within weight capacity W.', hint: 'dp[i][w] = max value using first i items with capacity w. Either skip item i or include it.' },
    },
  ],
};
