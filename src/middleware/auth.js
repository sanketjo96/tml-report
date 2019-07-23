const ResponseData = require('../modals/response');
const User = require('../db/schema/user');
const jwt = require('jsonwebtoken');
const key = process.env.key;

const auth = (req, res, next) => {
    let token;
    const responseData = new ResponseData();
    try {
        token = req.headers.authorization.replace('Bearer ', '');
        let decode = jwt.verify(token, key);
        const user = User.findOne({_id: decode.id})
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        responseData.addErrors('Request is not authorized!!');
        res.status(401).send(responseData);
    }
}

module.exports = auth;