
# State Transition Table – CodeCheck

## 1. Introduction

The State Transition Table describes how the CodeCheck system moves from one state to another based on user actions and validation results.

## 2. State Transition Table

| Current State | Input / Condition | Next State | Action |
|---|---|---|---|
| S0 – Start | Application opened | S1 – Login | Display login page |
| S1 – Login | Valid login credentials | S2 – Code Input | Display student code submission page |
| S1 – Login | Invalid login credentials | S1 – Login | Display login error |
| S2 – Code Input | Code submitted | S3 – Lexical Analysis | Send code to validation server |
| S3 – Lexical Analysis | Valid tokens | S4 – Syntax Parsing | Pass tokens to parser |
| S3 – Lexical Analysis | Invalid token | S6 – Invalid | Generate lexical error |
| S4 – Syntax Parsing | Grammar accepted | S5 – Valid | Mark code as syntactically valid |
| S4 – Syntax Parsing | Syntax error detected | S6 – Invalid | Generate syntax error report |
| S5 – Valid | Result processing | S7 – Result | Display and save success result |
| S6 – Invalid | Error processing | S7 – Result | Display and save error report |

## 3. State Descriptions

- **S0 – Start:** The student opens the CodeCheck application.
- **S1 – Login:** The student enters login credentials.
- **S2 – Code Input:** The student enters and submits C source code.
- **S3 – Lexical Analysis:** The source code is converted into tokens.
- **S4 – Syntax Parsing:** The parser checks the tokens against supported grammar rules.
- **S5 – Valid:** The program passes syntax validation.
- **S6 – Invalid:** A lexical or syntax error is detected.
- **S7 – Result:** The validation report is displayed and stored.

## 4. Conclusion

The State Transition Table clearly explains the movement between different states in the CodeCheck system. It describes the conditions and actions involved in code submission and syntax validation.
