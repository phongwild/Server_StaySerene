var db = require('./db');
//định nghĩa khuôn mẫu
const typeRoomSchema = new db.mongoose.Schema(
    {
        IdLoaiPhong: { type: Number, required: true },
        IdKhachSan: { type: Number, required: true },
        tenLoaiPhong: { type: Number, required: true },
        moTaLoaiPhong: { type: String, required: false },
        anhLoaiPhong: { type: String, required: false },
        soLuongPhong: { type: Number, required: false},
        giaPhong: { type: Number, required: true },
        dienTich: { type: Number, required: false },
        tienNghi: { type: String, required: false }
    },
    {
        collection: 'LoaiPhong'
    }
);
// tao model
let loaiPhongModel = db.mongoose.model('loaiPhongModel', typeRoomSchema);
module.exports = { loaiPhongModel }