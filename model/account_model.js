var db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const hiden_text = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");

const userSchema = new db.mongoose.Schema(
    {
        username: { type: String, required: true },
<<<<<<< HEAD
        sdt: { type: String, required: false, default: "0987654321" },
=======
        sdt: { type: String, required: false, default: "0123456789" },
>>>>>>> main
        diaChi: { type: String, required: false, default: "" },
        email: { type: String, required: true },
        password: { type: String, required: true},
        ngaySinh: { type: String, required: false, default: "" },
        gioiTinh: { type: String, required: false, default: "" },
        quocTich: { type: String, required: false, default: "" },
        avt: { type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq2k2sI1nZyFTtoaKSXxeVzmAwIPchF4tjwg&s" },
        role: { type: Number, required: false, default:1 },
        token: { type: String, required: false },
        cccd: {type: String, required: false, default: "0123456789"}
    },
    {
        collection: 'Account'
    }
);


/**
* Hàm tạo token để đăng nhập với API
* @returns {Promise<*>}
*/
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log(user);
    const token = jwt.sign({ _id: user._id, username: user.username }, hiden_text)
    // user.tokens = user.tokens.concat({token}) // code này dành cho nhiều token
    user.token = token;
    await user.save();
    return token;
}


/**
* Hàm tìm kiếm user theo tài khoản
* @param email
* @param password
* @returns {Promise<*>}
*/
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await accountModel.findOne({ email });
    if (!user) {
        throw new Error({ error: 'Không tồn tại user' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Sai password' });
    }
    return user;
}

// tao model
let accountModel = db.mongoose.model('accountModel', userSchema);
module.exports = { accountModel }