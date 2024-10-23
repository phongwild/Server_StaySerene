const mongoose = require('mongoose');

// Định nghĩa schema cho DichVu
const DichVuSchema = new mongoose.Schema({
    tenDichVu: { type: String, required: true },
    giaDichVu: { type: Number, required: true },
    motaDichVu: { type: String, required: false },
    anhDichVu: { 
        type: String, 
        required: false, 
        default: "https://default-service-image-url.com"
    }
}, {
    collection: 'DichVu'
});

// Tạo model từ schema
let DichVuModel = mongoose.model('DichVuModel', DichVuSchema);

module.exports = { DichVuModel };