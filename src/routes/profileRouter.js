const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth")
const UserModal = require("../Model/User")
const { validateEditProfileData } = require("../utils/validation")


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    // req.user comes attached from userAuth
    const loggedInUser = req.user
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Update not allowed!")
        } else {
            const updatedData = await UserModal.findByIdAndUpdate(loggedInUser._id, req.body, {
                returnDocument: "after",
                runValidators: true
            })
            // res.send("User updated Successfully!")
            res.json({
                message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
                data: updatedData
            })

            // or can use below logic as well
            // Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
            // await loggedInUser.save()
            // res.json({
            //     message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
            //     data: loggedInUser
            // })
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }

})

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
    try {
        await UserModal.findByIdAndDelete(req.user._id)
        res.send("User deleted successfully!")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})
module.exports = profileRouter;