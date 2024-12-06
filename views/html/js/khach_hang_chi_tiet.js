const APIa = `${base_url}accounta`;
const API = `${base_url}account`;
const customerId = sessionStorage.getItem('customerId'); // Lấy thông tin từ sessionStorage

if (customerId) {
    fetchCustomerDetails(customerId);
} else {
    alert('Không tìm thấy khách hàng!');
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

        // Cập nhật ảnh khách hàng
        document.getElementById('avt-url').src = data.avt || 'default_avatar_url';
        document.getElementById('imgcccdtruoc').src = data.imgcccdtruoc || 'default_cccd_truoc_url';
        document.getElementById('imgcccdsau').src = data.imgcccdsau || 'default_cccd_sau_url';
    } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Có lỗi khi tải thông tin khách hàng!');
    }
}

async function deleteCustomer() {
    const customerId = document.getElementById('makhachhang').value;

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