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

const validateEditProfileData = (req) => {
    const ALLOWED_UPDATES = ["firstName","lastName", "gender", "skills", "age", "photoUrl"]
    const updateAllowed = Object.keys(req.body).every(key => {
        return ALLOWED_UPDATES.includes(key)
    })
    return updateAllowed
}

module.exports = { validateSignUpData, validateEditProfileData }