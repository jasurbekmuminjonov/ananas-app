const otpGenerator = require('otp-generator');

function generateOTP() {
    return otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
}

module.exports = generateOTP;
