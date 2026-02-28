const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to the compiler binary
// We will look in the parent bin/ directory for standard local development,
// and in a local bin/ folder if deployed remotely (like Render/Docker)
const compilerPathLocal = path.resolve(__dirname, '../bin/natural');
const compilerPathDeploy = path.resolve(__dirname, './bin/natural');

const getCompilerPath = () => {
    if (fs.existsSync(compilerPathLocal)) return compilerPathLocal;
    if (fs.existsSync(compilerPathDeploy)) return compilerPathDeploy;

    // Attempt fallback or native command
    return 'natural';
};

app.post('/api/run', (req, res) => {
    const code = req.body.code;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: "No code provided" });
    }

    const tmpFile = path.join(os.tmpdir(), `natural_${Date.now()}.npp`);

    fs.writeFileSync(tmpFile, code, 'utf-8');

    const cmd = `${getCompilerPath()} "${tmpFile}"`;

    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
        // Clean up file
        try { fs.unlinkSync(tmpFile); } catch (e) { }

        if (error) {
            // Execution failed or returned an error
            res.json({ output: stdout || '', error: stderr || error.message });
        } else {
            res.json({ output: stdout, error: stderr });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Natural++ Online Compiler running on http://localhost:${PORT}`);
});
