const { default: mongoose } = require('mongoose');
var db = require('./db');
const chamSocSchema = new db.mongoose.Schema(
    {
        IdKhachSan: { type: mongoose.Schema.ObjectId, required: true, ref:'KhachSan' },
        Uid: { type: mongoose.Schema.ObjectId, required: true, ref:'KhachHang' },
        thoiGianGui: { type: String, required: false },
        noiDungGui: { type: String, required: false },
        vaiTro: { type: String, required: false },
        trangThaiKh: { type: Number, required: false },
        trangThaiNv: { type: Number, required: false },
    },
    {
        collection: 'ChamSoc'
    }
);
// tao model
let ChamSocModel = db.mongoose.model('ChamSocModel', chamSocSchema);
module.exports = { ChamSocModel }