// This is an example program in Natural++

let max_count = 5;
let current = 1;

console.log("Counting from 1 to max_count:");

while (current <= max_count) {
if (current === 3) {
console.log("We hit three!");
} else if (current === 5) {
console.log("Final number!");
} else {
console.log(current);
}
current = current + 1;
}


function greet(name) {
let message = "Hello, " + name;
console.log(message);
return true;
}

console.log("---");
greet("Vimlesh");

console.log("---");
console.log("Repeating a block:");

for (let _i = 0; _i < 3; _i++) {
console.log("Iteration");
}
