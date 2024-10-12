var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api.ctrl');
var mdw = require('../middleware/api.auth');
const { phongModel } = require('../model/phong_model');
const upload = require('../controllers/fileUpload');

//Home: http://localhost:3000/api/
router.get('/', async function (req, res, next) {
    res.render('api');
});
//Login http://localhost:3000/api/login
router.post('/login', apiCtrl.doLogin);
//Register http://localhost:3000/api/register
router.post('/register', apiCtrl.doRegister);
//Xem tk:  http://localhost:3000/api/account
router.get('/account', apiCtrl.xemTk);
//Xem phòng: http://localhost:3000/api/rooms
router.get('/rooms', apiCtrl.xemPhong);
//Thêm phòng: http://localhost:3000/api/rooms
router.post('/rooms', apiCtrl.themPhong);
//Xoá phòng:http://localhost:3000/api/rooms/{id}
router.delete('/rooms/:id', apiCtrl.xoaPhong);
//Update phòng
router.put('/rooms/:id', apiCtrl.updatePhong);
//Thêm Loại Phòng: http://localhost:3000/api/typeroom
router.post('/typeroom', apiCtrl.themLoaiPhong);
//Xem loại phòng: http://localhost:3000/api/typeroom
router.get('/typeroom', apiCtrl.showLoaiPhong);
//Đặt phòng: http://localhost:3000/api/orderroom
router.post('/orderroom', apiCtrl.OrderRoom);
//Xem phòng đặt theo Uid: http://localhost:3000/api/orderroom/{Uid}
router.get('/orderroom/:Uid', apiCtrl.showOrderRoom);
//Xem khách sạn: http://localhost:3000/api/hotel
router.get('/hotel', apiCtrl.showKhachSan);
//Thêm khách sạn: http://localhost:3000/api/hotel
router.post('/hotel', apiCtrl.themKhachSan);
//Xoá khách sạn: http://localhost:3000/api/hotel/{id}
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);
//Update khách sạn
router.put('/hotel/:id', apiCtrl.updateKhachsan);
module.exports = router;