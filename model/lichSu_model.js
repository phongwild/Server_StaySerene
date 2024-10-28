const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const lichSuSchema = new db.mongoose.Schema(
    {
        Uid: { type: String, required: true },
        dichVuID: {type: String, required: false},
        phongID: {type: String, required: false},
        thoiGianDatPhong: {type: String, required: false, default: "10-10-2024"},
        thoiGianNhan: {type: String, required: false, default: "10-11-2024"},
        thoiGianTra: {type: String, required: false, default: "10-13-2024"},
        ghiChu: {type: String, required: false, default: "aa"},
        tongTien: {type: Number, required: false, default: 100000},
        trangThai: {type: Number, required: false, default: 1},
        anhDatPhong: {type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgxyZ1g-rXhddsw7Bpp7AKObz7qs7-o2uOg&s"},

      },
    {
        collection: 'LichSu'
    }
);
// tao model
let lichSuModel = db.mongoose.model('lichSuModel', lichSuSchema);
module.exports = { lichSuModel }