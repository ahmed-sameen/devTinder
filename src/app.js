const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const createDB = require("./Config/database")
const UserModal = require("./Model/User")
const { validateSignUpData } = require("./utils/validation")
const userAuth = require("./middlewares/auth")
const app = express();

app.use(express.json())
app.use(cookieParser())

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
})

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        // First check if user is registered
        const isUserRegistered = await UserModal.findOne({ emailId })
        if (!isUserRegistered) {
            throw new Error("Invalid credentials")
        }
        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, isUserRegistered.password)
        if (!isPasswordCorrect) {
            throw new Error("Invalid credentials")
        } else {
            const token = await jwt.sign({ _id: isUserRegistered._id }, "DEV@123", { expiresIn: "1d" });
            // Expire cookie in 3 hours
            res.cookie("token", token, { expires: new Date(Date.now() + 3 * 3600000) })
            res.send("Logged in successfuly!")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

app.patch("/user/:id", async (req, res) => {
    // Dont allow user to update userId(id), so get it in params
    const userId = req.params.id
    const ALLOWED_UPDATES = ["lastName", "gender"]
    try {
        const updateAllowed = Object.keys(req.body).every(key => {
            return ALLOWED_UPDATES.includes(key)
        })
        if (!updateAllowed) {
            throw new Error("Update not allowed!")
        } else {
            await UserModal.findByIdAndUpdate("68ceb0cad60b00446d2e54cc", req.body, {
                returnDocument: "after",
                runValidators: true
            })
            res.send("User updated Successfully!")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

app.delete("/user/:id", async (req, res) => {
    try {
        await UserModal.findByIdAndDelete(req.params.id)
        res.send("User deleted successfully!")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

app.use((err, req, res, next) => {
    console.log("ERROR: ", err);
})

createDB()
    .then((res) => {
        app.listen(9999, () => console.log("server listening on port 9999..."))
    })
    .catch(err => console.log("Error in DB Connection"))

