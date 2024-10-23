var multer = require('multer');
var mdPhong = require('../model/phong_model');
var mdLoaiPhong = require('../model/loaiPhong_model');
var mdAccount = require('../model/account_model');
var mdOrderRoom = require('../model/datPhong_model');
var mdKhachSan = require('../model/khachSan_model');
var mdAccount_admin = require('../model/acount_admin_model');
var mdPhanHoi = require('../model/phanhoi_model');
var mdDichVu = require('../model/dichvu_model');
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
        console.log(req.body.email);
        const existUser = mdAccount.accountModel.findOne({ email: req.body.email});
        if (!existUser) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        } 
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
exports.registerAdmin = async (req, res, next) => {
    try {
        console.log(req.body.email);
        const existingUser = await mdAccount_admin.account_admin.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ status: 0, msg: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const user = new mdAccount_admin.account_admin(req.body);
        user.password = await bcrypt.hash(req.body.password, salt);
        const token = await user.generateAuthToken();
        let new_u = await user.save()
        return res.status(201).json({ status: 1, msg: 'Đăng ký thành công', token });
    } catch (error) {
        return res.status(201).send(error);
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
exports.xoaTk = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedUser = await mdAccount.accountModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng với ID đã cho' });
        }
        res.status(200).json({ msg: 'Xóa người dùng thành công', id });
    }catch(error){
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.themtk = async(req, res, next) => {
    try {
        console.log(req.body);
        const { username, diaChi, sdt, quocTich, ngaySinh, email, gioiTinh, cccd, avt_url } = req.body;
        const newAcc = mdAccount.accountModel.create({
            username: username,
            diaChi: diaChi,
            sdt: sdt,
            quocTich: quocTich,
            ngaySinh: ngaySinh,
            email: email,
            gioiTinh: gioiTinh,
            cccd: cccd,
            avt: avt_url
        });
        res.status(201).json({ msg: 'add acc succ' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
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
//sửa loại phòng 
exports.suaLoaiPhong = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedRoomType = await mdLoaiPhong.loaiPhongModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRoomType) {
            return res.status(404).json({ error: 'Không tìm thấy loại phòng với ID đã cho' });
        }

        res.status(200).json({ msg: 'Cập nhật loại phòng thành công', updatedRoomType });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
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
// Xóa loại phòng
exports.xoaLoaiPhong = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedTypeRoom = await mdLoaiPhong.loaiPhongModel.findByIdAndDelete(id);
        if (!deletedTypeRoom) {
            return res.status(404).json({ error: 'Không tìm thấy loại phòng với ID đã cho' });
        }
        res.status(200).json({ msg: 'Xóa loại phòng thành công', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};


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
        console.log(khachSan);
        if (!khachSan || khachSan.length === 0) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }

        const result = khachSan.map(hotel => ({
            _id: hotel._id,
            tenKhachSan: hotel.tenKhachSan,
            diaChi: hotel.diaChi,
            sdt: hotel.sdt,
            email: hotel.email,
            danhGia: hotel.danhGia,
            moTaKhachSan: hotel.moTaKhachSan,
            anhKhachSan: hotel.anhKhachSan
        }));

        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error });
    }
}

exports.getKhachSanById = async (req, res) => {
    try {
        const id = req.params.id;
        const hotel = await mdKhachSan.khachSanModel.findById(id);
        if (!hotel) {
            return res.status(404).json({ error: 'Không tìm thấy khách sạn' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error });
    }
};


exports.themKhachSan = async (req, res, next) => {
    try {
        console.log(req.body);
        const { tenKhachSan, diaChi, sdt, email, danhGia, moTaKhachSan, anhKhachSan } = req.body;
        // if (!req.file) {
        //     res.status(403).json({ msg: 'File not upload' });
        //     return;
        // }
        const newHotel = mdKhachSan.khachSanModel.create({
            tenKhachSan: tenKhachSan,
            diaChi: diaChi,
            sdt: sdt,
            email: email,
            danhGia: danhGia,
            moTaKhachSan: moTaKhachSan,
            anhKhachSan: anhKhachSan
        });
        if (!newHotel) {
            res.status(404).json({ msg: 'Không đủ thông tin' });
        }
        res.status(201).json({
            msg: 'Add hotel succ',
            maKhachSan: newHotel._id
        });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
exports.xoaKhachSan = async (req, res, next) => {
    try {
        const maKhachSan = req.params.id;
        const deletedHotel = await mdKhachSan.khachSanModel.findByIdAndDelete(maKhachSan);
        if (!deletedHotel) {
            return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID đã cho' });
        }
        res.status(200).json({ msg: 'Xóa khách sạn thành công', maKhachSan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}
exports.suaKhachSan = async (req, res, next) => {
    try {
        const maKhachSan = req.params.id;
        const updatedData = req.body;

        const updatedHotel = await mdKhachSan.khachSanModel.findByIdAndUpdate(maKhachSan, updatedData, { new: true });

        if (!updatedHotel) {
            return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID đã cho' });
        }

        res.status(200).json({ msg: 'Cập nhật khách sạn thành công', updatedHotel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}
exports.showPhanHoi = async (req, res, next) => {
    try {
        const phanHoi = await mdPhanHoi.phanHoiModel.find();
        console.log(phanHoi); 
        if (!phanHoi || phanHoi.length === 0) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        
        const result = phanHoi.map(phanHoi => ({
            _id: phanHoi._id,
            IdLoaiPhong: phanHoi.IdLoaiPhong,
            tenKhachHang: phanHoi.tenKhachHang,
            noiDung: phanHoi.noiDung,
            thoiGian: phanHoi.thoiGian
        }));

        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error });
    }
}


// Hiển thị tất cả dịch vụ
exports.showDichVu = async (req, res, next) => {
    try {
        const dichVu = await mdDichVu.DichVuModel.find();
        if (!dichVu) {
            return res.status(404).json({ error: 'Không tồn tại dịch vụ nào' });
        }
        res.status(200).json(dichVu);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error });
    }
};

// Thêm dịch vụ
exports.themDichVu = async (req, res, next) => {
    try {
        const { tenDichVu, giaDichVu, motaDichVu, anhDichVu } = req.body;

        const newDichVu = await mdDichVu.DichVuModel.create({
            tenDichVu: tenDichVu,
            giaDichVu: giaDichVu,
            motaDichVu: motaDichVu,
            anhDichVu: anhDichVu
        });

        res.status(201).json({
            msg: 'Thêm dịch vụ thành công',
            maDichVu: newDichVu._id 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error });
    }
};

// Xóa dịch vụ
exports.xoaDichVu = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedDichVu = await mdDichVu.DichVuModel.findByIdAndDelete(id);

        if (!deletedDichVu) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ với ID đã cho' });
        }

        res.status(200).json({ msg: 'Xóa dịch vụ thành công', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Sửa dịch vụ
exports.suaDichVu = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedDichVu = await mdDichVu.DichVuModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedDichVu) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ với ID đã cho' });
        }

        res.status(200).json({ msg: 'Cập nhật dịch vụ thành công', updatedDichVu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};