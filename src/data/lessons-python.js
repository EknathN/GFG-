export const pythonTrack = {
  id: 'python', title: 'Python for Beginners', icon: '🐍',
  color: 'bg-blue-100 text-blue-700 border-blue-200',
  headerColor: 'from-blue-600 to-blue-800',
  lessons: [
    {
      id: 'py-basics', title: 'Variables & Data Types', difficulty: 'Beginner', duration: '10 min',
      theory: `## Python Basics\nPython is beginner-friendly, readable, and versatile. No type declarations needed.\n\n### Data Types\n- \`str\` — text: \`"hello"\`\n- \`int\` — integer: \`42\`\n- \`float\` — decimal: \`3.14\`\n- \`bool\` — True/False\n- \`list\` — mutable sequence: \`[1,2,3]\`\n\n### f-strings\n\`f"Hello {name}!"\` — the modern way to format strings.`,
      starterCode: {
        python: `name = "GFG Coder"
age = 20
gpa = 9.2
is_member = True

print(f"Name: {name}")
print(f"Age: {age}, GPA: {gpa}")
print(f"Member: {is_member}")
print(f"Type of age: {type(age)}")

# Arithmetic
x, y = 17, 5
print(f"\\n{x} + {y} = {x+y}")
print(f"{x} - {y} = {x-y}")
print(f"{x} * {y} = {x*y}")
print(f"{x} / {y} = {x/y:.2f}")
print(f"{x} // {y} = {x//y}  (floor division)")
print(f"{x} % {y} = {x%y}   (modulo)")
print(f"{x} ** {y} = {x**y}  (power)")`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Temperature Converter', description: 'Write a program that converts Celsius to Fahrenheit and Kelvin. Formula: F = C*9/5 + 32, K = C + 273.15', hint: 'Use variables and f-strings to display the converted values.' },
    },
    {
      id: 'py-control', title: 'Conditionals & Loops', difficulty: 'Beginner', duration: '12 min',
      theory: `## Control Flow\n**if/elif/else** — decision making\n**for loop** — iterate over sequences\n**while loop** — repeat while condition is true\n\n### Useful Loop Tools\n- \`range(start, stop, step)\` — number sequences\n- \`enumerate(list)\` — index + value pairs\n- \`break\` / \`continue\` — exit or skip\n- List comprehension: \`[x*2 for x in arr if x>0]\``,
      starterCode: {
        python: `# Grading system
marks = [85, 92, 78, 95, 60, 45, 88]
for i, m in enumerate(marks):
    if m >= 90:    grade = "A+"
    elif m >= 80:  grade = "A"
    elif m >= 70:  grade = "B"
    elif m >= 60:  grade = "C"
    else:           grade = "F"
    print(f"Student {i+1}: {m} marks → {grade}")

# FizzBuzz
print("\\nFizzBuzz 1-20:")
result = []
for n in range(1, 21):
    if n%15==0:   result.append("FizzBuzz")
    elif n%3==0:  result.append("Fizz")
    elif n%5==0:  result.append("Buzz")
    else:          result.append(str(n))
print(" ".join(result))

# List comprehensions
squares = [x**2 for x in range(1,11)]
evens   = [x for x in range(1,21) if x%2==0]
print("\\nSquares:", squares)
print("Evens:", evens)`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Prime Numbers', description: 'Print all prime numbers from 1 to 100 using a loop. A prime is divisible only by 1 and itself.', hint: 'For each n, check if any number from 2 to sqrt(n) divides n evenly.' },
    },
    {
      id: 'py-functions', title: 'Functions & Recursion', difficulty: 'Beginner', duration: '15 min',
      theory: `## Functions\nA function groups reusable code. Use \`def\` to define.\n\n### Key concepts\n- **Parameters** — inputs to the function\n- **Return value** — output\n- **Default parameters** — \`def greet(name="World")\`\n- **Recursion** — function calls itself\n\n### Recursion rules\n1. Always have a **base case** (stop condition)\n2. Each call moves closer to base case`,
      starterCode: {
        python: `def factorial(n):
    if n <= 1: return 1
    return n * factorial(n-1)

def fibonacci(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fibonacci(n-1) + fibonacci(n-2)
    return memo[n]

def power(base, exp):
    if exp == 0: return 1
    if exp % 2 == 0:
        half = power(base, exp//2)
        return half * half
    return base * power(base, exp-1)

def is_palindrome(s):
    s = s.lower().replace(" ","")
    if len(s) <= 1: return True
    if s[0] != s[-1]: return False
    return is_palindrome(s[1:-1])

print("Factorials:", [factorial(n) for n in range(1,8)])
print("Fibonacci:",  [fibonacci(n) for n in range(10)])
print("2^10 =", power(2,10))
words = ["racecar","hello","madam","python","level"]
for w in words: print(f"'{w}' palindrome: {is_palindrome(w)}")`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Tower of Hanoi', description: 'Solve Tower of Hanoi recursively for n=3 disks. Print each move.', hint: 'move(n, source, destination, auxiliary): move n-1 to aux, move disk n to dest, move n-1 from aux to dest.' },
    },
    {
      id: 'py-collections', title: 'Lists, Dicts, Sets & Tuples', difficulty: 'Beginner', duration: '15 min',
      theory: `## Python Collections\n\n| Type | Ordered | Mutable | Duplicates |\n|---|---|---|---|\n|list|✅|✅|✅|\n|tuple|✅|❌|✅|\n|set|❌|✅|❌|\n|dict|✅(3.7+)|✅|keys: ❌|\n\n### When to use\n- **list** — ordered data, frequent iteration\n- **dict** — key-value lookup\n- **set** — unique membership testing\n- **tuple** — immutable, safe records`,
      starterCode: {
        python: `# Lists
students = ["Alice","Bob","Charlie","Diana"]
students.append("Eve")
students.insert(0,"Zara")
print("List:", students)
print("Sorted:", sorted(students))
print("Sliced [1:4]:", students[1:4])

# Dict
scores = {"Alice":95,"Bob":80,"Charlie":88,"Diana":92}
scores["Eve"] = 78
print("\\nScores:", scores)
print("Top scorer:", max(scores, key=scores.get))
print("Average:", sum(scores.values())/len(scores))
for name, score in sorted(scores.items(), key=lambda x: -x[1]):
    print(f"  {name}: {score}")

# Set operations
set_a = {1,2,3,4,5}
set_b = {4,5,6,7,8}
print("\\nUnion:", set_a | set_b)
print("Intersection:", set_a & set_b)
print("Difference A-B:", set_a - set_b)

# Tuple
point = (10, 20)
x, y = point  # unpacking
print(f"\\nPoint: x={x}, y={y}")`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Word Frequency Counter', description: 'Count how many times each word appears in a sentence and print top 3 most frequent words.', hint: 'Split sentence into words, use a dict to count, then sort by value.' },
    },
    {
      id: 'py-oop', title: 'Object-Oriented Python', difficulty: 'Intermediate', duration: '20 min',
      theory: `## OOP in Python\nOOP organises code into **classes** (blueprints) and **objects** (instances).\n\n### 4 Pillars\n1. **Encapsulation** — bundle data + methods\n2. **Inheritance** — child class reuses parent\n3. **Polymorphism** — same interface, different behavior\n4. **Abstraction** — hide complexity\n\n### Key syntax\n- \`__init__\` — constructor\n- \`self\` — refers to instance\n- \`super()\` — call parent method`,
      starterCode: {
        python: `class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}!"

    def __str__(self):
        return f"Animal({self.name})"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Woof")
        self.breed = breed

    def fetch(self, item):
        return f"{self.name} fetches the {item}!"

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

    def purr(self):
        return f"{self.name} is purring... 😸"

# Polymorphism
animals = [Dog("Rex","Labrador"), Cat("Whiskers"), Dog("Max","Poodle")]
for a in animals:
    print(a.speak())

rex = Dog("Rex","Labrador")
print(rex.fetch("ball"))
print(Cat("Luna").purr())`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Bank Account', description: 'Create a BankAccount class with deposit, withdraw (check insufficient funds), and get_balance methods.', hint: 'Use __init__ to set initial balance. Raise ValueError if withdrawal exceeds balance.' },
    },
    {
      id: 'py-fileio', title: 'File I/O & Error Handling', difficulty: 'Intermediate', duration: '18 min',
      theory: `## File I/O & Exceptions\nPython handles files with \`open()\` and errors with \`try/except\`.\n\n### File modes\n- \`'r'\` — read\n- \`'w'\` — write (overwrites)\n- \`'a'\` — append\n\n### Exception Handling\n\`\`\`python\ntry:\n    risky_code()\nexcept ValueError as e:\n    handle_error(e)\nelse:\n    # runs if no exception\nfinally:\n    # always runs\n\`\`\``,
      starterCode: {
        python: `import os

# Writing a file
with open("test.txt", "w") as f:
    f.write("Hello from GFG Club!\\n")
    f.write("Learning Python is fun!\\n")
    for i in range(1,6):
        f.write(f"Line {i}\\n")

# Reading it back
with open("test.txt", "r") as f:
    content = f.read()
print("File content:\\n", content)

# Exception handling
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "Error: Cannot divide by zero!"
    except TypeError:
        return "Error: Invalid types!"
    else:
        return f"{a} / {b} = {result:.2f}"

print(safe_divide(10, 3))
print(safe_divide(10, 0))
print(safe_divide("x", 2))

# Cleanup
if os.path.exists("test.txt"):
    os.remove("test.txt")
    print("\\nFile deleted")`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Custom Exception', description: 'Create a custom exception class AgeError. Write a function register_voter(age) that raises AgeError if age < 18.', hint: 'class AgeError(Exception): pass. Then raise AgeError("Must be 18+") in the function.' },
    },
    {
      id: 'py-advanced', title: 'Decorators & Generators', difficulty: 'Advanced', duration: '25 min',
      theory: `## Advanced Python\n**Decorators** wrap functions to add behavior without changing their code. Use \`@decorator\` syntax.\n\n**Generators** use \`yield\` instead of \`return\` — they generate values lazily (one at a time), saving memory.\n\n**Lambda** — anonymous single-expression functions: \`lambda x: x*2\`\n\n### When to use generators\nWhen processing large sequences you don't want to load entirely into memory.`,
      starterCode: {
        python: `import time
from functools import wraps

# Decorator: timing
def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {(end-start)*1000:.2f}ms")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

result = slow_sum(1_000_000)
print("Sum:", result)

# Generator: infinite Fibonacci
def fib_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a+b

gen = fib_gen()
print("\\nFirst 12 Fibonacci:", [next(gen) for _ in range(12)])

# Generator for large files (memory-efficient)
def read_chunks(n, chunk_size=3):
    for i in range(0, n, chunk_size):
        yield list(range(i, min(i+chunk_size, n)))

print("\\nChunks of 10 in size 3:")
for chunk in read_chunks(10): print(" ", chunk)

# Lambda + map/filter
nums = [1,2,3,4,5,6,7,8,9,10]
evens_sq = list(map(lambda x: x**2, filter(lambda x: x%2==0, nums)))
print("\\nEven squares:", evens_sq)`,
        javascript: ``, cpp: ``,
      },
      challenge: { title: '🎯 Memoization Decorator', description: 'Write a @memoize decorator that caches function results. Apply it to a slow recursive function.', hint: 'Store results in a dict inside wrapper. Check cache before computing.' },
    },
  ],
};
