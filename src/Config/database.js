const mongoose = require("mongoose")

const createDB = async () => {
    await mongoose.connect("mongodb+srv://mongologin:cXoS7UrWd9OwkqQQ@mongologin.frfuit8.mongodb.net/devTinder")
}

module.exports = createDB;