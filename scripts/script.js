let display = document.getElementById('display');
let currentInput = '';
let savedInput = localStorage.getItem('calculatorInput') || '';
let memoryValue = localStorage.getItem('memoryValue') || 0;
let theme = localStorage.getItem('theme') || 'light';

if (theme === 'dark') {
    document.body.classList.add('dark-theme');
}

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput !== '' && !isNaN(currentInput[currentInput.length - 1])) {
        currentInput += operator;
        updateDisplay();
    } else if (operator === '-' && currentInput === '') {
        currentInput += operator;
        updateDisplay();
    }
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
        currentInput = 'Некорректное выражение';
        updateDisplay();
        currentInput = '';
        return;
    }


    if (currentInput.includes('/0')) {
        currentInput = 'Ошибка';
        updateDisplay();
        currentInput = '';
        return;
    }

    try {
        currentInput = eval(currentInput.replace('^', '**')).toString();
        updateDisplay();
    } catch (error) {
        if (error instanceof SyntaxError) {
            currentInput = 'Ошибка';
            updateDisplay();
            currentInput = '';
        } else {
            console.error("Неизвестная ошибка:", error);
            currentInput = 'Ошибка';
            updateDisplay();
            currentInput = '';
        }
    }
}
function isValidExpression(expression) {
    for (let i = 0; i < expression.length - 1; i++) {
        if (isOperator(expression[i]) && isOperator(expression[i + 1])) {
            return false;
        }
    }
    return true;
}

function isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
}

function saveToMemory() {
    memoryValue = parseFloat(display.value);
    localStorage.setItem('memoryValue', memoryValue.toString());
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
        document.querySelector('.theme-toggle').innerText = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        theme = 'light';
        document.querySelector('.theme-toggle').innerText = '🌙';
    }
    localStorage.setItem('theme', theme);
}

function updateDisplay() {
    display.value = currentInput;
}

window.onload = function() {
    currentInput = savedInput;
    updateDisplay();
};

function appendOperator(operator) {
    let lastChar = currentInput[currentInput.length - 1];

    if (isOperator(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else if (currentInput !== '' && !isNaN(currentInput[currentInput.length - 1])) {
        currentInput += operator;
    } else if (operator === '-' && currentInput === '') {
        currentInput += operator;
    }

    updateDisplay();
}

window.onbeforeunload = function() {
    localStorage.setItem('calculatorInput', currentInput);
};

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '^'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

