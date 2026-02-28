import React, { useState, useRef, useEffect } from "react";
import { Play, Trash2, BookOpen, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { StreamLanguage } from "@codemirror/language";

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
        /(?:create|variable|constant|set|to|if|then|otherwise|while|do|repeat|times|end|function|call|with|parameter|parameters|as|display|show|add|return)\b/,
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

export default function IDE() {
  const [code, setCode] = useState(`note: Welcome to Natural++ Online!
note: Try the code below and hit Run!

create variable count equal to 1

display "Counting to 5 natively:"

while count is less than or equal to 5 do
    if count is equal to 3 then
        display "We hit three!"
    otherwise 
        display count
    end if
    
    set count to count plus 1
end while

display "---"
display "Natural++ executes in pure C++"
`);
  const [running, setRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    {
      text: "System initialized. Ready to execute Natural++ code.",
      isError: false,
      startup: true,
    },
  ]);
  const endOfTerminalRef = useRef(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  const clearTerminal = () => setTerminalOutput([]);

  const runCode = async () => {
    setRunning(true);
    const newOutput = [
      ...terminalOutput,
      { text: "> Running build...", isError: false },
    ];
    setTerminalOutput(newOutput);

    try {
      const response = await fetch("http://localhost:3000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
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
            text: "> Program finished with exit status 0.\n",
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

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <Leaf className="logo-icon text-green" size={24} color="#4CAF50" />
          <h1>
            Natural++ <span className="badge">v1.0.0</span>
          </h1>
        </div>
        <div className="header-actions">
          <Link
            to="/docs"
            className="btn secondary-btn"
            style={{
              textDecoration: "none",
              marginRight: "12px",
              background: "#444",
              color: "white",
            }}
          >
            <span className="icon">
              <BookOpen size={16} />
            </span>{" "}
            Read Docs
          </Link>
          <button
            id="run-btn"
            className="btn primary-btn"
            onClick={runCode}
            disabled={running}
          >
            <span className="icon">{running ? "⏳" : <Play size={16} />}</span>
            {running ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Main IDE Layout */}
      <div className="ide-container">
        {/* Left Side: Editor */}
        <div className="editor-pane">
          <div className="pane-header">
            <h3>main.npp</h3>
          </div>
          <CodeMirror
            value={code}
            height="100%"
            theme={dracula}
            extensions={[naturalLanguage]}
            onChange={(val) => setCode(val)}
            className="codemirror-wrapper"
          />
        </div>

        {/* Right Side: Terminal Output */}
        <div className="terminal-pane">
          <div className="pane-header terminal-header">
            <h3>Terminal</h3>
            <button
              id="clear-btn"
              className="icon-btn"
              title="Clear terminal"
              onClick={clearTerminal}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div id="terminal-output" className="terminal-output">
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
  );
}
