
# Context-Free Grammar (CFG) – CodeCheck

## 1. Introduction

CodeCheck uses a Recursive Descent Parser to validate the syntax of a supported subset of the C programming language.

A Context-Free Grammar (CFG) defines the syntax rules used by the parser.

A CFG is represented as:

G = (V, T, P, S)

Where:

- V – Set of non-terminal symbols
- T – Set of terminal symbols
- P – Set of production rules
- S – Start symbol

## 2. Terminal Symbols

The grammar uses the following terminal symbols:

- Data types: int, float, double, char, void, long
- Keywords: if, else, while, for, return
- Identifiers and constants
- Operators: +, -, *, /, %, =, ==, !=, <, >, <=, >=, &&, ||, !
- Punctuation: (, ), {, }, ;, ,

## 3. Production Rules

```text
Program        -> FunctionList

FunctionList   -> Function FunctionList
                | Function

Function       -> Type Identifier ( Parameters ) Block

Parameters     -> ParameterList
                | void
                | epsilon

ParameterList  -> Parameter , ParameterList
                | Parameter

Parameter      -> Type Identifier

Type           -> int
                | float
                | double
                | char
                | void
                | long

Block          -> { StatementList }

StatementList  -> Statement StatementList
                | epsilon

Statement      -> Declaration
                | IfStatement
                | WhileStatement
                | ForStatement
                | ReturnStatement
                | Block
                | Expression ;
                | ;

Declaration    -> Type Identifier InitializerList ;

InitializerList -> = Expression InitializerTail
                 | epsilon

InitializerTail -> , Identifier InitializerList
                 | epsilon

IfStatement    -> if ( Expression ) Statement ElsePart

ElsePart       -> else Statement
                | epsilon

WhileStatement -> while ( Expression ) Statement

ForStatement   -> for ( ForInit ; ForCondition ; ForUpdate ) Statement

ForInit        -> DeclarationWithoutSemicolon
                | Expression
                | epsilon

ForCondition   -> Expression
                | epsilon

ForUpdate      -> Expression
                | epsilon

DeclarationWithoutSemicolon
               -> Type Identifier OptionalInitializer

OptionalInitializer
               -> = Expression
                | epsilon

ReturnStatement -> return Expression ;
                 | return ;

Expression     -> BinaryExpression
                | BinaryExpression = Expression

BinaryExpression -> UnaryExpression BinaryTail

BinaryTail     -> Operator UnaryExpression BinaryTail
                | epsilon

UnaryExpression -> UnaryOperator UnaryExpression
                 | PrimaryExpression

PrimaryExpression -> Identifier
                   | Number
                   | String
                   | Character
                   | ( Expression )
                   | FunctionCall

FunctionCall   -> Identifier ( Arguments )

Arguments      -> Expression ArgumentTail
                | epsilon

ArgumentTail   -> , Expression ArgumentTail
                | epsilon

UnaryOperator  -> !
                | -
                | +
                | &
                | ++
                | --

Operator       -> ||
                | &&
                | ==
                | !=
                | <
                | >
                | <=
                | >=
                | +
                | -
                | *
                | /
                | %

Identifier     -> Valid identifier
Number         -> Integer or decimal constant
String         -> String literal
Character      -> Character literal
```

## 4. Start Symbol

The start symbol of the grammar is Program.

## 5. Parser Implementation

The grammar is implemented using a Recursive Descent Parser in `backend/parser.js`.

The parser contains functions such as:

- parseProgram()
- parseFunction()
- parseDeclaration()
- parseStatement()
- parseIf()
- parseWhile()
- parseFor()
- parseExpression()
- parseUnary()
- parsePrimary()

Each parsing function checks a particular grammar rule.

## 6. Syntax Validation Process

1. The source code is received from the student.
2. Supported header directives are processed.
3. The tokenizer converts source code into tokens.
4. The parser checks tokens using grammar rules.
5. If all rules are satisfied, syntax is declared valid.
6. Otherwise, an appropriate syntax error message is generated.

## 7. Limitations

This grammar describes only the subset of C syntax implemented in the CodeCheck parser. It is not a complete grammar for the C programming language.

Features such as arrays, structures, pointer declarations and many other advanced C constructs are not supported.

## 8. Conclusion

The Context-Free Grammar provides the production rules for the supported C syntax in CodeCheck. The Recursive Descent Parser uses these rules to identify valid syntax and report syntax errors.
