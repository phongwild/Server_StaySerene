const { default: mongoose } = require('mongoose');
var db = require('./db');
//định nghĩa khuôn mẫu
const oderRoomSchema = new db.mongoose.Schema(
    {
        IdPhong: { type: mongoose.Schema.ObjectId, required: true, ref: 'Phong' },
        Uid: { type: mongoose.Schema.ObjectId, required: true, ref: 'Account' },
        IdDichVu: { type: mongoose.Schema.ObjectId, required: false, default: '66ed87d195b16c4ceaeee6d6', ref:'DichVu' },
        IdLoaiPhong: { type: mongoose.Schema.ObjectId, required: true, ref: 'LoaiPhong' },
        orderTime: { type: String, required: false, default: '21/9/2024' },
        timeGet: { type: String, required: false, default: '21/9/2024' },
        timeCheckout: { type: String, required: false, default: '21/9/2024' },
        note: { type: String, required: false, default: '' },
        total: { type: Number, required: true },
        status: { type: Number, required: false, default: 0 },
    },
    {
        collection: 'DatPhong'
    }
);
// tao model
let orderRoomModel = db.mongoose.model('orderRoomModel', oderRoomSchema);
module.exports = { orderRoomModel }