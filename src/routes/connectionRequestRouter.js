const express = require("express");
const connectionRequestRouter = express.Router()
const userAuth = require("../middlewares/auth")
const ConnectionRequestModel = require("../Model/connectionRequest")
const UserModal = require("../Model/User")

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    try {
        const toUserValid = await UserModal.findById(toUserId)
        if (!toUserValid) {
            throw new Error("Not a valid TO user")
        }
        const connectionRequestExist = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (connectionRequestExist) {
            throw new Error("Connection request already sent!")
        }
        const newConnection = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        await newConnection.save();
        res.send(`Connection reuqest sent to ${toUserValid?.firstName}!!`)
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)

    }

})


module.exports = connectionRequestRouter;