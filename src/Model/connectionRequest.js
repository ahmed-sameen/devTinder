const mongoose = require("mongoose")

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid status`
        }
    }
}, {
    timestamps: true
})

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to self!")
    }
    next();
})
// compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel;