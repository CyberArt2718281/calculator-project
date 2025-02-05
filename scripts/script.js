let display = document.getElementById('display');
let currentInput = '';
let savedInput = localStorage.getItem('calculatorInput') || '';
let memoryValue = Number(localStorage.getItem('memoryValue')) || 0;
let theme = localStorage.getItem('theme') || 'light';

const operators = ['+', '-', '*', '/', '^'];

if (theme === 'dark') {
    document.body.classList.add('dark-theme');
}

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculateResult() {
    if (!isValidExpression(currentInput)) {
        currentInput = 'Invalid Expression';
        updateDisplay();
        currentInput = '';
        return;
    }

    if (currentInput.includes('/0')) {
        currentInput = 'Division by zero';
        updateDisplay();
        currentInput = '';
        return;
    }

    try {
        currentInput = eval(currentInput.replace('^', '**')).toString();
        updateDisplay();
    } catch (error) {
        if (error instanceof SyntaxError) {
            currentInput = 'Syntax Error';
            updateDisplay();
            currentInput = '';
        } else {
            console.error("Unknown error:", error);
            currentInput = 'Error';
            updateDisplay();
            currentInput = '';
        }
    }
}

function isValidExpression(expression) {
    for (let i = 0; i < expression.length - 1; i++) {
        if (operators.includes(expression[i]) && operators.includes(expression[i + 1])) {
            return false;
        }
    }
    return true;
}

function saveToMemory() {
    if (display.value !== '') {
        memoryValue = parseFloat(display.value);
        localStorage.setItem('memoryValue', memoryValue.toString());
    }
}

function recallFromMemory() {
    currentInput += memoryValue;
    updateDisplay();
}

function clearMemory() {
    memoryValue = 0;
    localStorage.removeItem('memoryValue');
}

function toggleTheme() {
    if (theme === 'light') {
        document.body.classList.add('dark-theme');
        theme = 'dark';
        document.querySelector('.theme-toggle').innerHTML = '🌙';
    } else {
        document.body.classList.remove('dark-theme');
        theme = 'light';
        document.querySelector('.theme-toggle').innerHTML = '☀️';
    }
    localStorage.setItem('theme', theme);
}

function updateDisplay() {
    display.value = currentInput;
}

window.onload = function () {
    currentInput = savedInput;
    updateDisplay();
};

window.onbeforeunload = function () {
    localStorage.setItem('calculatorInput', currentInput);
};

function appendOperator(operator) {
    let lastChar = currentInput[currentInput.length - 1];

    if (operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else if (currentInput !== '' && !isNaN(currentInput[currentInput.length - 1])) {
        currentInput += operator;
    } else if (operator === '-' && currentInput === '') {
        currentInput += operator;
    }

    updateDisplay();
}

document.addEventListener('keydown', function (event) {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (operators.includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
