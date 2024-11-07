// src/utils/math.js

/**
 * Safely adds two numbers with overflow protection.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Sum of a and b
 */
function safeAdd(a, b) {
    const result = a + b;
    if (result < a || result < b) {
        throw new Error("SafeMath: addition overflow");
    }
    return result;
}

/**
 * Safely subtracts two numbers with underflow protection.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Difference of a and b
 */
function safeSub(a, b) {
    if (b > a) {
        throw new Error("SafeMath: subtraction underflow");
    }
    return a - b;
}

/**
 * Safely multiplies two numbers with overflow protection.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Product of a and b
 */
function safeMul(a, b) {
    if (a === 0 || b === 0) return 0;
    const result = a * b;
    if (result / a !== b) {
        throw new Error("SafeMath: multiplication overflow");
    }
    return result;
}

/**
 * Safely divides two numbers with division by zero protection.
 * @param {number} a - Numerator
 * @param {number} b - Denominator
 * @returns {number} - Quotient of a and b
 */
function safeDiv(a, b) {
    if (b === 0) {
        throw new Error("SafeMath: division by zero");
    }
    return a / b;
}

/**
 * Calculates the percentage of a value.
 * @param {number} value - The value to calculate the percentage of
 * @param {number} percentage - The percentage to calculate
 * @returns {number} - The calculated percentage
 */
function calculatePercentage(value, percentage) {
    return safeDiv(safeMul(value, percentage), 100);
}

module.exports = {
    safeAdd,
    safeSub,
    safeMul,
    safeDiv,
    calculatePercentage,
};
