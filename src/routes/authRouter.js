const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt")

const { validateSignUpData } = require("../utils/validation")
const UserModal = require("../Model/User")


authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;
    try {
        validateSignUpData(req.body)
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new UserModal({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await user.save()
        res.send("User successfully saved!")
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        // First check if user is registered
        const isUserRegistered = await UserModal.findOne({ emailId })
        if (!isUserRegistered) {
            throw new Error("Invalid credentials")
        }
        // Check if password is correct
        const isPasswordCorrect = await isUserRegistered.validatePassword(password)
        if (!isPasswordCorrect) {
            throw new Error("Invalid credentials")
        } else {
            const token = await isUserRegistered.getJWT();
            // Expire cookie in 3 hours
            res.cookie("token", token, { expires: new Date(Date.now() + 3 * 3600000) })
            res.json(isUserRegistered)
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })
    res.send("Logged out successfuly")
})

module.exports = authRouter;