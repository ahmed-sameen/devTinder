const mongoose = require("mongoose")
const validator = require("validator")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email!")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Weak password!")
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    skills: {
        type: [String]
    },
    age: {
        type: Number,
        min: 18
    }
}, {
    timestamps: true
}
)

const UserModal = mongoose.model("User", userSchema)

module.exports = UserModal;