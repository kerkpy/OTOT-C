const jwt = require("jsonwebtoken");


const tokenKey = process.env.TOKEN_KEY || "abcde"
const verify = (roles) => {
    return (req, res, next) => {
        const token = req.body.token;
        if (!token) {
            return res.status(401).send("Token not found");
        }

        try {
            const verified = jwt.verify(token, tokenKey);
            req.user = verified;
            if (!roles.includes(verified.role)) {
                return res.status(403).send("No Admin Privileges");
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }

        return next();
    };
}

module.exports = verify;