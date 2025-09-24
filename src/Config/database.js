const mongoose = require("mongoose")

const createDB = async () => {
    await mongoose.connect("mongodb+srv://mongologin:d0iGVnwsUQV6QQ0b@mongologin.frfuit8.mongodb.net/devTinder")
}

module.exports = createDB;