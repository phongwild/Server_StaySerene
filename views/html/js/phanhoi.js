const apiUrl = "http://192.168.1.4:3000/api/phanhoi";

// Lấy danh sách phản hồi từ API
async function fetchPhanHois() {
    try {
        const response = await fetch(apiUrl);
        const phanhois = await response.json();
        console.log(phanhois); // Kiểm tra dữ liệu trả về từ API
        displayPhanHois(phanhois); // Hiển thị phản hồi lên bảng
    } catch (error) {
        console.error('Lỗi khi fetch phanhois:', error);
    }
}

// Hiển thị danh sách phản hồi lên bảng
function displayPhanHois(phanhois) {
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = ""; // Xóa nội dung cũ (nếu có)

    phanhois.forEach((phanhoi) => {
        const row = document.createElement("tr");
        const maPhong = phanhoi.IdLoaiPhong || "N/A"; // Lấy mã phòng, kiểm tra nếu null
        const tenKhachHang = phanhoi.tenKhachHang || "N/A"; // Tên khách hàng
        const noiDung = phanhoi.noiDung || "N/A"; // Nội dung phản hồi
        const thoiGian = formatDate(phanhoi.thoiGian) || "N/A"; // Thời gian phản hồi

        row.innerHTML = `
            <td>${maPhong}</td>
            <td>${tenKhachHang}</td>
            <td>${noiDung}</td>
            <td>${thoiGian}</td>
        `;

        customerList.appendChild(row); // Thêm hàng mới vào bảng
    });
}

// Hàm định dạng ngày
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options); // Định dạng ngày theo kiểu Việt Nam
}

// Gọi hàm lấy dữ liệu khi trang được tải
window.onload = function() {
    fetchPhanHois();
};
