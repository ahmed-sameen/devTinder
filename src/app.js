const express = require("express")


const app = express();

app.use("/test", (req, res) => {
    res.end("hello from test")
})

app.listen(9999, () => console.log("server running"))
