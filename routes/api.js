var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api.ctrl');
var mdw = require('../middleware/api.auth');
const upload = require('../controllers/fileUpload');
const path = require('path');

//Home: http://localhost:3000/api/
router.get('/', async function (req, res, next) {
    res.render('api');
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
//Xem phòng: http://localhost:3000/api/rooms
router.get('/rooms', apiCtrl.xemPhong);
//Thêm phòng: http://localhost:3000/api/rooms
router.post('/rooms', apiCtrl.themPhong);
//Xoá phòng:http://localhost:3000/api/rooms/{id}
router.delete('/rooms/:id', apiCtrl.xoaPhong);
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
//Xoá khách sạn: http://localhost:3000/api/hotel/{id}
router.delete('/hotel/:id', apiCtrl.xoaKhachSan);
//đăng kí admin:
router.post('/register-admin', apiCtrl.registerAdmin);
//Xem phan hoi: http://localhost:3000/api/phanhoi
router.get('/phanhoi', apiCtrl.showPhanHoi);


router.post('/uploadimg', upload.single('img'), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(404).json('Please upload img');
        }
        const BASE_URL = 'http://192.168.0.105:3000/api/';
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
module.exports = router;