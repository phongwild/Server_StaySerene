const mongoose = require('mongoose');
var db = require('./db');

// Định nghĩa schema cho NhanVien
const NhanVienSchema = new db.mongoose.Schema({
    IdKhachSan: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'KhachSan' },
    username: { type: String, required: true },
    cccd:{type: String, required: false},
    sdt: { type: String, required: false, default: "123456" },
    anhNhanVien: { 
        type: String, 
        required: false, 
        default: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_3_31_638475246382568875_hinh-nen-may-tinh-4k-cong-nghe.jpg" 
    },
    password: { type: String, required: false, default: "12345678" },
    email: { type: String, required: false, default: "h@gmail.com" },
    gioLam: { type: String, required: false, default: "12" }
}, {
    collection: 'NhanVien'
});

// Tạo model từ schema
let NhanVienModel = mongoose.model('NhanVienModel', NhanVienSchema);

module.exports = { NhanVienModel };
