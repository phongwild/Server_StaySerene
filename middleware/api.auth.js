const jwt = require('jsonwebtoken')
const { userModel } = require('../model/account_model');
require('dotenv').config(); // su dung thu vien doc file env
const hiden_text = process.env.TOKEN_SEC_KEY;


const api_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');

    if (typeof (header_token) == 'undefined') {
        return res.status(403).json({ msg: 'Không xác định token' });
    }

    const token = header_token.replace('Bearer ', '')

    try {
        const data = jwt.verify(token, hiden_text)
        console.log(data);
        const user = await userModel.findOne({ _id: data._id, token: token })
        if (!user) {
            throw new Error("Không xác định được người dùng")
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: error.message })
    }


}
module.exports = { api_auth }
