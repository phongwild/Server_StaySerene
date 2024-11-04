const express = require('express');
const router = express.Router();
const apiCtrl = require('../controllers/api.ctrl');
const upload = require('../controllers/fileUpload');

// Home route
router.get('/', (req, res) => {
  res.render('api');
});

// Authentication routes
router.post('/login', apiCtrl.doLogin);
router.post('/register', apiCtrl.doRegister);
router.post('/admin/login', apiCtrl.doLoginAdmin);
router.get('/admin', apiCtrl.getAdminAccounts);


// Account management routes
router.get('/account', apiCtrl.xemTk);
router.delete('/account/:id', apiCtrl.xoaTk);
router.post('/account', apiCtrl.themtk);
router.put('/account/:id', apiCtrl.suaTk);
router.get('/account/:id', apiCtrl.getAccountById);

// Room management routes
router.get('/rooms', apiCtrl.xemPhong);
router.post('/rooms', apiCtrl.themPhong);
router.get('/roombytyperoom/:id', apiCtrl.showRoomByTypeRoomId);
router.delete('/rooms/:id', apiCtrl.xoaPhong);
router.put('/rooms/:id', apiCtrl.suaPhong);
router.get('/rooms/:id', apiCtrl.getRoomById);

// Room type management routes
router.post('/typeroom', apiCtrl.themLoaiPhong);
router.get('/typeroom', apiCtrl.showLoaiPhong);
router.get('/typeroom/:id', apiCtrl.showLoaiPhongById);
router.get('/typeroombyidhotel/:id', apiCtrl.showLoaiPhongByIdHotel);
router.delete('/typeroom/:id', apiCtrl.xoaLoaiPhong);
router.put('/typeroom/:id', apiCtrl.suaLoaiPhong);

// Booking management routes
router.post('/orderroom', apiCtrl.OrderRoom);
router.get('/orderroom', apiCtrl.getAllOrders);
router.get('/orderroombyUid/:Uid', apiCtrl.showOrderRoom);
router.get('/orderroom/:id', apiCtrl.getOrderById);
router.get('/orderroombyidhotel/:id', apiCtrl.showOrderRoomByIdHotel);
router.put('/orderroom/:id', apiCtrl.editOrderRoom);

// Hotel management routes
router.get('/hotel', apiCtrl.showKhachSan);
router.get('/hotel/:id', apiCtrl.getKhachSanById);
router.post('/hotel', apiCtrl.themKhachSan);
router.put('/hotel/:id', apiCtrl.suaKhachSan);
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);

// Admin and employee routes
router.post('/register-admin', apiCtrl.registerAdmin);
router.get('/nhanvien', apiCtrl.showNhanVien);
router.post('/nhanvien', apiCtrl.themNhanVien);
router.delete('/nhanvien/:id', apiCtrl.xoaNhanVien);
router.put('/nhanvien/:id', apiCtrl.suaNhanVien);

// Feedback and services routes
router.get('/phanhoi', apiCtrl.showPhanHoi);
router.get('/phanhoibyidhotel/:id', apiCtrl.showPhanHoiByHotelId);
router.get('/dichvu', apiCtrl.showDichVu);
router.get('/dichvu/:id', apiCtrl.showDichVuById);
router.post('/dichvu', apiCtrl.themDichVu);
router.delete('/dichvu/:id', apiCtrl.xoaDichVu);
router.put('/dichvu/:id', apiCtrl.suaDichVu);
router.get('/dichvu/timkiem', apiCtrl.timKiemDichVu);

// File upload route
router.post('/uploadimg', upload.single('img'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(404).json('Please upload img');
    }
    const BASE_URL = 'http://192.168.1.4:3000/api/';
    const imgUrl = BASE_URL + 'uploads/' + file.filename;
    res.send({
      msg: 'Upload succ',
      url: imgUrl,
    });
  } catch (error) {
    console.error(error);
  }
});

// Customer care routes
router.get('/messenger', apiCtrl.getChamSoc);
router.get('/messenger/:id', apiCtrl.getChamSocById);
router.get('/messengerbyidhotel/:id', apiCtrl.getChamSocByIdHotel);
router.post('/messenger', apiCtrl.themChamSoc);
router.put('/messenger/:id', apiCtrl.suaChamSoc);
router.delete('/messenger/:id', apiCtrl.xoaChamSoc);



module.exports = router;
