var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api.ctrl');
var mdw = require('../middleware/api.auth');

//Home: http://localhost:3000/api/
router.get('/', function(req, res, next){
    res.json({ message: 'Welcome to the API!' });
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
//Thêm Loại Phòng: http://localhost:3000/api/typeroom
router.post('/typeroom', apiCtrl.themLoaiPhong);
//Xem loại phòng: http://localhost:3000/api/typeroom
router.get('/typeroom', apiCtrl.showLoaiPhong);
// Xóa loại phòng: http://localhost:3000/api/typeroom/:id
router.delete('/typeroom/:id', apiCtrl.xoaLoaiPhong);
// Sửa loại phòng: http://localhost:3000/api/typeroom/:id
router.put('/typeroom/:id', apiCtrl.suaLoaiPhong);
//Đặt phòng: http://localhost:3000/api/orderroom
router.post('/orderroom', apiCtrl.OrderRoom);
//Xem phòng đặt theo Uid: http://localhost:3000/api/orderroom/{Uid}
router.get('/orderroom/:Uid', apiCtrl.showOrderRoom);
//Xem khách sạn: http://localhost:3000/api/hotel
router.get('/hotel', apiCtrl.showKhachSan);
//Xem khách sạn theo id: http://localhost:3000/api/hotel/:id
router.get('/hotel/:id', apiCtrl.getKhachSanById);
//Thêm khách sạn: http://localhost:3000/api/hotel
router.post('/hotel', apiCtrl.themKhachSan);
//Xóa khách sạn: http://localhost:3000/api/hotel/:id
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);
//Sửa khách sạn: http://localhost:3000/api/hotel/:id
router.put('/hotel/:id', apiCtrl.suaKhachSan);

module.exports = router;