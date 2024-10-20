const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const phanHoiSchema = new db.mongoose.Schema(
    {
        IdPhanHoi: { type: mongoose.Schema.ObjectId, required: true, ref: 'LoaiPhong' },
        IdLoaiPhong: { type: String, required: true, default: '392' },
        tenKhachHang: {type: String, required: false, default: "Trần Tuấn Anh"},
        noiDung: {type: String, required: false, default: "Dịch vụ rất tốt, nhân viên thân thiện!"},
        thoiGian: {type: String, required: false, default: "10-10-2024"},
      },
    {
        collection: 'PhanHoi'
    }
);
// tao model
let phanHoiModel = db.mongoose.model('phanHoiModel', phanHoiSchema);
module.exports = { phanHoiModel }