const mongoose = require("mongoose")

const createDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

module.exports = createDB;