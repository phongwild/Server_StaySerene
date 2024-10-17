const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const khachSanSchema = new db.mongoose.Schema(
    {
        tenKhachSan: {type: String, required: true},
        diaChi: {type: String, required: false, default: "Hà Nội"},
        sdt: {type: String, required: false, default: "0123456789"},
        email: {type: String, required: false, default: "abc@gmail.com"},
        danhGia: {type: Number, required: false, default: 3.5},
        moTaKhachSan: { type: String, required: false, default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
        anhKhachSan: { type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgxyZ1g-rXhddsw7Bpp7AKObz7qs7-o2uOg&s"}
    },
    {
        collection: 'KhachSan'
    }
);
// tao model
let khachSanModel = db.mongoose.model('khachSanModel', khachSanSchema);
module.exports = { khachSanModel }