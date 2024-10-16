const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const typeRoomSchema = new db.mongoose.Schema(
    {
        IdKhachSan: { type: mongoose.Schema.ObjectId, required: true, ref:'KhachSan' },
        tenLoaiPhong: { type: String, required: true },
        moTaLoaiPhong: { type: String, required: false, default: "" },
        anhLoaiPhong: { type: String, required: false, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtgxyZ1g-rXhddsw7Bpp7AKObz7qs7-o2uOg&s"},
        soLuongPhong: { type: Number, required: false, default:10},
        giaLoaiPhong: { type: Number, required: true, default: 1000 },  
        tienNghi: { type: String, required: false, default: "" }
    },
    {
        collection: 'LoaiPhong'
    }
);
// tao model
let loaiPhongModel = db.mongoose.model('loaiPhongModel', typeRoomSchema);
module.exports = { loaiPhongModel }