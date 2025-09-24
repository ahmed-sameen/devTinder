const mongoose = require("mongoose")

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested"],
            message: `{VALUE} is not a valid status`
        }
    }
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