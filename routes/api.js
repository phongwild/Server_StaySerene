var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api.ctrl');
var mdw = require('../middleware/api.auth');
const upload = require('../controllers/fileUpload');
const path = require('path');

//Home: http://localhost:3000/api/
router.get('/', function(req, res, next){
    res.render('api')
});
//Login http://localhost:3000/api/login
router.post('/login', apiCtrl.doLogin);
//Register http://localhost:3000/api/register
router.post('/register',apiCtrl.doRegister);
//Xem tk:  http://localhost:3000/api/account
router.get('/account', apiCtrl.xemTk);
//Xoa tk:
router.delete('/account/:id', apiCtrl.xoaTk);
router.post('/account', apiCtrl.themtk);
router.put('/account/:id', apiCtrl.suaTk);
//lấy thông tin tài khoản theo ID
router.get('/account/:id', apiCtrl.getAccountById);
//Xem phòng: http://localhost:3000/api/rooms
router.get('/rooms', apiCtrl.xemPhong);
//Xem phòng theo id: http://localhost:3000/api/rooms/:id
router.get('/rooms/:id', apiCtrl.showRoomByTypeRoomId);
//Thêm phòng: http://localhost:3000/api/rooms
router.post('/rooms', apiCtrl.themPhong);
//Xoá phòng:http://localhost:3000/api/rooms/{id}
router.delete('/rooms/:id', apiCtrl.xoaPhong);
router.put('/rooms/:id', apiCtrl.updatePhong);
//Thêm Loại Phòng: http://localhost:3000/api/typeroom
router.post('/typeroom', apiCtrl.themLoaiPhong);
//Xem loại phòng: http://localhost:3000/api/typeroom
router.get('/typeroom', apiCtrl.showLoaiPhong);
//Xem loại phòng theo id khách sạn: http://localhost:3000/api/typeroom/:id
router.get('/typeroom/:id', apiCtrl.showLoaiPhongByIdHotel);
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
//đăng kí admin:
router.post('/register-admin', apiCtrl.registerAdmin);
// nhân viên
router.get('/nhanvien',apiCtrl.showNhanVien)
// thêm nhân viên
router.post('/nhanvien',apiCtrl.themNhanVien);
// xóa nhân viên
router.delete('/nhanvien/:id',apiCtrl.xoaNhanVien);
//update nhân viên
router.put('/nhanvien/:id',apiCtrl.suaNhanVien);//Xem phan hoi: http://localhost:3000/api/phanhoi
router.get('/phanhoi', apiCtrl.showPhanHoi);

// Hiển thị tất cả dịch vụ
router.get('/dichvu', apiCtrl.showDichVu);

// Thêm dịch vụ
router.post('/dichvu', apiCtrl.themDichVu);

// Xóa dịch vụ
router.delete('/dichvu/:id', apiCtrl.xoaDichVu);

// Sửa dịch vụ
router.put('/dichvu/:id', apiCtrl.suaDichVu);

// Route tìm kiếm dịch vụ
router.get('/dichvu/timkiem', apiCtrl.timKiemDichVu);




router.post('/uploadimg', upload.single('img'), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(404).json('Please upload img');
        }
        const BASE_URL = 'http://192.168.1.4:3000/api/';
        const imgUrl = BASE_URL + 'uploads/' + file.filename;
        //const imgUrl = req.protocol + '://' + req.get('host') + '/api/uploads/' + file.filename;
        res.send({
            msg: 'Upload succ',
            url: imgUrl
        });
        
    } catch (error) {
        console.error(error);
        
    }
});
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

