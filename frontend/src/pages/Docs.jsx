import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { StreamLanguage } from "@codemirror/language";
import { Play } from "lucide-react";

const naturalLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.match(/"([^"\\]|\\.)*"/)) return "string";
    if (
      stream.match(
        /(?:plus|minus|times|divided by|modulo|is equal to|is greater than|is less than|and|or)\b/,
      )
    )
      return "operator";
    if (
      stream.match(
        /(?:create|variable|constant|list|object|set|property|of|at|add|to|if|then|otherwise|while|do|repeat|times|end|function|call|with|parameter|parameters|as|display|show|return)\b/,
      )
    )
      return "keyword";
    if (stream.match(/0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i))
      return "number";
    if (stream.match(/note:.*/)) return "comment";
    if (stream.match(/[a-zA-Z_]\w*/)) return "variableName";
    stream.next();
    return null;
  },
});

const CodeBlock = ({ code, onTryIt }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="example-box">
      <h4>Example in Natural++</h4>
      <div className="code-wrapper">
        <button
          className={`copy-btn \${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <div style={{ borderRadius: "6px", overflow: "hidden" }}>
          <CodeMirror
            value={code}
            theme={dracula}
            extensions={[naturalLanguage]}
            editable={false}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
            }}
          />
        </div>
      </div>
      <button className="try-it-btn" onClick={() => onTryIt(code)}>
        <Play size={14} /> Try it Yourself »
      </button>
    </div>
  );
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState("home");

  // Right side IDE State
  const [ideCode, setIdeCode] = useState(
    'note: Click "Try it Yourself"\
note: on any example to load it here!\
\
display "Hello World!"\
',
  );
  const [running, setRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    { text: "Waiting for execution...", isError: false, startup: true },
  ]);
  const endOfTerminalRef = useRef(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  const loadExample = (code) => {
    setIdeCode(code);
  };

  const clearTerminal = () => setTerminalOutput([]);

  const runCode = async () => {
    setRunning(true);
    const newOutput = [
      ...terminalOutput,
      { text: "> Running code...", isError: false },
    ];
    setTerminalOutput(newOutput);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ideCode }),
      });

      const result = await response.json();

      setTerminalOutput((prev) => {
        let nxt = [...prev];
        if (result.error && !result.output) {
          nxt.push({ text: result.error, isError: true });
        } else {
          if (result.output) nxt.push({ text: result.output, isError: false });
          if (result.error) nxt.push({ text: result.error, isError: true });
          nxt.push({
            text: "> Program finished with exit status 0.\
",
            isError: false,
          });
        }
        return nxt;
      });
    } catch (error) {
      setTerminalOutput((prev) => [
        ...prev,
        { text: `Execution failed: ${error.message}`, isError: true },
      ]);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".main-content section");
      let current = "home";
      sections.forEach((section) => {
        // Adjust scroll offset to catch active section correctly
        const sectionTop = section.offsetTop - 300;
        const mainContent = document.querySelector(".main-content");
        if (mainContent && mainContent.scrollTop >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
      setActiveSection(current);
    };

    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
      return () => mainContent.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="docs-page">
      <div className="sidebar">
        <div className="sidebar-btn-container">
          <Link
            to="/"
            className="nav-btn"
            style={{ width: "100%", justifyContent: "center" }}
          >
            ← Back to IDE
          </Link>
        </div>
        <h2>Natural++ Tutorial</h2>

        <div className="sidebar-group-label">Beginner Topics</div>
        <a href="#home" className={activeSection === "home" ? "active" : ""}>
          Natural++ Home
        </a>
        <a href="#intro" className={activeSection === "intro" ? "active" : ""}>
          Natural++ Intro
        </a>
        <a
          href="#getstarted"
          className={activeSection === "getstarted" ? "active" : ""}
        >
          Natural++ Get Started
        </a>
        <a
          href="#syntax"
          className={activeSection === "syntax" ? "active" : ""}
        >
          Natural++ Syntax
        </a>
        <a
          href="#variables"
          className={activeSection === "variables" ? "active" : ""}
        >
          Variables & Data Types
        </a>
        <a
          href="#operators"
          className={activeSection === "operators" ? "active" : ""}
        >
          Natural++ Operators
        </a>
        <a
          href="#output"
          className={activeSection === "output" ? "active" : ""}
        >
          Input / Output
        </a>
        <a
          href="#conditions"
          className={activeSection === "conditions" ? "active" : ""}
        >
          Control Flow: If...Then
        </a>
        <a
          href="#loops"
          className={
            activeSection === "whileloop" ||
            activeSection === "repeatloop" ||
            activeSection === "loops"
              ? "active"
              : ""
          }
        >
          Control Flow: Loops
        </a>
        <a
          href="#functions"
          className={activeSection === "functions" ? "active" : ""}
        >
          Functions & Recursion
        </a>

        <div className="sidebar-group-label" style={{ marginTop: "16px" }}>
          Intermediate Topics
        </div>
        <a href="#lists" className={activeSection === "lists" ? "active" : ""}>
          Arrays & Lists (DP)
        </a>
        <a
          href="#pointers"
          className={activeSection === "pointers" ? "active" : ""}
        >
          Pointers & References
        </a>
        <a
          href="#structures"
          className={activeSection === "structures" ? "active" : ""}
        >
          Structures & Unions
        </a>
        <a
          href="#objects"
          className={activeSection === "objects" ? "active" : ""}
        >
          Object-Oriented (OOP)
        </a>
        <a href="#stl" className={activeSection === "stl" ? "active" : ""}>
          Standard Templates (STL)
        </a>
        <a
          href="#exceptions"
          className={activeSection === "exceptions" ? "active" : ""}
        >
          Exception Handling
        </a>
        <a
          href="#fileio"
          className={activeSection === "fileio" ? "active" : ""}
        >
          File Handling
        </a>

        <div className="sidebar-group-label" style={{ marginTop: "16px" }}>
          Advanced Topics
        </div>
        <a
          href="#modern"
          className={activeSection === "modern" ? "active" : ""}
        >
          Modern C++ (11/14/17/20)
        </a>
        <a
          href="#concurrency"
          className={activeSection === "concurrency" ? "active" : ""}
        >
          Concurrency & Threads
        </a>
        <a
          href="#memory"
          className={activeSection === "memory" ? "active" : ""}
        >
          Advanced Memory Management
        </a>
        <a
          href="#metaprogramming"
          className={activeSection === "metaprogramming" ? "active" : ""}
        >
          Metaprogramming
        </a>
        <a
          href="#designpatterns"
          className={activeSection === "designpatterns" ? "active" : ""}
        >
          Design Patterns
        </a>
      </div>

      <div className="main-content">
        <div className="docs-header">
          <div>
            <h1>Natural++ Tutorial</h1>
            <p className="subtitle">
              Learn to code using normal English language sentences!
            </p>
          </div>
        </div>
        {/* HOME */}
        <section id="home">
          <h2 className="section-title">Natural++ Tutorial</h2>
          <div className="callout">
            <p>
              <strong>Natural++</strong> is a revolutionary programming language
              that runs natively in C++ but looks like standard written English.
            </p>
            <p>
              Our completely free online tutorial will teach you how to write
              logic, create applications, and solve problems without memorizing
              confusing syntax like brackets <code>{"{ }"}</code> and semicolons{" "}
              <code>;</code>.
            </p>
          </div>
          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable count equal to 1\
\
while count is less than or equal to 5 do\
    display count\
    set count to count plus 1\
end while`}
          />
        </section>
        <hr />
        {/* INTRO */}
        <section id="intro">
          <h2 className="section-title">Natural++ Introduction</h2>
          <h3>What is Natural++?</h3>
          <ul>
            <li>Natural++ is a high-level compiled language.</li>
            <li>
              It was designed to help beginners and non-programmers bridge the
              gap into computer logic.
            </li>
            <li>It runs natively on a custom C++ Virtual Machine.</li>
          </ul>
          <h3>Why Use Natural++?</h3>
          <ul>
            <li>
              <strong>Readable:</strong> It reads exactly like a human sentence.
            </li>
            <li>
              <strong>Less Error-Prone:</strong> No missing semicolons or
              mismatched curly brackets to worry about.
            </li>
            <li>
              <strong>Web Integrated:</strong> Test and write code instantly in
              the browser.
            </li>
          </ul>
        </section>
        <hr />
        <section id="getstarted">
          <h2 className="section-title">Natural++ Get Started</h2>
          <p>
            To get started with Natural++, you don't need to install anything!
            You can use our Web IDE directly to write and execute code in real
            time. By clicking "Try it Yourself" on any of the examples below,
            you can instantly run and modify the code in the runner on the
            right!
          </p>
        </section>
        <hr />
        <section id="syntax">
          <h2 className="section-title">Natural++ Syntax</h2>
          <p>
            A Natural++ script is executed line by line. Every line represents
            an instruction.
          </p>

          <CodeBlock
            onTryIt={loadExample}
            code={`
display "Hello World!"`}
          />

          <h3>Omitted Characters</h3>
          <p>
            Unlike languages such as C++ or JavaScript, Natural++ does{" "}
            <strong>not</strong> use:
          </p>
          <ul>
            <li>
              Semicolons <code>;</code> at the ends of lines.
            </li>
            <li>
              Parentheses <code>()</code> around conditions.
            </li>
            <li>
              Curly brackets <code>{"{ }"}</code> to group code blocks.
            </li>
          </ul>
        </section>
        <hr />
        <section id="output">
          <h2 className="section-title">Natural++ Output (Print)</h2>
          <p>
            In Natural++, you output text or values using the{" "}
            <code className="syn-function">display</code> or{" "}
            <code className="syn-function">show</code> keyword.
          </p>

          <CodeBlock
            onTryIt={loadExample}
            code={`
display "I am learning Natural++"\
show "It is very easy to read!"`}
          />

          <p>You can also display math or numbers directly without quotes.</p>
          <CodeBlock
            onTryIt={loadExample}
            code={`
display 300`}
          />
        </section>
        <hr />
        <section id="comments">
          <h2 className="section-title">Natural++ Comments</h2>
          <p>
            Comments can be used to explain Natural++ code, and to make it more
            readable.
          </p>
          <h3>Single-line Comments</h3>
          <p>
            To create a comment, simply start the line with{" "}
            <code className="syn-comment">note:</code>.
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`
note: This is a comment\
display "Hello World!"`}
          />
        </section>
        <hr />
        <section id="variables">
          <h2 className="section-title">Natural++ Variables</h2>
          <p>Variables are containers for storing data values.</p>
          <p>
            In Natural++, variables are created the moment you declare them
            using <code className="syn-keyword">create variable</code>.
          </p>

          <h3>Declaring Variables</h3>
          <p>
            To create a variable, specify the name and assign it a value using{" "}
            <code className="syn-keyword">equal to</code>:
          </p>
          <pre>
            <code>
              <span className="syn-keyword">create variable</span>{" "}
              <em>variableName</em>{" "}
              <span className="syn-keyword">equal to</span> <em>value</em>
            </code>
          </pre>

          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable name equal to "John Doe"\
create variable age equal to 35\
\
display name\
display age`}
          />

          <h3>Assigning / Updating Variables</h3>
          <p>
            If a variable already exists, you change its value using{" "}
            <code className="syn-keyword">set</code> and{" "}
            <code className="syn-keyword">to</code>.
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable x equal to 10\
set x to 20\
\
note: x is now 20\
display x`}
          />
        </section>
        <hr />
        <section id="lists">
          <h2 className="section-title">Natural++ Arrays / Lists (DP)</h2>
          <p>
            When utilizing Dynamic Programming or handling multiple values, you
            can create and manipulate <code>lists</code> natively!
          </p>
          <h3>Creating and Adding to a List</h3>
          <CodeBlock
            onTryIt={loadExample}
            code={`note: Create an empty array
create list my_list

add 10 to my_list
add 20 to my_list

show my_list`}
          />

          <h3>Accessing and Modifying using 'at'</h3>
          <p>
            Lists in Natural++ are 0-indexed. You can read or assign values to
            specific indices directly.
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`create list scores

set scores at 0 to 95
set scores at 1 to 87

show "First score is:"
show scores at 0`}
          />
        </section>
        <hr />
        <section id="objects">
          <h2 className="section-title">Natural++ Objects (OOPs)</h2>
          <p>
            Natural++ makes Object-Oriented Programming (OOP) readable! You can
            instantiate objects and assign/read properties seamlessly.
          </p>
          <h3>Object Initialization & Properties</h3>
          <p>
            Use the <code>object</code> keyword to create an dictionary mapping,
            and the <code>property [key] of [obj]</code> syntax to build your
            object tree!
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`create object player

set property "name" of player to "Hero"
set property "health" of player to 100

note: Accessing properties is purely sentences!
display property "health" of player`}
          />
        </section>
        <hr />
        <section id="datatypes">
          <h2 className="section-title">Natural++ Data Types</h2>
          <p>
            A variable in Natural++ can store different types of data under the
            hood. Currently, the most used ones are:
          </p>
          <ul>
            <li>
              <strong>Numbers</strong>: <code>10</code>, <code>3.14</code>
            </li>
            <li>
              <strong>Strings</strong>: <code>"Hello"</code>
            </li>
          </ul>
        </section>
        <hr />
        <section id="operators">
          <h2 className="section-title">Natural++ Operators</h2>
          <p>
            Operators are used to perform operations on variables and values.
            Natural++ completely replaces cryptic symbols like <code>+</code>,{" "}
            <code>-</code>, <code>*</code>, <code>==</code> with pure English
            words.
          </p>

          <h3>Arithmetic Operators</h3>
          <table>
            <tbody>
              <tr>
                <th>English Keyword</th>
                <th>Meaning</th>
                <th>Example</th>
              </tr>
              <tr>
                <td>
                  <code>plus</code>
                </td>
                <td>Addition</td>
                <td>
                  <code>x plus y</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>minus</code>
                </td>
                <td>Subtraction</td>
                <td>
                  <code>x minus y</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>times</code>
                </td>
                <td>Multiplication</td>
                <td>
                  <code>x times y</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>divided by</code>
                </td>
                <td>Division</td>
                <td>
                  <code>x divided by y</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>modulo</code>
                </td>
                <td>Remainder</td>
                <td>
                  <code>x modulo y</code>
                </td>
              </tr>
            </tbody>
          </table>

          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable sum equal to 100 plus 50\
display sum`}
          />

          <h3>Comparison Operators</h3>
          <table>
            <tbody>
              <tr>
                <th>English Keyword</th>
                <th>Meaning (C++)</th>
              </tr>
              <tr>
                <td>
                  <code>is equal to</code>
                </td>
                <td>==</td>
              </tr>
              <tr>
                <td>
                  <code>is not equal to</code>
                </td>
                <td>!=</td>
              </tr>
              <tr>
                <td>
                  <code>is greater than</code>
                </td>
                <td>&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>is less than</code>
                </td>
                <td>&lt;</td>
              </tr>
              <tr>
                <td>
                  <code>is greater than or equal to</code>
                </td>
                <td>&gt;=</td>
              </tr>
              <tr>
                <td>
                  <code>is less than or equal to</code>
                </td>
                <td>&lt;=</td>
              </tr>
            </tbody>
          </table>
        </section>
        <hr />
        <section id="booleans">
          <h2 className="section-title">Natural++ Booleans</h2>
          <p>
            In Natural++, Boolean expressions return true or false implicitly
            when you use the comparison operators.
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable x equal to 10\
create variable y equal to 9\
\
note: This will evaluate internally to true\
if x is greater than y then\
    display "Math works!"\
end if`}
          />
        </section>
        <hr />
        <section id="conditions">
          <h2 className="section-title">
            Natural++ Conditions and If Statements
          </h2>
          <p>
            Natural++ supports the usual logical conditions from mathematics
            natively into English statements.
          </p>

          <h3>
            The <code>if ... then</code> Statement
          </h3>
          <pre>
            <code>
              <span className="syn-keyword">if</span> <em>condition</em>{" "}
              <span className="syn-keyword">then</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="syn-comment">
                note: code block if condition is true
              </span>
              <br />
              <span className="syn-keyword">end if</span>
            </code>
          </pre>

          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable my_age equal to 20\
\
if my_age is greater than or equal to 18 then\
    display "You can vote!"\
end if`}
          />

          <h3>
            The <code>otherwise</code> Statement (Else)
          </h3>
          <pre>
            <code>
              <span className="syn-keyword">if</span> <em>condition</em>{" "}
              <span className="syn-keyword">then</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="syn-comment">note: truthy run</span>
              <br />
              <span className="syn-keyword">otherwise</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="syn-comment">note: false run</span>
              <br />
              <span className="syn-keyword">end if</span>
            </code>
          </pre>
          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable score equal to 50\
\
if score is greater than 80 then\
    display "Great job!"\
otherwise\
    display "Try again!"\
end if`}
          />
        </section>
        <hr />
        <section id="whileloop">
          <h2 className="section-title">Natural++ While Loop</h2>
          <p>
            The <code className="syn-keyword">while</code> loop loops through a
            block of code as long as a specified condition is true:
          </p>

          <CodeBlock
            onTryIt={loadExample}
            code={`
create variable i equal to 0\
\
while i is less than 5 do\
    display i\
    set i to i plus 1\
end while`}
          />
        </section>
        <hr />
        <section id="repeatloop">
          <h2 className="section-title">Natural++ Repeat Loop</h2>
          <p>
            When you know exactly how many times you want to loop through a
            block of code.
          </p>

          <CodeBlock
            onTryIt={loadExample}
            code={`
repeat 3 times\
    display "Hello"\
end repeat`}
          />
        </section>
        <hr />
        <section id="functions">
          <h2 className="section-title">Functions & Recursion</h2>
          <p>
            Functions are the building blocks of reusable logic. In Natural++,
            you can safely abstract code implementation details through simple
            English clauses!
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`define function say_hello as\n    display "Hello World!"\nend function\n\ncall function say_hello`}
          />
          <h3>Recursion Example</h3>
          <p>
            Functions can call themselves repeatedly to solve iterative
            problems.
          </p>
          <CodeBlock
            onTryIt={loadExample}
            code={`create variable counter equal to 0\ndefine function recurse as\n    if counter is less than 5 then\n        display counter\n        set counter to counter plus 1\n        call function recurse\n    end if\nend function\n\ncall function recurse`}
          />
        </section>
        <hr />
        <section id="pointers">
          <h2 className="section-title">Pointers & References (C++ Backend)</h2>
          <p>
            While traditional C++ requires raw memory manipulation using{" "}
            <code>*</code> and <code>&amp;</code>, Natural++ handles memory
            tracing automatically under the hood via the AST Virtual Machine and
            GC routines. Memory addresses are automatically dereferenced for
            you.
          </p>
          <div
            className="callout"
            style={{ backgroundColor: "rgba(255,165,0,0.1)" }}
          >
            <p>
              <strong>Note:</strong> Advanced memory references are planned for
              future versions to allow exact C++ parity via syntax like{" "}
              <code>reference of [var]</code>.
            </p>
          </div>
        </section>
        <hr />
        <section id="structures">
          <h2 className="section-title">Structures & Unions</h2>
          <p>
            In C++, Structures (<code>struct</code>) and Unions are used to
            group different data types. In Natural++, <strong>Objects</strong>{" "}
            fulfill the exact same requirement dynamically.
          </p>
          <p>
            Refer to the <strong>Object-Oriented (OOP)</strong> section to see
            how to group dissimilar data items together natively!
          </p>
        </section>
        <hr />
        <section id="stl">
          <h2 className="section-title">Standard Template Library (STL)</h2>
          <p>
            Natural++ simplifies the massive STL library of C++. Instead of
            including <code>&lt;vector&gt;</code>, <code>&lt;map&gt;</code>, or{" "}
            <code>&lt;set&gt;</code>, we've generalized all iterators into our{" "}
            <code>list</code> and <code>object</code> types.
          </p>
          <ul>
            <li>
              <strong>std::vector</strong> =&gt; <code>create list array</code>
            </li>
            <li>
              <strong>std::map</strong> =&gt; <code>create object dict</code>
            </li>
          </ul>
        </section>
        <hr />
        <section id="exceptions">
          <h2 className="section-title">Exception Handling</h2>
          <p>
            Natural++ parses runtime conditions safely. If you attempt an
            invalid operation, the VM halts securely. Native{" "}
            <code>try...catch</code> English descriptors are on the roadmap for
            v2!
          </p>
        </section>
        <hr />
        <section id="fileio">
          <h2 className="section-title">File Handling Streams</h2>
          <p>
            C++ utilizes <code>fstream</code> for system I/O. Natural++ will
            wrap this in simple command verbs soon: e.g.,{" "}
            <code>read from file "data.txt"</code>.
          </p>
        </section>
        <hr />
        <section id="modern">
          <h2 className="section-title">Modern C++ (11/14/17/20)</h2>
          <p>
            Features like <strong>Lambda Expressions</strong>,{" "}
            <strong>auto typing</strong>, and <strong>Move Semantics</strong>{" "}
            are implicitly guaranteed because Natural++ uses an untyped parsing
            evaluation tree, effectively treating every initialized variable
            implicitly as <code>std::any</code> or <code>auto</code> natively in
            the compiler wrapper!
          </p>
        </section>
        <hr />
        <section id="concurrency">
          <h2 className="section-title">Concurrency & Multithreading</h2>
          <p>
            Parallel processing via <code>std::thread</code> will be exposed to
            the AST in future releases via the <code>run synchronously</code>{" "}
            and <code>run asynchronously</code> descriptors.
          </p>
        </section>
        <hr />
        <section id="metaprogramming">
          <h2 className="section-title">Metaprogramming & Smart Pointers</h2>
          <p>
            Behind the scenes, the Natural++ standard library uses{" "}
            <code>shared_ptr</code> to manage <code>Environment</code> scopes
            and memory cleanup to avoid leaks seamlessly. You never have to
            manually call <code>delete</code> or write template constraints in
            Natural++!
          </p>
        </section>
        <div style={{ paddingBottom: "100px" }}></div>{" "}
      </div>

      <div className="docs-ide-pane">
        <div
          className="pane-header terminal-header"
          style={{ padding: "12px 16px", backgroundColor: "#333" }}
        >
          <h3
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#4CAF50" }}>⚡</span> Code Runner
          </h3>
          <button
            className="btn primary-btn"
            onClick={runCode}
            disabled={running}
            style={{ padding: "4px 12px", fontSize: "13px" }}
          >
            {running ? "Running..." : "Run"}
          </button>
        </div>

        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: "1.5",
              overflow: "auto",
              borderBottom: "2px solid #333",
            }}
          >
            <CodeMirror
              value={ideCode}
              height="100%"
              theme={dracula}
              extensions={[naturalLanguage]}
              onChange={(val) => setIdeCode(val)}
              className="codemirror-wrapper"
              style={{ fontSize: "13px" }}
            />
          </div>

          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1a1a1a",
            }}
          >
            <div
              className="pane-header terminal-header"
              style={{ padding: "6px 12px" }}
            >
              <h3>Output</h3>
              <button
                className="icon-btn"
                onClick={clearTerminal}
                title="Clear Output"
              >
                🗑️
              </button>
            </div>
            <div
              className="terminal-output"
              style={{ fontSize: "12px", padding: "12px" }}
            >
              {terminalOutput.map((out, idx) => (
                <div
                  key={idx}
                  className={
                    out.startup
                      ? "startup-msg"
                      : out.isError
                        ? "output-line output-error"
                        : "output-line"
                  }
                >
                  {out.text}
                </div>
              ))}
              <div ref={endOfTerminalRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
