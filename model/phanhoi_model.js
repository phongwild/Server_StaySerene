const { default: mongoose } = require('mongoose');
var db = require('./db');

const phanHoiSchema = new db.mongoose.Schema(
    {
    
        IdDatPhong: { type: mongoose.Schema.ObjectId, required: true, ref:'DatPhong'},
        Uid: {type: mongoose.Schema.ObjectId, required: false, default: "123"},
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