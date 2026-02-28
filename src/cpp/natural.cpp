#include <cctype>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

// --- LEXER ---
enum TokenType {
  IDENTIFIER,
  NUMBER,
  STRING_LIT,
  CREATE,
  VARIABLE,
  CONSTANT,
  EQUAL,
  TO,
  SET,
  DISPLAY,
  SHOW,
  IF,
  THEN,
  OTHERWISE,
  END,
  WHILE,
  DO,
  REPEAT,
  TIMES,
  PLUS,
  MINUS,
  TIMES_OP,
  DIVIDED_BY,
  MODULO,
  IS,
  LESS,
  GREATER,
  THAN,
  OR,
  AND,
  NOT,
  LPAREN,
  RPAREN,
  EOF_TOK
};

struct Token {
  TokenType type;
  string lexeme;
};

class Lexer {
  string source;
  size_t current = 0;

  bool isAtEnd() const { return current >= source.length(); }
  char advance() { return source[current++]; }
  char peek() const { return isAtEnd() ? '\0' : source[current]; }

public:
  Lexer(string src) : source(src) {}

  vector<Token> tokenize() {
    vector<Token> tokens;
    while (!isAtEnd()) {
      char c = advance();
      if (isspace(c))
        continue;

      // Check for note: (comments)
      if (c == 'n' && source.substr(current - 1, 5) == "note:") {
        current += 4;
        while (!isAtEnd() && peek() != '\n')
          advance();
        continue;
      }

      if (isalpha(c)) {
        size_t start = current - 1;
        while (!isAtEnd() && (isalnum(peek()) || peek() == '_'))
          advance();
        string text = source.substr(start, current - start);

        TokenType type = IDENTIFIER;
        if (text == "create")
          type = CREATE;
        else if (text == "variable")
          type = VARIABLE;
        else if (text == "constant")
          type = CONSTANT;
        else if (text == "equal")
          type = EQUAL;
        else if (text == "to")
          type = TO;
        else if (text == "set")
          type = SET;
        else if (text == "display" || text == "show")
          type = DISPLAY;
        else if (text == "if")
          type = IF;
        else if (text == "then")
          type = THEN;
        else if (text == "otherwise")
          type = OTHERWISE;
        else if (text == "end")
          type = END;
        else if (text == "while")
          type = WHILE;
        else if (text == "do")
          type = DO;
        else if (text == "repeat")
          type = REPEAT;
        else if (text == "times")
          type = TIMES;
        else if (text == "plus")
          type = PLUS;
        else if (text == "minus")
          type = MINUS;
        else if (text == "times" && tokens.size() > 0 &&
                 tokens.back().type != REPEAT && tokens.back().type != NUMBER)
          type = TIMES_OP; // heuristic for times vs multiplication
        else if (text == "divided")
          type = DIVIDED_BY;
        else if (text == "modulo")
          type = MODULO;
        else if (text == "is")
          type = IS;
        else if (text == "less")
          type = LESS;
        else if (text == "greater")
          type = GREATER;
        else if (text == "than")
          type = THAN;
        else if (text == "or")
          type = OR;
        else if (text == "and")
          type = AND;
        else if (text == "not")
          type = NOT;

        // Hacky fix for "times" being used as both loop and multiply
        if (text == "times" && tokens.size() > 0 &&
            (tokens.back().type == NUMBER ||
             tokens.back().type == IDENTIFIER)) {
          // Check context if it's multiply
          // "5 times 2" vs "repeat 5 times"
          if (tokens.size() >= 2 && tokens[tokens.size() - 2].type == REPEAT)
            type = TIMES;
          else
            type = TIMES_OP;
        }

        tokens.push_back({type, text});
      } else if (isdigit(c)) {
        size_t start = current - 1;
        while (!isAtEnd() && (isdigit(peek()) || peek() == '.'))
          advance();
        tokens.push_back({NUMBER, source.substr(start, current - start)});
      } else if (c == '"') {
        size_t start = current;
        while (!isAtEnd() && peek() != '"')
          advance();
        tokens.push_back({STRING_LIT, source.substr(start, current - start)});
        advance(); // closing quote
      } else if (c == '(') {
        tokens.push_back({LPAREN, "("});
      } else if (c == ')') {
        tokens.push_back({RPAREN, ")"});
      }
    }
    tokens.push_back({EOF_TOK, ""});
    return tokens;
  }
};

// --- AST & INTERPRETER ---

struct Value {
  bool isString;
  double num;
  string str;
  Value() : isString(false), num(0) {}
  Value(double n) : isString(false), num(n) {}
  Value(string s) : isString(true), str(s) {}

  void print() {
    if (isString)
      cout << str << endl;
    else
      cout << num << endl;
  }

  bool isTruthy() {
    if (isString)
      return str.length() > 0;
    return num != 0;
  }
};

class Environment {
  unordered_map<string, Value> values;

public:
  void define(string name, Value val) { values[name] = val; }
  void assign(string name, Value val) {
    if (values.find(name) != values.end())
      values[name] = val;
    else
      cerr << "Error: variable " << name << " not defined." << endl;
  }
  Value get(string name) {
    if (values.find(name) != values.end())
      return values[name];
    cerr << "Error: variable " << name << " not defined." << endl;
    return Value(0);
  }
};

class Expr {
public:
  virtual Value evaluate(Environment &env) = 0;
};

class LiteralExpr : public Expr {
  Value val;

public:
  LiteralExpr(Value v) : val(v) {}
  Value evaluate(Environment &env) override { return val; }
};

class VariableExpr : public Expr {
  string name;

public:
  VariableExpr(string n) : name(n) {}
  Value evaluate(Environment &env) override { return env.get(name); }
};

class BinaryExpr : public Expr {
  shared_ptr<Expr> left;
  TokenType op;
  shared_ptr<Expr> right;

public:
  BinaryExpr(shared_ptr<Expr> l, TokenType o, shared_ptr<Expr> r)
      : left(l), op(o), right(r) {}
  Value evaluate(Environment &env) override {
    Value l = left->evaluate(env);
    Value r = right->evaluate(env);

    if (op == PLUS) {
      if (l.isString || r.isString) {
        string ls = l.isString ? l.str : to_string(l.num);
        string rs = r.isString ? r.str : to_string(r.num);
        // Remove trailing zeros for numbers
        if (!l.isString)
          ls.erase(ls.find_last_not_of('0') + 1, std::string::npos);
        if (!l.isString && ls.back() == '.')
          ls.pop_back();
        if (!r.isString)
          rs.erase(rs.find_last_not_of('0') + 1, std::string::npos);
        if (!r.isString && rs.back() == '.')
          rs.pop_back();
        return Value(ls + rs);
      }
      return Value(l.num + r.num);
    }
    if (op == MINUS)
      return Value(l.num - r.num);
    if (op == TIMES_OP)
      return Value(l.num * r.num);
    if (op == EQUAL)
      return Value(l.num == r.num ? 1 : 0);
    if (op == LESS)
      return Value(l.num < r.num ? 1 : 0);

    return Value(0);
  }
};

class Stmt {
public:
  virtual void execute(Environment &env) = 0;
};

class PrintStmt : public Stmt {
  shared_ptr<Expr> expr;

public:
  PrintStmt(shared_ptr<Expr> e) : expr(e) {}
  void execute(Environment &env) override { expr->evaluate(env).print(); }
};

class VarDeclStmt : public Stmt {
  string name;
  shared_ptr<Expr> initializer;

public:
  VarDeclStmt(string n, shared_ptr<Expr> init) : name(n), initializer(init) {}
  void execute(Environment &env) override {
    env.define(name, initializer->evaluate(env));
  }
};

class AssignStmt : public Stmt {
  string name;
  shared_ptr<Expr> value;

public:
  AssignStmt(string n, shared_ptr<Expr> v) : name(n), value(v) {}
  void execute(Environment &env) override {
    env.assign(name, value->evaluate(env));
  }
};

class IfStmt : public Stmt {
  shared_ptr<Expr> condition;
  vector<shared_ptr<Stmt>> thenBranch;
  vector<shared_ptr<Stmt>> elseBranch;

public:
  IfStmt(shared_ptr<Expr> cond, vector<shared_ptr<Stmt>> tb,
         vector<shared_ptr<Stmt>> eb)
      : condition(cond), thenBranch(tb), elseBranch(eb) {}

  void execute(Environment &env) override {
    if (condition->evaluate(env).isTruthy()) {
      for (auto &stmt : thenBranch)
        stmt->execute(env);
    } else {
      for (auto &stmt : elseBranch)
        stmt->execute(env);
    }
  }
};

class WhileStmt : public Stmt {
  shared_ptr<Expr> condition;
  vector<shared_ptr<Stmt>> body;

public:
  WhileStmt(shared_ptr<Expr> cond, vector<shared_ptr<Stmt>> b)
      : condition(cond), body(b) {}
  void execute(Environment &env) override {
    while (condition->evaluate(env).isTruthy()) {
      for (auto &stmt : body)
        stmt->execute(env);
    }
  }
};

class Parser {
  vector<Token> tokens;
  int current = 0;

  Token peek() { return tokens[current]; }
  Token previous() { return tokens[current - 1]; }
  bool isAtEnd() { return peek().type == EOF_TOK; }
  Token advance() {
    if (!isAtEnd())
      current++;
    return previous();
  }
  bool match(TokenType t) {
    if (peek().type == t) {
      advance();
      return true;
    }
    return false;
  }
  void consume(TokenType t, string err) {
    if (peek().type == t)
      advance();
    else
      cerr << err << " found " << peek().lexeme << endl;
  }

  shared_ptr<Expr> expression() { return comparison(); }

  shared_ptr<Expr> comparison() {
    shared_ptr<Expr> expr = term();
    while (match(IS)) {
      TokenType op = EQUAL;
      if (match(EQUAL)) {
        consume(TO, "Expected 'to'");
        op = EQUAL;
      } else if (match(LESS)) {
        consume(THAN, "Expected 'than'");
        if (match(OR)) {
          consume(EQUAL, "expected equal");
          consume(TO, "to");
        }
        op = LESS;
      }
      shared_ptr<Expr> right = term();
      expr = make_shared<BinaryExpr>(expr, op, right);
    }
    return expr;
  }

  shared_ptr<Expr> term() {
    shared_ptr<Expr> expr = factor();
    while (match(PLUS) || match(MINUS)) {
      TokenType op = previous().type;
      shared_ptr<Expr> right = factor();
      expr = make_shared<BinaryExpr>(expr, op, right);
    }
    return expr;
  }

  shared_ptr<Expr> factor() {
    shared_ptr<Expr> expr = primary();
    while (match(TIMES_OP) || match(DIVIDED_BY)) {
      TokenType op = previous().type;
      if (op == DIVIDED_BY)
        consume(BY, "Expected 'by'"); // hacky
      shared_ptr<Expr> right = primary();
      expr = make_shared<BinaryExpr>(expr, op, right);
    }
    return expr;
  }

  shared_ptr<Expr> primary() {
    if (match(NUMBER))
      return make_shared<LiteralExpr>(Value(stod(previous().lexeme)));
    if (match(STRING_LIT))
      return make_shared<LiteralExpr>(Value(previous().lexeme));
    if (match(IDENTIFIER))
      return make_shared<VariableExpr>(previous().lexeme);
    if (match(LPAREN)) {
      auto expr = expression();
      consume(RPAREN, "Expected ')'");
      return expr;
    }
    cerr << "Expected expression" << endl;
    return make_shared<LiteralExpr>(Value(0));
  }

public:
  Parser(vector<Token> t) : tokens(t) {}

  vector<shared_ptr<Stmt>> parse() {
    vector<shared_ptr<Stmt>> statements;
    while (!isAtEnd())
      statements.push_back(statement());
    return statements;
  }

  shared_ptr<Stmt> statement() {
    if (match(CREATE)) {
      match(VARIABLE);
      match(CONSTANT);
      string name = advance().lexeme;
      consume(EQUAL, "Expected 'equal'");
      consume(TO, "Expected 'to'");
      auto init = expression();
      return make_shared<VarDeclStmt>(name, init);
    }
    if (match(SET)) {
      string name = advance().lexeme;
      consume(TO, "Expected 'to'");
      auto val = expression();
      return make_shared<AssignStmt>(name, val);
    }
    if (match(DISPLAY) || match(SHOW)) {
      return make_shared<PrintStmt>(expression());
    }
    if (match(WHILE)) {
      auto condition = expression();
      consume(DO, "Expected 'do'");
      vector<shared_ptr<Stmt>> body;
      while (!isAtEnd() && peek().type != END) {
        body.push_back(statement());
      }
      consume(END, "Expected 'end'");
      consume(WHILE, "Expected 'while'");
      return make_shared<WhileStmt>(condition, body);
    }
    if (match(IF)) {
      auto condition = expression();
      consume(THEN, "Expected 'then'");
      vector<shared_ptr<Stmt>> thenBranch;
      vector<shared_ptr<Stmt>> elseBranch;
      while (!isAtEnd() && peek().type != OTHERWISE && peek().type != END) {
        thenBranch.push_back(statement());
      }
      if (match(OTHERWISE)) {
        if (match(IF)) {
          // otherwise if -> not fully mapped in this mini parser
        } else {
          while (!isAtEnd() && peek().type != END) {
            elseBranch.push_back(statement());
          }
        }
      }
      consume(END, "Expected 'end'");
      consume(IF, "Expected 'if'");
      return make_shared<IfStmt>(condition, thenBranch, elseBranch);
    }

    // Skip unhandled tokens
    advance();
    return make_shared<PrintStmt>(make_shared<LiteralExpr>(Value("")));
  }
};

int main(int argc, char *argv[]) {
  if (argc < 2)
    return 1;
  ifstream file(argv[1]);
  stringstream buffer;
  buffer << file.rdbuf();
  string source = buffer.str();

  Lexer lexer(source);
  vector<Token> tokens = lexer.tokenize();

  Parser parser(tokens);
  vector<shared_ptr<Stmt>> statements = parser.parse();

  Environment env;
  for (auto stmt : statements)
    if (stmt)
      stmt->execute(env);

  return 0;
}
