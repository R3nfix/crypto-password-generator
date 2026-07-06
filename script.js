'use strict';

const passwordInputEl = document.querySelector('[data-js-password]');
const passwordLengthEl = document.querySelector('[data-js-length]');
const copyBtnEl = document.querySelector('[data-js-copy]');
const generateBtnEl = document.querySelector('[data-js-generate]');
const errorLengthMessage = document.querySelector('.error-length');
const errorCheckboxMessage = document.querySelector('.error-checkbox');
const copyMessage = document.querySelector('.copy-msg');

const CHARSETS = {
    letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const checkboxes = {
    letters: document.querySelector('[data-js-letters]'),
    digits: document.querySelector('[data-js-digits]'),
    symbols: document.querySelector('[data-js-symbols]')
};

function getUnbiasedByte(max) {
    const limit = 256 - (256 % max);

    let value;

    do {
        value = crypto.getRandomValues(new Uint8Array(1))[0];
    } while (value >= limit);

    return value % max;
}

function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = getUnbiasedByte(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function buildCharset() {
    let charset = '';

    if (checkboxes.letters.checked) charset += CHARSETS.letters;
    if (checkboxes.digits.checked) charset += CHARSETS.digits;
    if (checkboxes.symbols.checked) charset += CHARSETS.symbols;

    return charset;
}

function generateCryptoPassword() {
    const charset = buildCharset();
    const length = parseInt(passwordLengthEl.value, 10);

    let hasError = false;

    if (!length || length < 4 || length > 128) {
        errorLengthMessage.classList.remove('hide');
        hasError = true;
    } else {
        errorLengthMessage.classList.add('hide');
    }

    if (!charset) {
        errorCheckboxMessage.classList.remove('hide');
        hasError = true;
    } else {
        errorCheckboxMessage.classList.add('hide');
    }

    if (hasError) {
        passwordInputEl.value = '';

        return;
    }

    const requiredChars = [];
    if (checkboxes.letters.checked) {
        requiredChars.push(CHARSETS.letters[getUnbiasedByte(CHARSETS.letters.length)]);
    }
    if (checkboxes.digits.checked) {
        requiredChars.push(CHARSETS.digits[getUnbiasedByte(CHARSETS.digits.length)]);
    }
    if (checkboxes.symbols.checked) {
        requiredChars.push(CHARSETS.symbols[getUnbiasedByte(CHARSETS.symbols.length)]);
    }

    const remainingLength = length - requiredChars.length;
    const randomChars = [];

    for (let i = 0; i < remainingLength; i++) {
        randomChars.push(charset[getUnbiasedByte(charset.length)]);
    }

    const allChars = [...requiredChars, ...randomChars];
    const shuffled = shuffleArray(allChars);

    passwordInputEl.value = shuffled.join('');
}

function copyPassword() {
    navigator
        .clipboard
        .writeText(passwordInputEl.value);

    copyMessage.classList.remove('hide')

    setTimeout(() => {
        copyMessage.classList.add('hide')
    }, 2000);
}

generateBtnEl.addEventListener('click', generateCryptoPassword);
copyBtnEl.addEventListener('click', copyPassword);