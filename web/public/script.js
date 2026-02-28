// Initialize CodeMirror editor
document.addEventListener("DOMContentLoaded", () => {
    // Basic syntax highlighting mode for Natural++
    CodeMirror.defineSimpleMode("natural", {
        start: [
            { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
            { regex: /(?:plus|minus|times|divided by|modulo|is equal to|is greater than|is less than|and|or)\b/, token: "operator" },
            { regex: /(?:create|variable|constant|set|to|if|then|otherwise|while|do|repeat|times|end|function|call|with|parameter|parameters|as|display|show|add|return)\b/, token: "keyword" },
            { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number" },
            { regex: /note:.*/, token: "comment" },
            { regex: /[a-zA-Z_]\w*/, token: "variable" }
        ]
    });

    const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
        mode: "natural",
        theme: "dracula",
        lineNumbers: true,
        indentUnit: 4,
        viewportMargin: Infinity
    });

    // Elements
    const runBtn = document.getElementById("run-btn");
    const clearBtn = document.getElementById("clear-btn");
    const terminalOutput = document.getElementById("terminal-output");

    const appendToTerminal = (text, isError = false) => {
        if (!text) return;
        const line = document.createElement("div");
        line.className = isError ? "output-line output-error" : "output-line";
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    clearBtn.addEventListener("click", () => {
        terminalOutput.innerHTML = "";
    });

    runBtn.addEventListener("click", async () => {
        const code = editor.getValue();

        runBtn.innerHTML = '<span class="icon">⏳</span> Running...';
        runBtn.disabled = true;

        try {
            appendToTerminal(`> Running build...`);

            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const result = await response.json();

            if (result.error && !result.output) {
                appendToTerminal(result.error, true);
            } else {
                if (result.output) appendToTerminal(result.output);
                if (result.error) appendToTerminal(result.error, true);
                appendToTerminal(`> Program finished with exit status 0.\n`);
            }
        } catch (error) {
            appendToTerminal(`Execution failed: ${error.message}`, true);
        } finally {
            runBtn.innerHTML = '<span class="icon">▶</span> Run Code';
            runBtn.disabled = false;
        }
    });
});
