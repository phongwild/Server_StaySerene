var db = require('./db');
//định nghĩa khuôn mẫu
const roomSchema = new db.mongoose.Schema(
    {
        IdPhong:  { type: Number, required: true},
        loaiPhong: { type: Number, required: true },
        soPhong: { type: Number, required: true },
        moTaPhong: { type: String, required: false},
        anhPhong: { type: String, required: false }
    },
    {
        collection: 'Phong'
    }
);
// tao model
let phongModel = db.mongoose.model('phongModel', roomSchema);
module.exports = { phongModel }