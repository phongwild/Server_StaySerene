const apiUrl = "http://192.168.1.12:3000/api/lichsu";

// Lấy danh sách lịch sử đặt phòng từ API
async function fetchLichSus() {
    try {
        const response = await fetch(apiUrl);
        const lichsus = await response.json();
        displayLichSus(lichsus); // Hiển thị lịch sử đặt phòng lên bảng
    } catch (error) {
        console.error('Lỗi khi fetch lichsus:', error);
    }
}

// Hiển thị danh sách lịch sử đặt phòng lên bảng
function displayLichSus(lichsus) {
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = ""; // Xóa nội dung cũ (nếu có)

    lichsus.forEach((lichsu) => {
        const row = document.createElement("tr");

        // Lấy giá trị từ API, kiểm tra nếu thuộc tính không có (null hoặc undefined)
        const maPhong = lichsu.IdLoaiPhong || "N/A"; // Mã phòng
        const tenPhong = lichsu.tenPhong || "N/A"; // Tên phòng
        const maKhachHang = lichsu.maKhachHang || "N/A"; // Mã khách hàng
        const tenKhachHang = lichsu.tenKhachHang || "N/A"; // Tên khách hàng
        const thoiGianDatPhong = formatDate(lichsu.thoiGianDatPhong) || "N/A"; // Thời gian đặt phòng
        const tongTien = lichsu.tongTien ? formatCurrency(lichsu.tongTien) : "N/A"; // Tổng tiền

        // Tạo hàng mới và điền dữ liệu
        row.innerHTML = `
            <td>${maPhong}</td>
            <td>${tenPhong}</td>
            <td>${maKhachHang}</td>
            <td>${tenKhachHang}</td>
            <td>${thoiGianDatPhong}</td>
            <td>${tongTien}</td>
        `;

        // Gán sự kiện onclick để hiển thị thông tin vào các input
        row.onclick = function() {
            document.getElementById('room-type').value = tenPhong;
            document.getElementById('customer-name').value = tenKhachHang;
            const bookingDate = new Date(lichsu.thoiGianDatPhong);
            bookingDate.setDate(bookingDate.getDate() + 1); // Cộng thêm 1 ngày
            document.getElementById('booking-time').value = bookingDate.toISOString().split('T')[0];
            document.getElementById('total-amount').innerText = tongTien;
        };

        customerList.appendChild(row); // Thêm hàng mới vào bảng
    });
}
// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
    return str;
}

// Hàm tìm kiếm khi nhập liệu vào ô tìm kiếm
function filterTable() {
    const searchInput = removeVietnameseTones(document.getElementById('search').value.toLowerCase());
    const rows = document.querySelectorAll("#customer-list tr");

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let match = false;

        // Kiểm tra từng ô trong hàng
        for (let i = 0; i < cells.length; i++) {
            const cellText = removeVietnameseTones(cells[i].innerText.toLowerCase());
            if (cellText.includes(searchInput)) {
                match = true;
                break;
            }
        }

        // Hiển thị hoặc ẩn hàng tùy vào kết quả tìm kiếm
        row.style.display = match ? "" : "none";
    });
}

// Hàm định dạng ngày (nếu cần thiết)
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options); // Định dạng ngày theo kiểu Việt Nam
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Gọi hàm lấy dữ liệu khi trang được tải
window.onload = function() {
    fetchLichSus();
};
