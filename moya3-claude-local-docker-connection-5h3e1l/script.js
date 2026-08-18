const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");

let previousValue = null;
let currentValue = "0";
let pendingOperator = null;
let justEvaluated = false;

const OPERATORS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? NaN : a / b),
};

function formatNumber(value) {
  if (!Number.isFinite(value)) return "エラー";
  const rounded = Math.round(value * 1e10) / 1e10;
  return rounded.toString();
}

function updateDisplay() {
  currentEl.textContent = currentValue;
  expressionEl.textContent =
    previousValue !== null && pendingOperator
      ? `${formatNumber(previousValue)} ${pendingOperator}`
      : "";
}

function inputDigit(digit) {
  if (justEvaluated) {
    currentValue = digit;
    previousValue = null;
    pendingOperator = null;
    justEvaluated = false;
    return;
  }
  currentValue = currentValue === "0" ? digit : currentValue + digit;
}

function inputDecimal() {
  if (justEvaluated) {
    currentValue = "0.";
    previousValue = null;
    pendingOperator = null;
    justEvaluated = false;
    return;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
}

function chooseOperator(op) {
  const value = parseFloat(currentValue);
  if (pendingOperator && !justEvaluated) {
    previousValue = OPERATORS[pendingOperator](previousValue, value);
    currentValue = formatNumber(previousValue);
  } else {
    previousValue = value;
  }
  pendingOperator = op;
  justEvaluated = false;
  currentValue = "0";
}

function equals() {
  if (!pendingOperator || previousValue === null) return;
  const value = parseFloat(currentValue);
  const result = OPERATORS[pendingOperator](previousValue, value);
  currentValue = formatNumber(result);
  previousValue = null;
  pendingOperator = null;
  justEvaluated = true;
}

function percent() {
  const value = parseFloat(currentValue);
  currentValue = formatNumber(value / 100);
}

function backspace() {
  if (justEvaluated) return;
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  pendingOperator = null;
  justEvaluated = false;
}

document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const { action, value } = btn.dataset;

  switch (action) {
    case "number":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(value);
      break;
    case "equals":
      equals();
      break;
    case "percent":
      percent();
      break;
    case "backspace":
      backspace();
      break;
    case "clear":
      clearAll();
      break;
  }
  updateDisplay();
});

const KEY_OPERATORS = { "+": "+", "-": "-", "*": "×", "/": "÷" };

window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    inputDigit(e.key);
  } else if (e.key === ".") {
    inputDecimal();
  } else if (KEY_OPERATORS[e.key]) {
    chooseOperator(KEY_OPERATORS[e.key]);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    equals();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "%") {
    percent();
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();
