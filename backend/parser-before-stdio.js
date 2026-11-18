
const KEYWORDS = [
  "int", "float", "double", "char", "void",
  "long", "if", "else", "while", "return"
];

const TYPES = ["int", "float", "double", "char", "void", "long"];

function tokenize(code) {
  const tokens = [];

  const pattern =
    /^\s+|^\/\/[^\n]*|^\/\*[\s\S]*?\*\/|^"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|^\d+(?:\.\d+)?|^[A-Za-z_]\w*|^==|^!=|^<=|^>=|^&&|^\|\||^[+\-*/%=<>!(){};,]/;

  let line = 1;

  while (code.length > 0) {
    const match = code.match(pattern);

    if (!match) {
      throw new Error(`Invalid character '${code[0]}' at line ${line}`);
    }

    const value = match[0];

    if (/^\s+$/.test(value) || value.startsWith("//") || value.startsWith("/*")) {
      line += (value.match(/\n/g) || []).length;
    } else {
      tokens.push({
        value,
        line,
        type: KEYWORDS.includes(value)
          ? "keyword"
          : /^[A-Za-z_]/.test(value)
          ? "identifier"
          : /^\d/.test(value)
          ? "number"
          : "symbol"
      });
    }

    code = code.slice(value.length);
  }

  return tokens;
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
    this.hasMain = false;
  }

  current() {
    return this.tokens[this.position];
  }

  check(value) {
    return this.current()?.value === value;
  }

  consume(value) {
    if (!this.check(value)) {
      const token = this.current();
      const line = token ? token.line : "end of file";

      throw new Error(
        `Expected '${value}' at line ${line}, found '${token?.value || "end of file"}'`
      );
    }

    return this.tokens[this.position++];
  }

  identifier() {
    if (this.current()?.type !== "identifier") {
      throw new Error(
        `Expected identifier at line ${this.current()?.line || "end of file"}`
      );
    }

    return this.tokens[this.position++];
  }

  parseProgram() {
    while (this.current()) {
      this.parseFunction();
    }

    if (!this.hasMain) {
      throw new Error("Missing required 'int main()' function.");
    }

    return true;
  }

  parseFunction() {
    const returnType = this.parseType();
    const name = this.identifier().value;

    if (name === "main") {
      if (returnType !== "int") {
        throw new Error("The main function must have return type int.");
      }

      if (this.hasMain) {
        throw new Error("Duplicate main() function.");
      }

      this.hasMain = true;
    }

    this.consume("(");

    if (this.check("void")) {
      this.consume("void");
    } else if (!this.check(")")) {
      this.parseParameter();

      while (this.check(",")) {
        this.consume(",");
        this.parseParameter();
      }
    }

    this.consume(")");
    this.parseBlock();
  }

  parseType() {
    if (!TYPES.includes(this.current()?.value)) {
      throw new Error(
        `Expected data type at line ${this.current()?.line || "end of file"}`
      );
    }

    return this.tokens[this.position++].value;
  }

  parseParameter() {
    this.parseType();
    this.identifier();
  }

  parseBlock() {
    this.consume("{");

    while (this.current() && !this.check("}")) {
      this.parseStatement();
    }

    this.consume("}");
  }

  parseStatement() {
    if (TYPES.includes(this.current()?.value)) {
      this.parseDeclaration();
      return;
    }

    if (this.check("{")) {
      this.parseBlock();
      return;
    }

    if (this.check("if")) {
      this.parseIf();
      return;
    }

    if (this.check("while")) {
      this.parseWhile();
      return;
    }

    if (this.check("return")) {
      this.consume("return");

      if (!this.check(";")) {
        this.parseExpression();
      }

      this.consume(";");
      return;
    }

    if (this.check(";")) {
      this.consume(";");
      return;
    }

    this.parseExpression();
    this.consume(";");
  }

  parseDeclaration() {
    this.parseType();
    this.identifier();

    if (this.check("=")) {
      this.consume("=");
      this.parseExpression();
    }

    while (this.check(",")) {
      this.consume(",");
      this.identifier();

      if (this.check("=")) {
        this.consume("=");
        this.parseExpression();
      }
    }

    this.consume(";");
  }

  parseIf() {
    this.consume("if");
    this.consume("(");
    this.parseExpression();
    this.consume(")");
    this.parseStatement();

    if (this.check("else")) {
      this.consume("else");
      this.parseStatement();
    }
  }

  parseWhile() {
    this.consume("while");
    this.consume("(");
    this.parseExpression();
    this.consume(")");
    this.parseStatement();
  }

  parseExpression() {
    this.parseBinary(0);

    if (this.check("=")) {
      this.consume("=");
      this.parseExpression();
    }
  }

  parseBinary(minPrecedence) {
    this.parseUnary();

    const precedence = {
      "||": 1,
      "&&": 2,
      "==": 3,
      "!=": 3,
      "<": 4,
      ">": 4,
      "<=": 4,
      ">=": 4,
      "+": 5,
      "-": 5,
      "*": 6,
      "/": 6,
      "%": 6
    };

    while (
      this.current() &&
      (precedence[this.current().value] || 0) > minPrecedence
    ) {
      const operator = this.current().value;
      this.position++;
      this.parseBinary(precedence[operator]);
    }
  }

  parseUnary() {
    if (["!", "-", "+"].includes(this.current()?.value)) {
      this.position++;
      this.parseUnary();
      return;
    }

    this.parsePrimary();
  }

  parsePrimary() {
    const token = this.current();

    if (!token) {
      throw new Error("Unexpected end of code");
    }

    if (token.value === "(") {
      this.consume("(");
      this.parseExpression();
      this.consume(")");
      return;
    }

    if (
      token.type === "number" ||
      token.value.startsWith('"') ||
      token.value.startsWith("'")
    ) {
      this.position++;
      return;
    }

    if (token.type === "identifier") {
      this.position++;

      if (this.check("(")) {
        this.consume("(");

        if (!this.check(")")) {
          this.parseExpression();

          while (this.check(",")) {
            this.consume(",");
            this.parseExpression();
          }
        }

        this.consume(")");
      }

      return;
    }

    throw new Error(
      `Unexpected token '${token.value}' at line ${token.line}`
    );
  }
}

function validateSyntax(code) {
  try {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);

    parser.parseProgram();

    return {
      success: true,
      message: "Syntax is valid!"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = { validateSyntax };
