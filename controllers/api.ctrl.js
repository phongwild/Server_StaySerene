var mdPhong = require('../model/phong_model');
var mdLoaiPhong = require('../model/loaiPhong_model');
var mdAccount = require('../model/account_model');
var mdOrderRoom = require('../model/datPhong_model');
var mdKhachSan = require('../model/khachSan_model');
const bcrypt = require("bcrypt");
const { default: mongoose } = require('mongoose');

//Account
exports.doLogin = async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await mdAccount.accountModel.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
        } else {
            const token = await user.generateAuthToken();
            return res.status(200).send({
                msg: "Login succ",
                user, token
            });
        }
    } catch (error) {
        console.log(error)
        if (error.message === 'Không tồn tại user') {
            return res.status(401).json({ error: 'Sai thông tin đăng nhập' })
        } else if (error.message === 'Sai password') {
            return res.status(401).json({ error: 'Mật khẩu sai' })
        } else {
            return res.status(500).json({ error: error.message }) // Lỗi chung cho các vấn đề không mong muốn
        }
    }
}
exports.doRegister = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const user = new mdAccount.accountModel(req.body);
        user.password = await bcrypt.hash(req.body.password, salt);
        const token = await user.generateAuthToken();
        let new_u = await user.save()
        return res.status(201).json({ status: 1, msg: 'Đăng ký thành công', token });
    } catch (error) {
        return res.status(400).send(error)
    }
}
exports.xemTk = async (req, res, next) => {
    try {
        const account = await mdAccount.accountModel.find();
        if (!account) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(account);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
//Phòng
exports.xemPhong = async (req, res, next) => {
    try {
        const phong = await mdPhong.phongModel.find();
        if (!phong) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(phong);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.themPhong = async (req, res, next) => {
    try {
        console.log(req.body);
        const { IdPhong, IdLoaiPhong, IdKhuyenMai, soPhong, soTang, moTaPhong, anhPhong, tinhTrangPhong, giaPhong } = req.body;
        const newRoom = mdPhong.phongModel.create({
            IdPhong: IdPhong,
            IdLoaiPhong: IdLoaiPhong,
            IdKhuyenMai: IdKhuyenMai,
            soPhong: soPhong,
            soTang: soTang,
            moTaPhong: moTaPhong,
            anhPhong: anhPhong,
            tinhTrangPhong: tinhTrangPhong,
            giaPhong: giaPhong
        });
        res.status(201).json({ msg: 'add room succ' });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.xoaPhong = async (req, res, next) => {
    try {
        const ID_room = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(ID_room)) {
            return res.status(400).json({ msg: 'ID phòng k đúng định dạng' });
        }
        const del_room = await mdPhong.phongModel.findByIdAndDelete(ID_room);
        if (!del_room) {
            return res.status(404).json({ msg: 'Không tìm thấy phòng' });
        }
        res.status(200).json({
            msg: 'Xoá ID ' + ID_room + 'thành công'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
//Thêm loại phòng
exports.themLoaiPhong = async (req, res, next) => {
    try {
        console.log(req.body);
        const { IdKhachSan, tenLoaiPhong, moTaLoaiPhong, anhLoaiPhong, soLuongPhong, dienTich, tienNghi } = req.body;
        const newTypeRoom = mdLoaiPhong.loaiPhongModel.create({
            IdKhachSan: IdKhachSan,
            tenLoaiPhong: tenLoaiPhong,
            moTaLoaiPhong: moTaLoaiPhong,
            anhLoaiPhong: anhLoaiPhong,
            soLuongPhong: soLuongPhong,
            dienTich: dienTich,
            tienNghi: tienNghi
        });
        return res.status(201).json({ msg: 'Add room type succ' });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
//Loại phòng
exports.showLoaiPhong = async (req, res, next) => {
    try {
        const loaiPhong = await mdLoaiPhong.loaiPhongModel.find();
        if (!loaiPhong) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(loaiPhong)
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}

//Đặt phòng
exports.OrderRoom = async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            IdPhong,
            Uid,
            IdDichVu,
            orderTime,
            timeGet,
            timeCheckout,
            note,
            total,
            status
        } = req.body;
        if (!IdPhong || !Uid || !total) {
            return res.status(404).json({ error: 'Không đủ thông tin' });
        }
        const newOrder = mdOrderRoom.orderRoomModel.create({
            IdPhong: IdPhong,
            Uid: Uid,
            IdDichVu: IdDichVu,
            orderTime: orderTime,
            timeGet: timeGet,
            timeCheckout: timeCheckout,
            note: note,
            total: total,
            status: status
        });
        return res.status(201).json({
            msg: 'Room booked succ',
            newOrder: newOrder
        })
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
//Xem phòng đã đặt
exports.showOrderRoom = async (req, res, next) => {
    try {
        const Uid = req.params.Uid;
        const orderroom = await mdOrderRoom.orderRoomModel.find({ Uid });
        if (!orderroom) {
            return res.status(404).json({ msg: 'User chưa đặt phòng nào' });
        }
        res.status(200).json({ orderroom });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
//Khách sạn
exports.showKhachSan = async (req, res, next) => {
    try {
        const khachSan = await mdKhachSan.khachSanModel.find();
        if (!khachSan) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(khachSan);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
exports.themKhachSan = async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            tenKhachSan,
            diaChi,
            sdt,
            email,
            danhGia,
            moTaKhachSan,
            anhKhachSan
        } = req.body;
        const newHotel = mdKhachSan.khachSanModel.create({
            tenKhachSan: tenKhachSan,
            diaChi: diaChi,
            sdt: sdt,
            email: email,
            danhGia: danhGia,
            moTaKhachSan: moTaKhachSan,
            anhKhachSan: anhKhachSan
        });
        res.status(201).json({
            msg: 'Add hotel succ'
        });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
exports.xoaKhachSan = async (req, res, next) => {
    try {
        const ID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(ID)) {
            res.status(400).json({msg: 'ID không đúng định dạng'});
        }
        const del_ks = mdKhachSan.khachSanModel.findByIdAndDelete(ID);
        if (!del_ks) {
            res.status(404).json({msg: 'Không tìm thấy id khách sạn'});
        }
        res.status(200).json({msg: 'Xoá ID: ' + ID + 'thành công'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}