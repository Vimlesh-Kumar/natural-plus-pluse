const fs = require('fs');

class NaturalPlusPlusTranspiler {
    constructor() {
        this.rules = [
            // Comments
            { regex: /note:\s*(.*)/g, replacement: '// $1' },

            // Variable Declarations
            { regex: /create variable\s+([a-zA-Z_]\w*)\s*equal to\s*(.*)/g, replacement: 'let $1 = $2;' },
            { regex: /create constant\s+([a-zA-Z_]\w*)\s*equal to\s*(.*)/g, replacement: 'const $1 = $2;' },
            { regex: /set\s+([a-zA-Z_]\w*)\s*to\s*(.*)/g, replacement: '$1 = $2;' },

            // Output
            { regex: /display\s+(.*)/g, replacement: 'console.log($1);' },
            { regex: /show\s+(.*)/g, replacement: 'console.log($1);' },

            // If / Else If / Else
            { regex: /otherwise if\s+(.*)\s+then/g, replacement: '} else if ($1) {' },
            { regex: /otherwise/g, replacement: '} else {' },
            { regex: /if\s+(.*)\s+then/g, replacement: 'if ($1) {' },
            { regex: /end if/g, replacement: '}' },

            // Loops
            { regex: /while\s+(.*)\s+do/g, replacement: 'while ($1) {' },
            { regex: /end while/g, replacement: '}' },
            { regex: /repeat\s+(\d+|[a-zA-Z_]\w*)\s+times/g, replacement: 'for (let _i = 0; _i < $1; _i++) {' },
            { regex: /end repeat/g, replacement: '}' },

            // Functions
            // E.g., define function greet with parameter name, age as
            // E.g., define function sayHello as
            { regex: /define function\s+([a-zA-Z_]\w*)\s+with parameters?\s+(.*)\s+as/g, replacement: 'function $1($2) {' },
            { regex: /define function\s+([a-zA-Z_]\w*)\s+as/g, replacement: 'function $1() {' },
            { regex: /return\s+(.*)/g, replacement: 'return $1;' },
            { regex: /end function/g, replacement: '}' },
            { regex: /call function\s+([a-zA-Z_]\w*)\s+with\s+(.*)/g, replacement: '$1($2);' },
            { regex: /call function\s+([a-zA-Z_]\w*)/g, replacement: '$1();' },

            // Operators (Need to run these on the remaining parts, but be careful not to replace text inside strings)
            // A more robust way to replace operators without breaking strings is complex, but for MVP we use basic string replace.
            { regex: /\s+is equal to\s+/g, replacement: ' === ' },
            { regex: /\s+is not equal to\s+/g, replacement: ' !== ' },
            { regex: /\s+is greater than or equal to\s+/g, replacement: ' >= ' },
            { regex: /\s+is less than or equal to\s+/g, replacement: ' <= ' },
            { regex: /\s+is greater than\s+/g, replacement: ' > ' },
            { regex: /\s+is less than\s+/g, replacement: ' < ' },

            { regex: /\s+plus\s+/g, replacement: ' + ' },
            { regex: /\s+minus\s+/g, replacement: ' - ' },
            { regex: /\s+times\s+/g, replacement: ' * ' },
            { regex: /\s+divided by\s+/g, replacement: ' / ' },
            { regex: /\s+modulo\s+/g, replacement: ' % ' },

            { regex: /\s+and\s+/g, replacement: ' && ' },
            { regex: /\s+or\s+/g, replacement: ' || ' },

            // Adding to Array
            { regex: /add\s+(.*)\s+to\s+([a-zA-Z_]\w*)/g, replacement: '$2.push($1);' },

            // Object access
            { regex: /property\s+([a-zA-Z_]\w*)\s+of\s+([a-zA-Z_]\w*)/g, replacement: '$2.$1' }
        ];
    }

    transpile(sourceCode) {
        let lines = sourceCode.split('\n');
        let transpiledLines = [];

        for (let line of lines) {
            let processedLine = line.trim();
            if (processedLine.length === 0) {
                transpiledLines.push('');
                continue;
            }

            for (let rule of this.rules) {
                processedLine = processedLine.replace(rule.regex, rule.replacement);
            }
            transpiledLines.push(processedLine);
        }

        return transpiledLines.join('\n');
    }

    compileFile(inputPath, outputPath) {
        let sourceCode = fs.readFileSync(inputPath, 'utf-8');
        let jsCode = this.transpile(sourceCode);
        fs.writeFileSync(outputPath, jsCode, 'utf-8');
    }
}

module.exports = NaturalPlusPlusTranspiler;
