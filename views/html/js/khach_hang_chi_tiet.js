const APIa = `${base_url}accounta`;
const API = `${base_url}account`;
const APIOrderRoom = `${base_url}orderroom`; 
const customerId = sessionStorage.getItem('customerId'); 

async function fetchBookedRoomCountstatus01(customerId) {
    try {
        const res = await fetch(`${APIOrderRoom}/status/01/${customerId}`);
        const data = await res.json();

        if (res.ok) {
            document.getElementById('phongdangdat').value = data.length;
        } else {
            alert('Không thể tải số lượng phòng đang đặt.');
        }
    } catch (error) {
        console.error('Error fetching booked rooms count:', error);
        alert('Có lỗi khi tải số lượng phòng đang đặt.');
    }
}
async function fetchBookedRoomCountstatus2(customerId) {
    try {
        const res = await fetch(`${APIOrderRoom}/status/2/${customerId}`);
        const data = await res.json();

        if (res.ok) {
            document.getElementById('phongdatra').value = data.length;
        } else {
            alert('Không thể tải số lượng phòng đang đặt.');
        }
    } catch (error) {
        console.error('Error fetching booked rooms count:', error);
        alert('Có lỗi khi tải số lượng phòng đang đặt.');
    }
}
async function fetchBookedRoomCountstatus3(customerId) {
    try {
        const res = await fetch(`${APIOrderRoom}/status/3/${customerId}`);
        const data = await res.json();

        if (res.ok) {
            document.getElementById('phongdahuy').value = data.length;
        } else {
            alert('Không thể tải số lượng phòng đang đặt.');
        }
    } catch (error) {
        console.error('Error fetching booked rooms count:', error);
        alert('Có lỗi khi tải số lượng phòng đang đặt.');
    }
}

if (customerId) {
    fetchBookedRoomCountstatus01(customerId);
    fetchBookedRoomCountstatus2(customerId);
    fetchBookedRoomCountstatus3(customerId);
} else {
    alert('Không tìm thấy khách hàng!');
}

if (customerId) {
    fetchCustomerDetails(customerId);
} else {
    alert('Không tìm thấy khách hàng!');
}
if (customerId) {
    fetchTotalAmount(customerId);
} else {
    alert('Không tìm thấy khách hàng!');
}
async function fetchTotalAmount(Uid) {
    try {
        const res = await fetch(`${APIOrderRoom}/total/${Uid}`);
        const data = await res.json();
        
        if (res.ok) {
            const formattedAmount = formatCurrency(data.totalAmount);

            document.getElementById('tongtotal').value = formattedAmount;
        } else {
            const formattedAmount = formatCurrency(0);

            document.getElementById('tongtotal').value = formattedAmount        }
    } catch (error) {
        console.error('Error fetching total amount:', error);
        alert('Có lỗi khi tải tổng tiền chi trả!');
    }
}

async function fetchCustomerDetails(customerId) {
    try {
        const res = await fetch(`${APIa}/${customerId}`);
        const data = await res.json();

        document.getElementById('makhachhang').value = data._id;
        document.getElementById('tenkhachhang').value = data.username;
        document.getElementById('diachi').value = data.diaChi;
        document.getElementById('sdt').value = data.sdt;
        document.getElementById('quoctich').value = data.quocTich;
        document.getElementById('ngaysinh').value = data.ngaySinh;
        document.getElementById('email').value = data.email;
        document.getElementById('gioitinh').value = data.gioiTinh;
        document.getElementById('cccd').value = data.cccd;

        document.getElementById('avt-url').src = data.avt || 'default_avatar_url';
        document.getElementById('imgcccdtruoc').src = data.imgcccdtruoc || 'default_cccd_truoc_url';
        document.getElementById('imgcccdsau').src = data.imgcccdsau || 'default_cccd_sau_url';
    } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Có lỗi khi tải thông tin khách hàng!');
    }
}
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
async function deleteCustomer() {
    const customerId = document.getElementById('makhachhang').value;
    const customername = document.getElementById('tenkhachhang').value;
    const slpdd = document.getElementById('phongdangdat').value;
    
    if(slpdd > 0){
        alert(`Không thể xóa khách hàng ${customername}. Khách hàng này đang có ${slpdd} phòng đăng đặt`);
        return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
        try {
            const deleteRes = await fetch(`${API}/${customerId}`, {
                method: 'DELETE'
            });

            if (!deleteRes.ok) {
                throw new Error('Không thể kết nối đến máy chủ để xóa.');
            }

            alert(`Xóa tài khoản thành công, mã khách hàng: ${customerId}`);
            window.location.href = 'khachhang.html'; 
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Có lỗi khi xóa tài khoản.');
        }
    }
}
function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}