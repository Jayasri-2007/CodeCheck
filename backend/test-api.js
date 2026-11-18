
const code = `#include <stdio.h>
int main() {
    int age;
    scanf("%d", &age);
    printf("Hello");
    return 0;
}`;

fetch("http://localhost:5000/api/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    studentName: "Jayasri",
    language: "C",
    code: code
  })
})
  .then(response => response.json())
  .then(data => console.log("API RESULT:", data))
  .catch(error => console.log("API ERROR:", error));