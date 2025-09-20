const validator = require("validator")

const validateSignUpData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name is not valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email id is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Weak password")
    }
}

module.exports = { validateSignUpData }