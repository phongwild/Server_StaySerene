const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const roomSchema = new db.mongoose.Schema(
    {
        IdPhong: { type: Number, required: true },
        IdLoaiPhong: { type: mongoose.Schema.ObjectId, required: true, ref: 'LoaiPhong' },
        IdKhuyenMai: { type: mongoose.Schema.ObjectId, required: false, ref: 'KhuyenMai' , default: ""},
        soPhong: { type: Number, required: true },
        soTang: { type: Number, required: false, default: 1 },
        moTaPhong: { type: String, required: false, default: "" },
        anhPhong: { type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgxyZ1g-rXhddsw7Bpp7AKObz7qs7-o2uOg&s" },
        tinhTrangPhong: { type: Number, require: false, default: 0 }
    },
    {
        collection: 'Phong'
    }
);
// tao model
let phongModel = db.mongoose.model('phongModel', roomSchema);
module.exports = { phongModel }