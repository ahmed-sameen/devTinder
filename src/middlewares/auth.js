const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const UserModal = require("../Model/User")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorised!" )
        }
        const extractCookieData = await jwt.verify(token, process.env.ECRYPT_KEY)
        const { _id } = extractCookieData;
        const user = await UserModal.findById(_id)
        if (!user) {
            throw new Error("User not found")
        } else {
            req.user = user;
            next()
        }
    } catch (err) {
        res.status(400).send("Error -> " + err.message)
    }
}

module.exports = userAuth;