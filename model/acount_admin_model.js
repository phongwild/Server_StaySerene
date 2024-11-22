var db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const hiden_text = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");

const account_adminSchema = new db.mongoose.Schema(
    {
        username: { type: String, required: true },
        sdt: { type: String, required: false, default: 123456789 },
        diaChi: { type: String, required: false, default: "" },
        email: { type: String, required: true },
        password: { type: String, required: true },
        ngaySinh: { type: String, required: false, default: "" },
        gioiTinh: { type: String, required: false, default: "" },
        quocTich: { type: String, required: false, default: "" },
        avt: { type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq2k2sI1nZyFTtoaKSXxeVzmAwIPchF4tjwg&s" },
        role: { type: Number, required: false, default: 0 },
        token: { type: String, required: false },
        cccd: { type: Number, required: false, default: 987654321 }
    },
    {
        collection: 'Admin'
    }
);

/**
 * Hàm tạo token để đăng nhập với API
 * @returns {Promise<*>}
 */
account_adminSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, username: user.username }, hiden_text);
    user.token = token;
    await user.save();
    return token;
}

// Corrected to use a regular function
account_adminSchema.statics.findByCredentials = async function (email, password) {
    const admin = await this.findOne({ email }); // 'this' correctly refers to the model
    if (!admin) {
        throw new Error('Không tồn tại user'); // "User does not exist"
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Sai password'); // "Incorrect password"
    }
    return admin;
};

// Create model
let account_admin = db.mongoose.model('account_admin', account_adminSchema);
module.exports = { account_admin };
