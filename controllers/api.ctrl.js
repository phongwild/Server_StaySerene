var multer = require('multer');
var mdPhong = require('../model/phong_model');
var mdLoaiPhong = require('../model/loaiPhong_model');
var mdAccount = require('../model/account_model');
var mdOrderRoom = require('../model/datPhong_model');
var mdKhachSan = require('../model/khachSan_model');
var mdChamSoc = require('../model/chamSoc_model');
var mdDichVu = require('../model/dichvu_model');
var mdPhanHoi = require('../model/phanhoi_model');
var mdYeuThich = require('../model/yeuthich_model');
const { accountModel } = require('../model/account_model');



var mdAccount_admin = require('../model/acount_admin_model');
var mdNhanVien = require('../model/acconut_nhanvien_model');
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
            return res.status(200).send([user]);
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
        const existUser = mdAccount.accountModel.findOne({ email: req.body.email });
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
exports.checkExistUserGoogle = async(req, res, next) => {
    try {
        const Id_google = req.query.id;
        const user = await mdAccount.accountModel.findOne({Uid: Id_google});
        res.json(user !== null);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
        throw error;
    }
}
// Admin Login
exports.doLoginAdmin = async (req, res, next) => {
    try {
        console.log("Login attempt with:", req.body);
        const admin = await mdAccount_admin.account_admin.findByCredentials(req.body.email, req.body.password);
        console.log("Admin found:", admin);
        if (!admin) {
            return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
        }
        const token = await admin.generateAuthToken();
        return res.status(200).send({ admin, token });
    } catch (error) {
        console.log("Login error:", error.message);
        if (error.message === 'Không tồn tại user') {
            return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
        } else if (error.message === 'Sai password') {
            return res.status(401).json({ error: 'Mật khẩu admin sai' });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

exports.getAdminAccounts = async (req, res, next) => {
    try {
        const admins = await mdAccount_admin.account_admin.find();
        if (!admins || admins.length === 0) {
            return res.status(404).json({ error: 'No admin accounts found' });
        }
        return res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error while fetching admin accounts' });
    }
}


exports.xemTk = async (req, res) => {
    try {
        console.log('Request received at /api/account');
        const accounts = await mdAccount.accountModel.find();

        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ error: 'Không tồn tại tài khoản' });
        }

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error retrieving accounts:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};


exports.xoaTk = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedUser = await mdAccount.accountModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng với ID đã cho' });
        }
        res.status(200).json({ msg: 'Xóa người dùng thành công', id });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.themtk = async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, diaChi, role, token, sdt, password, quocTich, ngaySinh, email, gioiTinh, cccd, avt_url } = req.body;
        const newAcc = mdAccount.accountModel.create({
            username: username,
            sdt: sdt,
            diaChi: diaChi,
            email: email,
            password: password,
            ngaySinh: ngaySinh,
            gioiTinh: gioiTinh,
            quocTich: quocTich,
            cccd: cccd,
            role: role,
            token: token,
            avt: avt_url
        });
        res.status(201).json({ msg: 'add acc succ' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.suaTk = async (req, res) => {
    try {
        const accountId = req.params.id;
        const updatedData = req.body;

        console.log('Updating account with ID:', accountId);
        console.log('Data to update:', updatedData);

        const updatedAccount = await accountModel.findByIdAndUpdate(accountId, updatedData, { new: true });

        if (!updatedAccount) {
            console.error('Account not found for ID:', accountId);
            return res.status(404).json({ error: 'Không tìm thấy tài khoản với ID đã cho' });
        }

        console.log('Updated account:', updatedAccount);
        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Hiển thị tài khoản theo ID
exports.getAccountById = async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await mdAccount.accountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({ error: 'Không tìm thấy tài khoản với ID đã cho' });
        }

        // Trả về thông tin tài khoản
        res.status(200).json([account]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

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
exports.showRoomByTypeRoomId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const roomsById = await mdPhong.phongModel.find({ IdLoaiPhong: id });
        if (!roomsById) {
            return res.status(404).json({ error: 'Không tìm thấy phòng' });
        }
        res.status(200).json(roomsById);
    } catch (error) {
        return res.status(500).json({ error: `Lỗi server ` + error });
    }
}
// Hàm cập nhật thông tin phòng
exports.suaPhong = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID phòng không đúng định dạng' });
        }
        const updatedRoom = await mdPhong.phongModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ error: 'Không tìm thấy phòng với ID đã cho' });
        }
        res.status(200).json([updatedRoom]);
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin phòng:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Hiển thị phòng theo ID
exports.getRoomById = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await mdPhong.phongModel.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: 'Không tìm thấy phòng với ID đã cho' });
        }

        // Trả về thông tin phòng
        res.status(200).json([room]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
exports.showRoomByTypeRoomId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const roomsById = await mdPhong.phongModel.find({ IdLoaiPhong: id });
        if (!roomsById) {
            return res.status(404).json({ error: 'Không tìm thấy phòng' });
        }
        res.status(200).json(roomsById);
    } catch (error) {
        return res.status(500).json({ error: `Lỗi server ` + error });
    }
}
exports.getRoomByIdHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const rooms = await mdPhong.phongModel.find();

        const validRooms = [];

        for (const room of rooms) {
            const roomType = await mdLoaiPhong.loaiPhongModel.findById(room.IdLoaiPhong);

            if (roomType && roomType.IdKhachSan.toString() === hotelId) {
                validRooms.push(room);
            }
        }
        if (validRooms.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phòng cho khách sạn này.' });
        }
        return res.status(200).json(validRooms);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng theo ID khách sạn:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

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
// Xóa phòng
exports.xoaPhong = async (req, res, next) => {
    try {
        const ID_room = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(ID_room)) {
            return res.status(400).json({ error: 'ID phòng không đúng định dạng' });
        }
        const del_room = await mdPhong.phongModel.findByIdAndDelete(ID_room);

        if (!del_room) {
            return res.status(404).json({ error: 'Không tìm thấy phòng với ID đã cho' });
        }
        res.status(200).json({
            msg: 'Xóa phòng thành công',
            id: ID_room
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}
exports.updatePhong = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const update = await mdPhong.phongModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!update) {
            return res.status(404).json({ error: 'Không tìm thấy phòng với ID đã cho' });
        }
        res.status(200).json([update]);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server  ' + error });
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
//show loại phòng theo id khách sạn
exports.showLoaiPhongByIdHotel = async (req, res, next) => {
    try {
        const id = req.params.id;
        const loaiPhong = await mdLoaiPhong.loaiPhongModel.find({ IdKhachSan: id });
        if (!id) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(loaiPhong);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
exports.showLoaiPhongById = async (req, res, next) => {
    try {
        const id = req.params.id; // Lấy ID từ URL
        const loaiPhong = await mdLoaiPhong.loaiPhongModel.findById(id); // Tìm loại phòng theo ID

        if (!loaiPhong) {
            return res.status(404).json({ error: 'Không tìm thấy loại phòng' });
        }
        
        res.status(200).json([loaiPhong]); // Trả về dữ liệu loại phòng
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
};
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
        return res.status(201).json([newOrder])
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await mdOrderRoom.orderRoomModel.find();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ msg: 'Không có đơn đặt phòng nào' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
exports.getOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await mdOrderRoom.orderRoomModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ msg: 'Không tìm thấy đơn đặt phòng với ID đã cho' });
        }

        res.status(200).json([order]);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

//Xem phòng đã đặt
exports.showOrderRoom = async (req, res, next) => {
    try {
        const Uid = req.params.Uid;
        const orderroom = await mdOrderRoom.orderRoomModel.find({ Uid: Uid });
        if (!orderroom) {
            return res.status(404).json({ msg: 'User chưa đặt phòng nào' });
        }
        res.status(200).json(orderroom);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
exports.showOrderRoomByIdHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;

        const orders = await mdOrderRoom.orderRoomModel.find();

        const validOrders = [];

        for (const order of orders) {
            const room = await mdPhong.phongModel.findById(order.IdPhong);
            if (room) {
                const roomType = await mdLoaiPhong.loaiPhongModel.findById(room.IdLoaiPhong);
                if (roomType && roomType.IdKhachSan.toString() === hotelId) {
                    validOrders.push(order);
                }
            }
        }

        if (validOrders.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng cho khách sạn này.' });
        }

        res.status(200).json(validOrders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn đặt phòng theo ID khách sạn:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};


exports.editOrderRoom = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedData = req.body;

        console.log('Updating order with ID:', orderId);
        console.log('Data to update:', updatedData);
        const updatedOrder = await mdOrderRoom.orderRoomModel.findByIdAndUpdate(orderId, updatedData, { new: true });

        if (!updatedOrder) {
            console.error('Order not found for ID:', orderId);
            return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng với ID đã cho' });
        }

        console.log('Updated order:', updatedOrder);
        res.status(200).json({ msg: 'Cập nhật đơn đặt phòng thành công', updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

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
        res.status(200).json([hotel]);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server: ' + error });
    }
};


exports.themKhachSan = async (req, res, next) => {
    try {
        console.log(req.body);
        const { tenKhachSan, diaChi, sdt, email, danhGia, moTaKhachSan, anhKhachSan } = req.body;

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
// nhân viên
exports.showNhanVien = async (req, res, next) => {
    try {
        const NhanVien = await mdNhanVien.NhanVienModel.find();
        if (!NhanVien) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }
        res.status(200).json(NhanVien)
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
//thêm nhân viên
exports.themNhanVien = async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            IdKhachSan,
            username,
            sdt,
            anhNhanVien,
            password,
            email,
            gioLam,
            cccd

        } = req.body;
        const newHotel = mdNhanVien.NhanVienModel.create({
            makhachsan: makhachsan,
            username: username,
            sdt: sdt,
            anhNhanVien: anhNhanVien,
            password: password,
            email: email,
            gioLam: gioLam,
            cccd: cccd

        });
        res.status(201).json({
            msg: 'Add hotel oke',
            maKhachSan: newHotel._id
        });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server' + error });
    }
}
// delelte nhân viên
exports.xoaNhanVien = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedHotel = await mdNhanVien.NhanVienModel.findByIdAndDelete(id);
        if (!deletedHotel) {
            return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID đã cho' });
        }
        res.status(200).json({ msg: 'Xóa khách sạn thành công', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}
// sửa nhân viên
exports.suaNhanVien = async (req, res, next) => {
    try {
        const makhachsan = req.params.id;
        const updatedData = req.body;

        const updatedHotel = await mdNhanVien.NhanVienModel.findByIdAndUpdate(makhachsan, updatedData, { new: true });

        if (!updatedHotel) {
            return res.status(404).json({ error: 'Không tìm thấy khách sạn với ID đã cho' });
        }

        res.status(200).json({ msg: 'Cập nhật khách sạn thành công', updatedHotel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}

//Thêm Chăm Sóc
exports.themChamSoc = async (req, res) => {
    try {
        const { IdKhachSan, Uid, thoiGianGui, noiDungGui, vaiTro, trangThaiKh, trangThaiNv } = req.body;
        const newChamSoc = await mdChamSoc.ChamSocModel.create({
            IdKhachSan,
            Uid,
            thoiGianGui,
            noiDungGui,
            vaiTro,
            trangThaiKh,
            trangThaiNv
        });
        return res.status(201).json({ message: 'Thêm thành công', newChamSoc });
    } catch (error) {
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};
//hien thi cham soc 
exports.getChamSoc = async (req, res) => {
    try {
        const chamSocList = await mdChamSoc.ChamSocModel.find();
        if (!chamSocList || chamSocList.length === 0) {
            return res.status(404).json();
        }
        return res.status(200).json(chamSocList);
    } catch (error) {
        console.error("Error fetching chăm sóc records:", error);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

//hien thi theo ID
exports.getChamSocById = async (req, res) => {
    try {
        const chamSocId = req.params.id;
        const chamSocRecord = await mdChamSoc.ChamSocModel.findById(chamSocId);
        if (!chamSocRecord) {
            return res.status(404).json();
        }
        return res.status(200).json(chamSocRecord);
    } catch (error) {
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};
exports.getChamSocByIdHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const chamSocList = await mdChamSoc.ChamSocModel.find({ IdKhachSan: hotelId });
        if (!chamSocList || chamSocList.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chăm sóc cho khách sạn này.' });
        }
        return res.status(200).json(chamSocList);
    } catch (error) {
        console.error("Error fetching chăm sóc records:", error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

//sua cham soc 
exports.suaChamSoc = async (req, res) => {
    try {
        const chamSocId = req.params.id;
        const updateData = req.body;
        const updatedChamSoc = await mdChamSoc.ChamSocModel.findByIdAndUpdate(chamSocId, updateData, { new: true });
        if (!updatedChamSoc) {
            return res.status(404).json();
        }
        res.status(200).json(updateHt);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}
//xoa cham soc 
exports.xoaChamSoc = async (req, res) => {
    try {
        const chamSocId = req.params.id;
        const deletedChamSoc = await mdChamSoc.ChamSocModel.findByIdAndDelete(chamSocId);
        if (!deletedChamSoc) {
            return res.status(404).json();
        }
        return res.status(200).json({ message: 'Xóa thành công', deletedChamSoc });
    } catch (error) {
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.showPhanHoi = async (req, res, next) => {
    try {
        const phanHoi = await mdPhanHoi.phanHoiModel.find();
        console.log(phanHoi);
        if (!phanHoi || phanHoi.length === 0) {
            return res.status(404).json({ error: 'Không tồn tại' });
        }

        const result = phanHoi.map(phanHoi => ({
            _id: phanHoi._id,
            IdDatPhong: phanHoi.IdDatPhong,
            Uid: phanHoi.Uid,
            noiDung: phanHoi.noiDung,
            thoiGian: phanHoi.thoiGian
        }));

        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error });
    }
};
exports.themPhanHoi = async (req, res, next) => {
    try {
        const { IdDatPhong, Uid, noiDung, thoiGian } = req.body;

        const newPhanHoi = await mdPhanHoi.phanHoiModel.create({
            IdDatPhong: IdDatPhong,
            Uid: Uid,
            noiDung: noiDung || "Dịch vụ rất tốt, nhân viên thân thiện!",
            thoiGian: thoiGian || new Date().toISOString().split('T')[0]
        });

        res.status(201).json({ message: 'Phản hồi đã được thêm thành công', newPhanHoi });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

exports.showPhanHoiByHotelId = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const phanHoi = await mdPhanHoi.phanHoiModel.find();
        const validFeedbacks = [];

        for (const feedback of phanHoi) {
            const order = await mdOrderRoom.orderRoomModel.findById(feedback.IdDatPhong);
            if (order) {
                const room = await mdPhong.phongModel.findById(order.IdPhong);
                if (room) {
                    const loaiPhong = await mdLoaiPhong.loaiPhongModel.findById(room.IdLoaiPhong);
                    if (loaiPhong && loaiPhong.IdKhachSan.toString() === hotelId) {
                        validFeedbacks.push(feedback);
                    }
                }
            }
        }

        if (validFeedbacks.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy phản hồi cho khách sạn này.' });
        }

        res.status(200).json(validFeedbacks);
    } catch (error) {
        console.error('Lỗi khi lấy phản hồi theo ID khách sạn:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};


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

// Tìm kiếm dịch vụ theo tên
exports.timKiemDichVu = async (req, res, next) => {
    try {
        const { tenDichVu } = req.query;

        const dichVu = await mdDichVu.DichVuModel.find({
            tenDichVu: { $regex: tenDichVu, $options: 'i' }
        });

        if (!dichVu || dichVu.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ nào' });
        }

        res.status(200).json(dichVu);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};

// Hiển thị dịch vụ theo ID
exports.showDichVuById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const dichVu = await mdDichVu.DichVuModel.findById(id);

        if (!dichVu) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ với ID đã cho' });
        }

        res.status(200).json(dichVu);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
};
exports.addFavorite = async (req, res) => {
    try {
        const { IdLoaiPhong, Uid } = req.body;
        const newFavorite = new mdYeuThich.yeuThichModel({ IdLoaiPhong, Uid });
        await newFavorite.save();
        return res.status(201).json({ msg: 'Yêu thích đã được thêm thành công', favorite: newFavorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return res.status(500).json({ error: 'Lỗi server khi thêm yêu thích' });
    }
};
// Get all favorites for a specific user
exports.getFavoritesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await mdYeuThich.yeuThichModel.find({ Uid: userId });
        if (!favorites || favorites.length === 0) {
            return res.status(404).json({ error: 'Không có yêu thích nào' });
        }
        return res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return res.status(500).json({ error: 'Lỗi server khi lấy danh sách yêu thích' });
    }
};

// Remove a favorite
exports.removeFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const deletedFavorite = await mdYeuThich.yeuThichModel.findByIdAndDelete(favoriteId);
        if (!deletedFavorite) {
            return res.status(404).json({ error: 'Không tìm thấy yêu thích với ID đã cho' });
        }
        return res.status(200).json({ msg: 'Yêu thích đã được xóa thành công', id: favoriteId });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        return res.status(500).json({ error: 'Lỗi server khi xóa yêu thích' });
    }
};

// Update a favorite (if needed)
exports.updateFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const updatedData = req.body;
        const updatedFavorite = await mdYeuThich.yeuThichModel.findByIdAndUpdate(favoriteId, updatedData, { new: true });

        if (!updatedFavorite) {
            return res.status(404).json({ error: 'Không tìm thấy yêu thích với ID đã cho' });
        }

        return res.status(200).json({ msg: 'Yêu thích đã được cập nhật thành công', favorite: updatedFavorite });
    } catch (error) {
        console.error('Error updating favorite:', error);
        return res.status(500).json({ error: 'Lỗi server khi cập nhật yêu thích' });
    }
};