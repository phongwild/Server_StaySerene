var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api.ctrl');
var mdw = require('../middleware/api.auth');
const { phongModel } = require('../model/phong_model');
const upload = require('../controllers/fileUpload');

//Home: http://localhost:3000/api/
router.get('/', function(req, res, next){
    res.render('api')
});
//Login http://localhost:3000/api/login
router.post('/login', apiCtrl.doLogin);
//Register http://localhost:3000/api/register
router.post('/register', apiCtrl.doRegister);
//Xem tk:  http://localhost:3000/api/account
router.get('/account', apiCtrl.xemTk);
//lấy thông tin tài khoản theo ID
router.get('/account/:id', apiCtrl.getAccountById);
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
//Sửa khách sạn: http://localhost:3000/api/hotel
router.put('/hotel/:id', apiCtrl.suaKhachSan);
//Xóa khách sạn: http://localhost:3000/api/hotel
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);
//Xem chăm sóc :
router.get('/messenger', apiCtrl.getChamSoc);
//Xem chăm sóc theo id:
router.get('/messenger/:id', apiCtrl.getChamSocById);
//them chăm sóc :
router.post('/messenger', apiCtrl.themChamSoc);
//Sua chăm sóc :
router.put('/messenger/:id', apiCtrl.suaChamSoc);
//xoa chăm sóc :
router.delete('/messenger/:id', apiCtrl.xoaChamSoc);

module.exports = router;