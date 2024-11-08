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
router.get('/accounta', apiCtrl.xemTk);
router.delete('/account/:id', apiCtrl.xoaTk);
router.post('/account', apiCtrl.themtk);
router.put('/account/:id', apiCtrl.suaTk);
router.get('/account/:id', apiCtrl.getAccountById);
router.get('/accounta/:id', apiCtrl.getAccountByIda);
router.get('/accountac/:id', apiCtrl.getAccountByIdac);
router.get('/checkusergoogle',apiCtrl.checkExistUserGoogle);
router.post('/change-pass', apiCtrl.changePass);

// Room management routes
router.get('/rooms', apiCtrl.xemPhong);
router.get('/roomsa', apiCtrl.xemPhong);
router.get('/roombytyperoom/:id', apiCtrl.showRoomByTypeRoomId);
router.get('/rooms/:id', apiCtrl.getRoomById);
router.get('/roomsa/:id', apiCtrl.getRoomByIda);
router.post('/rooms', apiCtrl.themPhong);
router.get('/roombyidhotel/:id', apiCtrl.getRoomByIdHotel);
router.delete('/rooms/:id', apiCtrl.xoaPhong);
router.put('/rooms/:id', apiCtrl.suaPhong);

// Room type management routes
router.post('/typeroom', apiCtrl.themLoaiPhong);
router.get('/typeroom', apiCtrl.showLoaiPhong);
router.get('/typerooma', apiCtrl.showLoaiPhong);
router.get('/typeroom/:id', apiCtrl.showLoaiPhongById);
router.get('/typerooma/:id', apiCtrl.showLoaiPhongByIda);
router.get('/typeroombyidhotel/:id', apiCtrl.showLoaiPhongByIdHotel);
router.delete('/typeroom/:id', apiCtrl.xoaLoaiPhong);
router.put('/typeroom/:id', apiCtrl.suaLoaiPhong);
router.put('/typerooma/:id', apiCtrl.suaLoaiPhong);

// Booking management routes
router.post('/orderroom', apiCtrl.OrderRoom);
router.post('/orderrooma', apiCtrl.OrderRooma);
router.get('/orderroom', apiCtrl.getAllOrders);
router.get('/orderroombyUid/:Uid', apiCtrl.showOrderRoom);
router.get('/orderroom/:id', apiCtrl.getOrderById);
router.get('/orderroombyidhotel/:id', apiCtrl.showOrderRoomByIdHotel);
router.put('/orderroom/:id', apiCtrl.editOrderRoom);
router.get('/available-rooms', apiCtrl.getAvailableRooms);


// Hotel management routes
router.get('/hotel', apiCtrl.showKhachSan);
router.get('/hotela', apiCtrl.showKhachSan);
router.get('/hotel/:id', apiCtrl.getKhachSanById);
router.get('/hotela/:id', apiCtrl.getKhachSanByIda);
router.post('/hotel', apiCtrl.themKhachSan);
router.put('/hotel/:id', apiCtrl.suaKhachSan);
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);

// Admin and employee routes
router.post('/register-admin', apiCtrl.registerAdmin);
router.get('/nhanvien', apiCtrl.showNhanVien);
router.post('/nhanvien', apiCtrl.themNhanVien);
router.delete('/nhanvien/:id', apiCtrl.xoaNhanVien);
router.put('/nhanvien/:id', apiCtrl.suaNhanVien);

// Feedback routes
router.get('/phanhoi', apiCtrl.showPhanHoi);
router.get('/phanhoibyidhotel/:id', apiCtrl.showPhanHoiByHotelId);

//services management routes
router.get('/dichvu', apiCtrl.showDichVu);
router.get('/dichvu/:id', apiCtrl.showDichVuById);
router.post('/dichvu', apiCtrl.themDichVu);
router.delete('/dichvu/:id', apiCtrl.xoaDichVu);
router.put('/dichvu/:id', apiCtrl.suaDichVu);
router.get('/dichvu/timkiem', apiCtrl.timKiemDichVu);

// Customer care routes
router.get('/messenger', apiCtrl.getChamSoc);
router.get('/messenger/:id', apiCtrl.getChamSocById);
router.get('/messengerbyidhotel/:id', apiCtrl.getChamSocByIdHotel);
router.post('/messenger', apiCtrl.themChamSoc);
router.put('/messenger/:id', apiCtrl.suaChamSoc);
router.delete('/messenger/:id', apiCtrl.xoaChamSoc);
router.get('/messenger/:hotelId/:Uid', apiCtrl.getChamSocByIdHotelAndUid);

//Favorite management routes
router.post('/favorite', apiCtrl.addFavorite);           
router.get('/favorite/:userId', apiCtrl.getFavoritesByUser); 
router.delete('/favorite/:favoriteId', apiCtrl.removeFavorite);
router.put('/favorite/:favoriteId', apiCtrl.updateFavorite);   

module.exports = router;
