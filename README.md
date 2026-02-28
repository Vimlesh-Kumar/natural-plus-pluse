# Natural++

Welcome to **Natural++**, a programming language designed to be as close to spoken English as possible so that it's extremely easy for normal humans to learn and code.

We have officially transitioned from a JavaScript Transpiler to a **Self-Hosted Native C++ Engine**! Natural++ is no longer a wrapper. It executes directly as a standalone VM without relying on NodeJS or V8.

## Getting Started

1. Make sure you have `clang++` or `make` installed.
2. Build the Natural++ Native Virtual Machine:

```bash
make
```

3. Run your `.npp` programs natively through the generated executable:

```bash
bin/natural test.npp
```

## Language Features

### Variable Declarations

```npp
create variable my_name equal to "John"
create constant pi equal to 3.14
set my_name to "Alice"
```

### Outputs

```npp
display "Hello World"
show my_name
```

### Conditional Logic (If / Else If / Else)

```npp
if x is greater than 10 then
    display "x is big"
otherwise
    display "x is small"
end if
```

Operators include:

- `is equal to`
- `is not equal to`
- `is greater than`
- `is less than`
- `is greater than or equal to`
- `is less than or equal to`

### Loops

**While loops**:

```npp
while count is less than 5 do
    display count
    set count to count plus 1
end while
```

**Repeat loops**:

```npp
repeat 10 times
    display "Doing something 10 times"
end repeat
```

## How It Works ⚙️

Your `.npp` code runs natively inside the Custom C++ Virtual Machine found in `src/cpp/`. The internal Execution Engine processes code on a line-by-line block execution protocol, allowing variables, math, and dynamic types natively.

Enjoy building natively with Natural++!
