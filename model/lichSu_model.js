const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const lichSuSchema = new db.mongoose.Schema(
    {
        IdLichSu: { type: mongoose.Schema.ObjectId, required: true, ref: 'LichSu' },
        IdLoaiPhong: { type: String, required: true, default: '392' },
        tenPhong: {type: String, required: false, default: "Phòng gia đình"},
        maKhachHang: {type: String, required: false, default: "KH001"},
        tenKhachHang: {type: String, required: false, default: "Trần Tuấn Anh"},
        thoiGianDatPhong: {type: String, required: false, default: "10-10-2024"},
        tongTien: {type: String, required: false, default: "100,000"},
      },
    {
        collection: 'LichSu'
    }
);
// tao model
let lichSuModel = db.mongoose.model('lichSuModel', lichSuSchema);
module.exports = { lichSuModel }