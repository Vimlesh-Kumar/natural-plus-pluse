#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

// This is the beginning of the Self-Hosted Native execution engine for
// Natural++. It evaluates "English-like" statements native in C++ without
// relying on V8/NodeJS!

class NaturalEngine {
private:
  unordered_map<string, double> numberVariables;
  unordered_map<string, string> stringVariables;
  vector<string> programLines;
  int currentLine = 0;

  void trim(string &s) {
    s.erase(s.begin(), find_if(s.begin(), s.end(),
                               [](unsigned char ch) { return !isspace(ch); }));
    s.erase(find_if(s.rbegin(), s.rend(),
                    [](unsigned char ch) { return !isspace(ch); })
                .base(),
            s.end());
  }

  double parseExpression(string expr) {
    // Very basic evaluator for MVP.
    // Handles pure variable names or numbers.
    trim(expr);
    if (numberVariables.count(expr))
      return numberVariables[expr];

    // Simple plus parsing (e.g. "a plus 1" or "count plus 1")
    size_t plusPos = expr.find(" plus ");
    if (plusPos != string::npos) {
      string left = expr.substr(0, plusPos);
      string right = expr.substr(plusPos + 6);
      return parseExpression(left) + parseExpression(right);
    }

    size_t minusPos = expr.find(" minus ");
    if (minusPos != string::npos) {
      string left = expr.substr(0, minusPos);
      string right = expr.substr(minusPos + 7);
      return parseExpression(left) - parseExpression(right);
    }

    try {
      return stod(expr);
    } catch (...) {
      return 0; // fallback
    }
  }

  bool parseCondition(string cond) {
    // "count is less than 5"
    size_t pos;
    if ((pos = cond.find(" is less than or equal to ")) != string::npos) {
      return parseExpression(cond.substr(0, pos)) <=
             parseExpression(cond.substr(pos + 26));
    } else if ((pos = cond.find(" is less than ")) != string::npos) {
      return parseExpression(cond.substr(0, pos)) <
             parseExpression(cond.substr(pos + 14));
    } else if ((pos = cond.find(" is greater than or equal to ")) !=
               string::npos) {
      return parseExpression(cond.substr(0, pos)) >=
             parseExpression(cond.substr(pos + 29));
    } else if ((pos = cond.find(" is greater than ")) != string::npos) {
      return parseExpression(cond.substr(0, pos)) >
             parseExpression(cond.substr(pos + 17));
    } else if ((pos = cond.find(" is equal to ")) != string::npos) {
      return parseExpression(cond.substr(0, pos)) ==
             parseExpression(cond.substr(pos + 13));
    }
    return false;
  }

public:
  void loadProgram(const string &content) {
    stringstream ss(content);
    string line;
    while (getline(ss, line)) {
      trim(line);
      programLines.push_back(line);
    }
  }

  void execute() {
    while (currentLine < programLines.size()) {
      string line = programLines[currentLine];

      if (line.empty() || line.find("note:") == 0) {
        currentLine++;
        continue;
      }

      smatch match;

      // Stop interpreting if we hit a definition body
      if (regex_match(line, match, regex("define function(.*)"))) {
        while (currentLine < programLines.size() &&
               programLines[currentLine] != "end function")
          currentLine++;
        currentLine++;
        continue;
      }

      // Variable creation
      if (regex_match(line, match,
                      regex("create variable (\\w+) equal to (.*)"))) {
        string varName = match[1];
        string val = match[2];
        if (val.front() == '"' && val.back() == '"') {
          stringVariables[varName] = val.substr(1, val.length() - 2);
        } else {
          numberVariables[varName] = parseExpression(val);
        }
        currentLine++;
        continue;
      }

      // Variable assignment
      if (regex_match(line, match, regex("set (\\w+) to (.*)"))) {
        string varName = match[1];
        string val = match[2];
        numberVariables[varName] = parseExpression(val);
        currentLine++;
        continue;
      }

      // Display
      if (regex_match(line, match, regex("display (.*)"))) {
        string val = match[1];
        if (val.front() == '"' && val.back() == '"') {
          cout << val.substr(1, val.length() - 2) << endl;
        } else if (stringVariables.count(val)) {
          cout << stringVariables[val] << endl;
        } else {
          cout << parseExpression(val) << endl;
        }
        currentLine++;
        continue;
      }

      // Repeat loops
      if (regex_match(line, match, regex("repeat (\\d+) times"))) {
        int times = stoi(match[1]);
        int loopStartLine = currentLine;
        int innerCurrent = currentLine + 1;
        while (innerCurrent < programLines.size() &&
               programLines[innerCurrent] != "end repeat")
          innerCurrent++;
        int loopEndLine = innerCurrent;

        for (int i = 0; i < times; i++) {
          int saveCurrent = currentLine;
          currentLine = loopStartLine + 1;
          while (currentLine < loopEndLine) {
            executeSingleLine(programLines[currentLine]);
            currentLine++;
          }
          currentLine = saveCurrent;
        }
        currentLine = loopEndLine + 1;
        continue;
      }

      // While loops
      if (regex_match(line, match, regex("while (.*) do"))) {
        string condition = match[1];
        int loopStartLine = currentLine;

        int innerCurrent = currentLine + 1;
        while (innerCurrent < programLines.size() &&
               programLines[innerCurrent] != "end while")
          innerCurrent++;
        int loopEndLine = innerCurrent;

        while (parseCondition(condition)) {
          int saveCurrent = currentLine;
          currentLine = loopStartLine + 1;
          while (currentLine < loopEndLine) {
            executeSingleLine(programLines[currentLine]);
            currentLine++;
          }
          currentLine = saveCurrent;
        }
        currentLine = loopEndLine + 1;
        continue;
      }

      // If condition
      if (regex_match(line, match, regex("if (.*) then"))) {
        string condition = match[1];
        bool condResult = parseCondition(condition);

        int endLine = currentLine + 1;
        while (endLine < programLines.size() &&
               programLines[endLine] != "end if")
          endLine++;

        if (condResult) {
          currentLine++;
          while (currentLine < endLine &&
                 programLines[currentLine].find("otherwise") == string::npos) {
            executeSingleLine(programLines[currentLine]);
            currentLine++;
          }
        }
        currentLine = endLine + 1;
        continue;
      }

      executeSingleLine(line);
      currentLine++;
    }
  }

  void executeSingleLine(const string &line) {
    smatch match;
    if (regex_match(line, match, regex("set (\\w+) to (.*)"))) {
      string varName = match[1];
      string val = match[2];
      numberVariables[varName] = parseExpression(val);
    } else if (regex_match(line, match, regex("display (.*)"))) {
      string val = match[1];
      if (val.front() == '"' && val.back() == '"') {
        cout << val.substr(1, val.length() - 2) << endl;
      } else if (stringVariables.count(val)) {
        cout << stringVariables[val] << endl;
      } else {
        cout << parseExpression(val) << endl;
      }
    }
  }
};

int main(int argc, char *argv[]) {
  if (argc < 2) {
    cerr << "Usage: natural <file.npp>" << endl;
    return 1;
  }

  string filePath = argv[1];
  ifstream file(filePath);
  if (!file.is_open()) {
    cerr << "Error: Could not open file " << filePath << endl;
    return 1;
  }

  stringstream buffer;
  buffer << file.rdbuf();
  string content = buffer.str();

  NaturalEngine engine;
  engine.loadProgram(content);

  // cout << "[Natural++ Native VM] Running " << filePath << "..." << endl;
  engine.execute();

  return 0;
}
