const { validateSyntax } = require("./parser");

const test1 = `#include <stdio.h>
int main() {
    printf("Hello");
    return 0;
}`;

const test2 = `#include <stdio.h>
int main() {
    int age;
    scanf("%d", &age);
    return 0;
}`;

const test3 = `#include <stdio.h>
int main() {
    int a = 10
    return 0;
}`;

console.log("TEST 1 - STDIO:", validateSyntax(test1));
console.log("TEST 2 - SCANF:", validateSyntax(test2));
console.log("TEST 3 - MISSING SEMICOLON:", validateSyntax(test3));