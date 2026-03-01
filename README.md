<div align="center">

# 🌿 Natural++ Programming Language

![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-blue?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-C++%20Native-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**The futuristic programming language designed to look exactly like written English.**

Say goodbye to cryptic `{}`, `()`, and `==`. Natural++ compiles directly into native C++ Abstract Syntax Trees!

[**Try Online IDE**](https://github.com/Vimlesh-Kumar/natural-pluse-pluse) &nbsp;&bull;&nbsp; [**VS Code Extension**](#) &nbsp;&bull;&nbsp; [**Read Full Docs**](#)

</div>

<hr/>

## 📖 The "Scratch to End" Study Guideline

Welcome to the official Natural++ Academy! Below is a sequential study guide moving from basic variables all the way up to Object-Oriented syntax. No prior coding experience required!

### 🟢 1. Beginner Topics: The Basics

#### Variables & Data Types

Variables hold your data. In Natural++, you simply _speak_ to the computer to store information. No `int`, `string`, or `double` declarations—it's handled automatically!

```npp
note: This is how you leave comments so the computer ignores it.
create variable my_name equal to "Alice"
create variable age equal to 25

note: Updating a variable is easy!
set age to 26
```

#### Console Output (I/O)

To see your data on the screen, just tell the computer to `display` or `show` it.

```npp
display "Hello, Natural++ world!"
show my_name
```

#### Math Operators

Do math using plain English. Never mix up `+`, `-`, or `%` again!

```npp
create variable total equal to 100 plus 50
set total to total divided by 10
display total
```

_Supported Math Operators:_ `plus`, `minus`, `times`, `divided by`, `modulo`

---

### 🟡 2. Intermediate Topics: Logic & Flow

#### Conditional `If` Statements

Want your code to make decisions? Use the `if ... then ... otherwise` structure!

```npp
create variable score equal to 85

if score is greater than 80 then
    display "You passed with flying colors!"
otherwise
    display "Practice makes perfect!"
end if
```

_Supported Logical Operators:_ `is equal to`, `is not equal to`, `is greater than`, `is less than`, `is greater than or equal to`, `is less than or equal to`

#### The `While` Loop

Execute code continuously until a condition is met.

```npp
create variable countdown equal to 5

while countdown is greater than 0 do
    display countdown
    set countdown to countdown minus 1
end while
```

#### The `Repeat` Loop

When you know exactly how many times you want to loop:

```npp
repeat 3 times
    display "Hip Hip Hooray!"
end repeat
```

---

### 🔴 3. Advanced Topics: Complex Data (DP & OOP)

#### Arrays & Dynamic Programming (DP)

Need to store multiple items in a single list? Use the built-in `list` feature.

```npp
create list highest_scores

add 95 to highest_scores
add 87 to highest_scores

note: Lists start at 0 (0-indexed)
set highest_scores at 0 to 100
display highest_scores at 0
```

#### Object-Oriented Programming (OOP)

Build complex objects with named attributes/properties seamlessly without writing painful class blueprints!

```npp
create object hero

set property "name" of hero to "Knight"
set property "health" of hero to 100
set property "power" of hero to 50

NOTE: Reading from an object is just as natural!
display property "health" of hero
```

#### Functions & Recursion

Wrap reusable code into isolated blocks by defining `functions`.

```npp
define function say_hello as
    display "Welcome to the Machine!"
end function

call function say_hello
```

---

## ⚡ How to Run Natural++ Locally

Natural++ operates using a hyper-efficient compiled **C++ Engine Interpreter**, meaning it is blazing fast and runs independently on your native operating system.

### Installation

1. Clone this repository locally:

```bash
git clone https://github.com/Vimlesh-Kumar/natural-pluse-pluse.git
cd natural-pluse-pluse
```

2. Compile the C++ engine (Requires `clang++` or `g++` and `make`):

```bash
make
```

3. Run any file ending in `.npp` via the terminal:

```bash
bin/natural file_name.npp
```

---

<div align="center">
<i>Built with ❤️ for those who want to code naturally.</i>
</div>
