<div align="center">

# 🌿 Natural++ Programming Language Extension

<p>
  <img src="https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
  <img src="https://img.shields.io/badge/Syntax-Highlighted-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Language-English-orange?style=for-the-badge" />
</p>

**The futuristic programming language designed to look exactly like written English.**

</div>

## ✨ What is Natural++?

Welcome to the official VS Code language integration for **Natural++**! Say goodbye to cryptic `{}`, `()`, and `==`. Natural++ compiles directly into native C++ Abstract Syntax Trees!

This extension provides beautiful syntax coloring, rich keyword highlighting, and file associations for any `.npp` or `.natural` file.

## 🚀 Features

- **Full Keyword Highlighting:** Colors for `create`, `variable`, `if`, `otherwise`, `while`, `display`, `set`, `to`, `call`, and `note:` statements.
- **Math Operators Coloring:** Highlights English math statements like `plus`, `minus`, `times`, and `modulo` automatically.
- **DP and OOP Coloring:** Native support for the brand new `list`, `add to`, `object`, and `property` syntax!
- **Data Highlight:** Automatic detection for Floats, Integers, Strings, and Variable Names!

## 📘 Quick Study Guideline (Scratch to End)

Here is a full crash course on coding in Natural++ right in VS Code!

### 🟢 1. Basics & Variables

```npp
note: Save this as main.npp

create variable my_name equal to "Alice"
create variable base_score equal to 100

set base_score to base_score plus 50
display my_name
show base_score
```

### 🟡 2. Control Flow & Loops

```npp
create variable counter equal to 5

while counter is greater than 0 do
    if counter is equal to 3 then
        display "Halfway there!"
    otherwise
        display counter
    end if

    set counter to counter minus 1
end while
```

### 🔴 3. Data Programming (DP) & Arrays

```npp
create list highest_scores

add 95 to highest_scores
add 87 to highest_scores

note: Access dynamic values by their 0-index!
set highest_scores at 0 to 100
display highest_scores at 0
```

### 🟣 4. Object-Oriented Programming (OOP)

```npp
create object hero

set property "name" of hero to "Knight"
set property "health" of hero to 100

display property "health" of hero
```

## ⚙️ How to execute your code?

You can run your code natively through the [Natural++ Online IDE](https://github.com/Vimlesh-Kumar/natural-pluse-pluse) or by compiling the C++ engine natively on your system!

Simply download the repository via GitHub, run `make`, and run `bin/natural file.npp` in your terminal!
