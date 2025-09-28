const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../Model/connectionRequest");
const UserModal = require("../Model/User");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "skills", "age", "gender"])
        if (!connectionRequests.length > 0) {
            return res.status(400).send("No connection requests found!")
        }
        const filterOnlyfromData = connectionRequests.map(each => each.fromUserId)
        res.json(filterOnlyfromData)
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/user/connections", [userAuth], async (req, res) => {
    const loggedInUser = req.user;
    try {
        const allConnections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "skills", "age", "gender"])
            .populate("toUserId", ["firstName", "lastName", "skills", "age", "gender"])
        const filteredConnections = allConnections.map(each => {
            if (each.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return each.toUserId
            } else {
                return each.fromUserId
            }
        })
        res.send(filteredConnections)
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const allConnections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")
        const filteredConnections = new Set()
        allConnections.forEach(each => {
            filteredConnections.add(each.fromUserId.toString())
            filteredConnections.add(each.toUserId.toString())
        })
        const hideUserFromFeed = await UserModal.find({
            $and: [
                { _id: { $nin: Array.from(filteredConnections) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName age gender")
            .skip(skip)
            .limit(limit)
        res.send(hideUserFromFeed)
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = userRouter;