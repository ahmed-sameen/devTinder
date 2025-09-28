const express = require("express")
const cookieParser = require("cookie-parser")

const createDB = require("./Config/database")
const app = express();
const authRouter = require("./routes/authRouter")
const profileRouter = require("./routes/profileRouter")
const connectionRequestRouter = require("./routes/connectionRequestRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json())
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRequestRouter)
app.use("/", userRouter)


app.use((err, req, res, next) => {
    console.log("ERROR: ", err);
})

createDB()
    .then((res) => {
        app.listen(9999, () => console.log("server listening on port 9999..."))
    })
    .catch(err => console.log("Error in DB Connection"))

