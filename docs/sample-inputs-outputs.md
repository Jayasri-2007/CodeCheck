
# Sample Inputs and Outputs – CodeCheck

## 1. Introduction

This document contains sample C programs used to test the syntax validation functionality of CodeCheck.

The examples demonstrate valid and invalid syntax according to the supported C grammar.

## 2. Sample Input 1 – Valid C Program

### Input

```c
#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    int sum = a + b;

    printf("Sum = %d", sum);

    return 0;
}
```

### Expected Output

```text
Syntax Valid

Syntax is valid!
```

## 3. Sample Input 2 – Valid C Program with Loop

### Input

```c
#include <stdio.h>

int main() {
    int i;

    for (i = 0; i < 5; i++) {
        printf("%d", i);
    }

    return 0;
}
```

### Expected Output

```text
Syntax Valid

Syntax is valid!
```

## 4. Sample Input 3 – Valid C Program with Conditional Statement

### Input

```c
#include <stdio.h>

int main() {
    int number = 10;

    if (number > 5) {
        printf("Greater");
    } else {
        printf("Smaller");
    }

    return 0;
}
```

### Expected Output

```text
Syntax Valid

Syntax is valid!
```

## 5. Sample Input 4 – Invalid C Program (Missing Semicolon)

### Input

```c
#include <stdio.h>

int main() {
    int a = 10
    printf("%d", a);

    return 0;
}
```

### Expected Output

```text
Syntax Error

Expected ';' at line 5, found 'printf'
```

## 6. Sample Input 5 – Invalid C Program (Missing Closing Brace)

### Input

```c
int main() {
    int a = 10;
    return 0;
```

### Expected Output

```text
Syntax Error

Expected '}' at line end of file, found 'end of file'
```

## 7. Sample Input 6 – Invalid C Program (Missing Main Function)

### Input

```c
int add(int a, int b) {
    return a + b;
}
```

### Expected Output

```text
Syntax Error

Missing required 'int main()' function.
```

## 8. Test Summary

| Test Case | Description | Expected Result |
|---|---|---|
| 1 | Basic C program | Valid |
| 2 | C program with for loop | Valid |
| 3 | C program with if-else | Valid |
| 4 | Missing semicolon | Invalid |
| 5 | Missing closing brace | Invalid |
| 6 | Missing main function | Invalid |

## 9. Conclusion

These sample test cases demonstrate how CodeCheck identifies valid C syntax and reports syntax errors using lexical analysis and recursive descent parsing.
