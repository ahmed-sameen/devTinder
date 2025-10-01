const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
        unique: true,
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
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) throw new Error("Invalid URl")
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

userSchema.methods.getJWT = async function () {
    const isUserRegistered = this;
    const token = await jwt.sign({ _id: isUserRegistered._id }, process.env.ECRYPT_KEY, { expiresIn: "1d" })
    return token;
}

userSchema.methods.validatePassword = async function (InputPassword) {
    const isUserRegistered = this;
    const isValidPassword = await bcrypt.compare(InputPassword, isUserRegistered.password);
    return isValidPassword;
}

// userSchema.index({ emailId: 1 })
// no need to index emailId as uniqure property is already used

const UserModal = mongoose.model("User", userSchema)

module.exports = UserModal;