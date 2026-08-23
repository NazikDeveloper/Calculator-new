
const input = document.getElementById("input");

let isResult = false;

const plusMinus = document.getElementById("plus-minus");
const percent = document.getElementById("percent");
const divide = document.getElementById("divide");
const multiply = document.getElementById("multiply");
const minus = document.getElementById("minus");
const add = document.getElementById("add");
const comma = document.getElementById("comma");
const result = document.getElementById("result");


// =========================
// ЦИФРИ
// =========================

// =========================
// ЦИФРИ
// =========================

const numbers = document.querySelectorAll(".number, .number-zero");

numbers.forEach((button) => {
    button.addEventListener("click", () => {
        addNumber(button.textContent);
    });
});


// =========================
// ОПЕРАТОРИ
// =========================

add.addEventListener("click", () => {
    addOperator("+");
});

minus.addEventListener("click", () => {
    addOperator("-");
});

multiply.addEventListener("click", () => {
    addOperator("*");
});

divide.addEventListener("click", () => {
    addOperator("/");
});


// =========================
// ДЕСЯТКОВА КРАПКА
// =========================

comma.addEventListener("click", () => {
    const lastNumber = input.value.split(/[+\-*/]/).pop();

    if (lastNumber.includes(".")) {
        return;
    }

    if (
        input.value === "" ||
        ["+", "-", "*", "/"].includes(input.value.slice(-1))
    ) {
        input.value += "0.";
    } else {
        input.value += ".";
    }
});


// =========================
// C — ОЧИЩЕННЯ
// =========================

function cancel() {
    input.value = "";
    isResult = false;
}


// =========================
// +/−

plusMinus.addEventListener("click", () => {
    if (input.value === "" || input.value === "Error") {
        return;
    }

    const match = input.value.match(/(-?\d*\.?\d+)$/);

    if (!match) {
        return;
    }

    const number = match[0];
    const start = input.value.slice(0, -number.length);

    input.value = start + (-Number(number));
});


// =========================
// %
// =========================

percent.addEventListener("click", () => {
    if (input.value === "" || input.value === "Error") {
        return;
    }

    input.value = Number(input.value) / 100;
});


// =========================
// =
// =========================

result.addEventListener("click", () => {
    if (input.value === "" || input.value === "Error") {
        return;
    }

    const lastSymbol = input.value.slice(-1);

    // Якщо останній символ — оператор,
    // не виконуємо обчислення
    if (["+", "-", "*", "/"].includes(lastSymbol)) {
        return;
    }

    try {
        input.value = calculate(input.value);
        isResult = true;
    } catch {
        input.value = "Error";
        isResult = true;
    }
});


// =========================
// ДОДАВАННЯ ЧИСЛА
// =========================

function addNumber(number) {
    if (isResult) {
        input.value = number;
        isResult = false;
    } else {
        input.value += number;
    }
}


// =========================
// ДОДАВАННЯ ОПЕРАТОРА
// =========================

function addOperator(operator) {
    if (input.value === "" || input.value === "Error") {
        return;
    }

    const lastSymbol = input.value.slice(-1);

    // Не дозволяємо два оператори підряд
    if (["+", "-", "*", "/"].includes(lastSymbol)) {
        return;
    }

    // Після результату дозволяємо продовжити обчислення
    if (isResult) {
        isResult = false;
    }

    input.value += operator;
}


// =========================
// ОБЧИСЛЕННЯ
// =========================

function calculate(expression) {
    const numbers = expression.split(/[+\-*/]/).map(Number);
    const operators = expression.match(/[+\-*/]/g) || [];

    // -------------------------
    // Множення та ділення
    // -------------------------

    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "*" || operators[i] === "/") {
            const left = numbers[i];
            const right = numbers[i + 1];

            let calculation;

            if (operators[i] === "*") {
                calculation = left * right;
            } else {
                if (right === 0) {
                    throw new Error("Cannot divide by zero");
                }

                calculation = left / right;
            }

            numbers.splice(i, 2, calculation);
            operators.splice(i, 1);

            i--;
        }
    }

    // -------------------------
    // Додавання та віднімання
    // -------------------------

    let calculation = numbers[0];

    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "+") {
            calculation += numbers[i + 1];
        }

        if (operators[i] === "-") {
            calculation -= numbers[i + 1];
        }
    }

    return calculation;
}


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker зареєстровано");
            })
            .catch((error) => {
                console.error("Помилка Service Worker:", error);
            });
    });
}