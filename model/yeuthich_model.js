const { default: mongoose } = require('mongoose');
var db = require('./db'); 

const yeuThichSchema = new db.mongoose.Schema(
    {
        IdLoaiPhong: { type: mongoose.Schema.ObjectId, required: true, ref: 'LoaiPhong' },
        Uid: { type: mongoose.Schema.ObjectId, required: true, ref: 'Account' }
    },
    {
        collection: 'YeuThich' 
    }
);

// Create model
let yeuThichModel = db.mongoose.model('yeuThichModel', yeuThichSchema);
module.exports = { yeuThichModel };
