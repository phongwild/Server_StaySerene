const { default: mongoose } = require('mongoose');
var db = require('./db');

const phanHoiSchema = new db.mongoose.Schema(
    {
    
        IdLoaiPhong: { type: String, required: true, default: '392' },
        tenKhachHang: {type: String, required: false, default: "Hoàng Thái Thượng"},
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