const jwt = require('jsonwebtoken')

const middleware = (req, res, next) => {
    const authHandler = req.headers.authorization

    // check if we have an header or the user is authorized
    if(!authHandler || !authHandler.startsWith("Bearer ")){
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    // take only the token not the full bearer fkdsnfkkdskfdkjkjdnk
    const token = authHandler.split(" ")[1]

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decode.userId;
        next()
    } catch (error) {
        res.status(401).json({ message: "invalid token"})
    }
}

module.exports = middleware