const express = require("express")
const createDB = require("./Config/database")
const UserModal = require("./Model/User")

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new UserModal(req.body)
    try {
        await user.save()
        res.send("User successfully saved!")
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
})

app.patch("/user/:id", async (req, res) => {
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
                returnDocument: "after"
            })
            res.send("User updated Successfully!")
        }
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }

})

app.delete("/user/:id", async (req, res) => {
    try {
        await UserModal.findByIdAndDelete(req.params.id)
        res.send("User deleted successfully!")
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
})

app.use((err, req, res, next) => {
    console.log("Error -> ", err);
})

createDB()
    .then((res) => {
        app.listen(9999, () => console.log("server listening on port 9999..."))
    })
    .catch(err => console.log("Error in DB Connection"))

