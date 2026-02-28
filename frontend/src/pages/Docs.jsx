import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let current = "home";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute("id");
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="docs-page">
      <div className="sidebar">
        <h2>Natural++ Tutorial</h2>
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
          href="#output"
          className={activeSection === "output" ? "active" : ""}
        >
          Natural++ Output
        </a>
        <a
          href="#comments"
          className={activeSection === "comments" ? "active" : ""}
        >
          Natural++ Comments
        </a>
        <a
          href="#variables"
          className={activeSection === "variables" ? "active" : ""}
        >
          Natural++ Variables
        </a>
        <a
          href="#datatypes"
          className={activeSection === "datatypes" ? "active" : ""}
        >
          Natural++ Data Types
        </a>
        <a
          href="#operators"
          className={activeSection === "operators" ? "active" : ""}
        >
          Natural++ Operators
        </a>
        <a
          href="#booleans"
          className={activeSection === "booleans" ? "active" : ""}
        >
          Natural++ Booleans
        </a>
        <a
          href="#conditions"
          className={activeSection === "conditions" ? "active" : ""}
        >
          Natural++ Conditions
        </a>
        <a
          href="#whileloop"
          className={activeSection === "whileloop" ? "active" : ""}
        >
          Natural++ While Loop
        </a>
        <a
          href="#repeatloop"
          className={activeSection === "repeatloop" ? "active" : ""}
        >
          Natural++ Repeat Loop
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
          <Link to="/" className="nav-btn">
            ← Back to IDE
          </Link>
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
          <div className="example-box">
            <h4>Example in Natural++</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> count{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">1</span>
                <span className="syn-keyword">while</span> count{" "}
                <span className="syn-operator">is less than or equal to</span>{" "}
                <span className="syn-number">5</span>{" "}
                <span className="syn-keyword">do</span>
                <span className="syn-function">display</span> count
                <span className="syn-keyword">set</span> count{" "}
                <span className="syn-keyword">to</span> count{" "}
                <span className="syn-operator">plus</span>{" "}
                <span className="syn-number">1</span>
                <span className="syn-keyword">end while</span>
              </code>
            </pre>
            <Link to="/" className="try-it-btn">
              Try it Yourself »
            </Link>
          </div>
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
            time.
          </p>
        </section>

        <hr />

        <section id="syntax">
          <h2 className="section-title">Natural++ Syntax</h2>
          <p>
            A Natural++ script is executed line by line. Every line represents
            an instruction.
          </p>
          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"Hello World!"</span>
              </code>
            </pre>
          </div>
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
          <div className="example-box">
            <h4>Example (Outputting Text)</h4>
            <pre>
              <code>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"I am learning Natural++"</span>
                <span className="syn-function">show</span>{" "}
                <span className="syn-string">"It is very easy to read!"</span>
              </code>
            </pre>
          </div>
          <p>You can also display math or numbers directly without quotes.</p>
          <pre>
            <code>
              <span className="syn-function">display</span>{" "}
              <span className="syn-number">300</span>
            </code>
          </pre>
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
          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-comment">note: This is a comment</span>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"Hello World!"</span>
              </code>
            </pre>
          </div>
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

          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> name{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-string">"John Doe"</span>
                <span className="syn-keyword">create variable</span> age{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">35</span>
                <span className="syn-function">display</span> name
                <span className="syn-function">display</span> age
              </code>
            </pre>
          </div>

          <h3>Assigning / Updating Variables</h3>
          <p>
            If a variable already exists, you change its value using{" "}
            <code className="syn-keyword">set</code> and{" "}
            <code className="syn-keyword">to</code>.
          </p>
          <pre>
            <code>
              <span className="syn-keyword">create variable</span> x{" "}
              <span className="syn-keyword">equal to</span>{" "}
              <span className="syn-number">10</span>
              <span className="syn-keyword">set</span> x{" "}
              <span className="syn-keyword">to</span>{" "}
              <span className="syn-number">20</span>{" "}
              <span className="syn-comment">note: x is now 20</span>
            </code>
          </pre>
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

          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> sum{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">100</span>{" "}
                <span className="syn-operator">plus</span>{" "}
                <span className="syn-number">50</span>
                <span className="syn-function">display</span> sum
              </code>
            </pre>
          </div>

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
          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> x{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">10</span>
                <span className="syn-keyword">create variable</span> y{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">9</span>
                <span className="syn-comment">
                  note: This will evaluate internally to true
                </span>
                <span className="syn-keyword">if</span> x{" "}
                <span className="syn-operator">is greater than</span> y{" "}
                <span className="syn-keyword">then</span>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"Math works!"</span>
                <span className="syn-keyword">end if</span>
              </code>
            </pre>
          </div>
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
              <span className="syn-comment">
                note: code block if condition is true
              </span>
              <span className="syn-keyword">end if</span>
            </code>
          </pre>

          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> my_age{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">20</span>
                <span className="syn-keyword">if</span> my_age{" "}
                <span className="syn-operator">
                  is greater than or equal to
                </span>{" "}
                <span className="syn-number">18</span>{" "}
                <span className="syn-keyword">then</span>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"You can vote!"</span>
                <span className="syn-keyword">end if</span>
              </code>
            </pre>
          </div>

          <h3>
            The <code>otherwise</code> Statement (Else)
          </h3>
          <pre>
            <code>
              <span className="syn-keyword">if</span> <em>condition</em>{" "}
              <span className="syn-keyword">then</span>
              <span className="syn-comment">note: truthy run</span>
              <span className="syn-keyword">otherwise</span>
              <span className="syn-comment">note: false run</span>
              <span className="syn-keyword">end if</span>
            </code>
          </pre>
        </section>

        <hr />

        <section id="whileloop">
          <h2 className="section-title">Natural++ While Loop</h2>
          <p>
            The <code className="syn-keyword">while</code> loop loops through a
            block of code as long as a specified condition is true:
          </p>
          <pre>
            <code>
              <span className="syn-keyword">while</span> <em>condition</em>{" "}
              <span className="syn-keyword">do</span>
              <span className="syn-comment">
                note: code block to be executed
              </span>
              <span className="syn-keyword">end while</span>
            </code>
          </pre>

          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">create variable</span> i{" "}
                <span className="syn-keyword">equal to</span>{" "}
                <span className="syn-number">0</span>
                <span className="syn-keyword">while</span> i{" "}
                <span className="syn-operator">is less than</span>{" "}
                <span className="syn-number">5</span>{" "}
                <span className="syn-keyword">do</span>
                <span className="syn-function">display</span> i
                <span className="syn-keyword">set</span> i{" "}
                <span className="syn-keyword">to</span> i{" "}
                <span className="syn-operator">plus</span>{" "}
                <span className="syn-number">1</span>
                <span className="syn-keyword">end while</span>
              </code>
            </pre>
          </div>
        </section>

        <hr />

        <section id="repeatloop">
          <h2 className="section-title">Natural++ Repeat Loop</h2>
          <p>
            When you know exactly how many times you want to loop through a
            block of code.
          </p>

          <pre>
            <code>
              <span className="syn-keyword">repeat</span> <em>amount</em>{" "}
              <span className="syn-keyword">times</span>
              <span className="syn-comment">
                note: code block to be executed
              </span>
              <span className="syn-keyword">end repeat</span>
            </code>
          </pre>

          <div className="example-box">
            <h4>Example</h4>
            <pre>
              <code>
                <span className="syn-keyword">repeat</span>{" "}
                <span className="syn-number">3</span>{" "}
                <span className="syn-keyword">times</span>
                <span className="syn-function">display</span>{" "}
                <span className="syn-string">"Hello"</span>
                <span className="syn-keyword">end repeat</span>
              </code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
